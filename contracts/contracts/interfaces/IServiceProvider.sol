// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IServiceProviderEvents {
    event NewServiceRequest(
        uint256 requestId,
        uint256 serviceId,
        string encryptionKey,
        uint256 timestamp
    );
    event ServiceFulfilled(
        uint256 requestId,
        string encryptedConnectionDetails,
        uint256 expiresAt
    );
    event Withdrawal(address indexed provider, uint256 amount);
}

interface IServiceProviderErrors {
    error NotEnoughReputation();
    error OnlyProvider();
    error TransferFailed();
    error ZeroAmount();
    error InsufficientBalance();
}

interface IServiceProviderStructs {
    struct ServiceRequest {
        uint256 id;
        address user;
        uint256 serviceId;
        string encryptionKey;
        string encryptedConnectionDetails;
        uint256 timestamp;
        bool fulfilled;
        uint256 expiresAt;
    }
}

interface IServiceProvider is
    IServiceProviderEvents,
    IServiceProviderErrors,
    IServiceProviderStructs
{
    /// @dev Recommend a user to allow them to request a service
    /// @param user The user to recommend
    /// @param root The root of the merkle tree
    /// @param nullifierHash The nullifier hash of the merkle tree
    /// @param proof The proof of the merkle tree
    function recommend(
        address user,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external;

    /// @dev Get recommendations count
    /// @param user The user to get recommendations count for
    function recommendationsCount(address user) external view returns (uint256);

    /// @dev Request service. Requires user to have enough reputation
    /// @param serviceId The id of the country at which the service is requested
    /// @param encryptionKey The encryption key for the service
    function requestService(
        uint256 serviceId,
        string calldata encryptionKey
    ) external;

    /// @dev Fulfill orders
    /// @param requestId The requestId
    /// @param encryptedConnectionDetails The encrypted connection details for the service
    /// @param groupId The groupId of the order. Hash of the connection details
    function fulfill(
        uint256 requestId,
        bytes32 groupId,
        string calldata encryptedConnectionDetails
    ) external;

    /// @dev Fulfill orders
    /// @param requestId The requestId
    /// @param encryptedConnectionDetails The encrypted connection details for the service
    /// @param groupId The groupId of the order. Hash of the connection details
    function batchFulfill(
        uint256[] memory requestId,
        bytes32[] memory groupId,
        string[] calldata encryptedConnectionDetails
    ) external;

    /// @dev Report groupId. Slash reputation of all users in group
    /// @param groupId The groupId of the order. Hash of the connection details
    function reportGroupId(bytes32 groupId) external;

    /// @dev Set price of the service
    /// @param _price The new price
    function setPrice(uint256 _price) external;

    /// @dev Withdraw funds from contract
    /// @param amount The amount of tokens to withdraw
    function withdraw(uint256 amount) external;

    /// @dev Get balance of the contract
    function balance() external view returns (uint256);

    function getServiceRequestForUser(
        address user
    ) external view returns (ServiceRequest memory);
}
