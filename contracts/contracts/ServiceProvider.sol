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

    /// @dev Mapping from user address to order
    mapping(address => bytes32) public userToGroupId;
    mapping(bytes32 => address[]) public groupIdToUsers;

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
        uint256 _price
    ) Reputation(_worldId, _appId, _actionId) {
        paymentToken = _token;
        provider = msg.sender;
        price = _price;
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
        bytes calldata encryptionKey
    ) external {
        // check if user has enough reputation
        if (_recommendationsCount(msg.sender) < 1) {
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

        emit ServiceRequest(
            msg.sender,
            serviceId,
            encryptionKey,
            block.timestamp
        );
    }

    /// @inheritdoc IServiceProvider
    function fulfillOrder(
        address user,
        bytes32 groupId,
        uint256 expiresAt,
        bytes calldata encryptedConnectionDetails
    ) external onlyProvider {
        // add to list of users for groupId
        if (userToGroupId[user] != groupId) {
            groupIdToUsers[groupId].push(user);
            userToGroupId[user] = groupId;
        }

        emit ServiceFulfilled(user, encryptedConnectionDetails, expiresAt);
    }

    /// @inheritdoc IServiceProvider
    function reportGroupId(bytes32 groupId) external {
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
}
