// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IServiceProviderEvents {
    event ServiceRequest(
        address indexed user,
        uint256 serviceId,
        bytes encryptionKey,
        uint256 timestamp
    );
    event ServiceFulfilled(
        address indexed user,
        bytes encryptedConnectionDetails,
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

interface IServiceProvider is IServiceProviderEvents, IServiceProviderErrors  {
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
        bytes calldata encryptionKey
    ) external;

    /// @dev Fulfill orders
    /// @param user The user who requested the service
    /// @param encryptedConnectionDetails The encrypted connection details for the service
    /// @param expiresAt The timestamp at which the service expires
    /// @param groupId The groupId of the order. Hash of the connection details
    function fulfillOrder(
        address user,
        bytes32 groupId,
        uint256 expiresAt,
        bytes calldata encryptedConnectionDetails
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
}
