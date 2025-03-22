// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Reputation} from "./helpers/Reputation.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IServiceProvider} from "./interfaces/IServiceProvider.sol";

contract ServiceProvider is Reputation, IServiceProvider {
    uint256 public price;
    address public provider;
    IERC20 public paymentToken;
    uint256 public expirationTime;
    uint256 public minReputation;

    /// @dev Mapping from user address to order
    mapping(address => bytes32) public userToGroupId;
    mapping(bytes32 => address[]) public groupIdToUsers;

    mapping(address => uint256) public userToRequest;
    mapping(uint256 => ServiceRequest) public requests;
    uint256 public nextRequestId;

    modifier onlyProvider() {
        if (msg.sender != provider) {
            revert OnlyProvider();
        }
        _;
    }

    constructor(
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId,
        IERC20 _token,
        uint256 _price,
        uint256 _expirationTime,
        uint256 _minReputation
    ) Reputation(_worldId, _appId, _actionId) {
        paymentToken = _token;
        provider = msg.sender;
        price = _price;
        expirationTime = _expirationTime;
        minReputation = _minReputation;
    }

    /// @inheritdoc IServiceProvider
    function recommend(
        address user,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        _recommend(user, root, nullifierHash, proof);
    }

    /// @inheritdoc IServiceProvider
    function recommendationsCount(
        address user
    ) external view returns (uint256) {
        return _recommendationsCount(user);
    }

    /// @inheritdoc IServiceProvider
    function requestService(
        uint256 serviceId,
        string calldata encryptionKey
    ) external {
        // check if user has enough reputation
        if (_recommendationsCount(msg.sender) < minReputation) {
            revert NotEnoughReputation();
        }

        // withdraw funds from user
        bool success = paymentToken.transferFrom(
            msg.sender,
            address(this),
            price
        );
        if (!success) {
            revert TransferFailed();
        }

        // create request
        userToRequest[msg.sender] = nextRequestId;
        requests[nextRequestId] = ServiceRequest({
            id: nextRequestId,
            user: msg.sender,
            serviceId: serviceId,
            encryptionKey: encryptionKey,
            timestamp: block.timestamp,
            encryptedConnectionDetails: "",
            fulfilled: false,
            expiresAt: 0
        });
        emit NewServiceRequest(
            nextRequestId,
            serviceId,
            encryptionKey,
            block.timestamp
        );

        // increment request id
        nextRequestId += 1;
    }

    /// @inheritdoc IServiceProvider
    function fulfill(
        uint256 requestId,
        bytes32 groupId,
        string calldata encryptedConnectionDetails
    ) public onlyProvider {
        // TODO: attach user to group
        // if (userToGroupId[requests[requestId].user] != groupId) {
        //     groupIdToUsers[groupId].push(requests[requestId].user);
        //     userToGroupId[requests[requestId].user] = groupId;
        // }

        // fulfill request
        ServiceRequest storage request = requests[requestId];
        request.fulfilled = true;
        request.encryptedConnectionDetails = encryptedConnectionDetails;
        request.expiresAt = block.timestamp + expirationTime;

        emit ServiceFulfilled(
            requestId,
            encryptedConnectionDetails,
            block.timestamp + expirationTime
        );
    }

    /// @inheritdoc IServiceProvider
    function batchFulfill(
        uint256[] memory requestId,
        bytes32[] memory groupId,
        string[] calldata encryptedConnectionDetails
    ) external onlyProvider {
        for (uint256 i = 0; i < requestId.length; i++) {
            fulfill(requestId[i], groupId[i], encryptedConnectionDetails[i]);
        }
    }

    /// @inheritdoc IServiceProvider
    function reportGroupId(bytes32 groupId) external {
        // TODO: users may change groupId

        // for each order with such a groupId slash reputation of user
        address[] memory users = groupIdToUsers[groupId];

        for (uint256 i = 0; i < users.length; i++) {
            _slashReputation(users[i]);
        }
    }

    /// @inheritdoc IServiceProvider
    function setPrice(uint256 _price) external onlyProvider {
        price = _price;
    }

    /// @inheritdoc IServiceProvider
    function withdraw(uint256 amount) external onlyProvider {
        if (amount == 0) {
            revert ZeroAmount();
        }

        // Check if contract has enough balance
        if (paymentToken.balanceOf(address(this)) >= amount) {
            revert InsufficientBalance();
        }

        // Transfer tokens to provider
        bool success = paymentToken.transfer(provider, amount);
        if (!success) {
            revert TransferFailed();
        }

        emit Withdrawal(provider, amount);
    }

    /// @inheritdoc IServiceProvider
    function balance() external view returns (uint256) {
        return IERC20(paymentToken).balanceOf(address(this));
    }

    /// @inheritdoc IServiceProvider
    function getServiceRequestForUser(
        address user
    ) external view returns (ServiceRequest memory) {
        return requests[userToRequest[user]];
    }

    function getUnfulfilledRequests()
        external
        view
        returns (ServiceRequest[] memory)
    {
        uint256 count = 0;

        // First, count the number of unfulfilled requests
        for (uint256 i = 0; i < nextRequestId; i++) {
            if (!requests[i].fulfilled) {
                count++;
            }
        }

        // Create a fixed-size array
        ServiceRequest[] memory unfulfilledRequests = new ServiceRequest[](
            count
        );
        uint256 index = 0;

        // Populate the array
        for (uint256 i = 0; i < nextRequestId; i++) {
            if (!requests[i].fulfilled) {
                unfulfilledRequests[index] = requests[i];
                index++;
            }
        }

        return unfulfilledRequests;
    }
}
