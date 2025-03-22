// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ByteHasher} from "./ByteHasher.sol";
import {IWorldID} from "../interfaces/IWorldID.sol";

interface IReputationErrors {
    /// @notice Thrown when attempting to reuse a nullifier
    error DuplicateNullifier(uint256 nullifierHash);

    error AlreadyRecommended();
}

interface IReputationEvents {
    /// @param nullifierHash The nullifier hash for the verified proof
    /// @dev A placeholder event that is emitted when a user successfully verifies with World ID
    event Verified(uint256 nullifierHash);
}

contract Reputation is IReputationErrors, IReputationEvents {
    using ByteHasher for bytes;

    /// @dev The World ID instance that will be used for verifying proofs
    IWorldID internal immutable worldId;

    /// @dev The contract's external nullifier hash
    uint256 internal immutable externalNullifier;

    /// @dev The World ID group ID (always 1)
    uint256 internal immutable groupId = 1;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
    mapping(uint256 => bool) public nullifierHashes;

    /// @dev recommendations count
    mapping(address => uint256) public recommendations;

    /// @dev to check if we have already recommended
    mapping(address => mapping(address => bool)) public recommended;

    /// @param _worldId The WorldID router that will verify the proofs
    /// @param _appId The World ID app ID
    /// @param _actionId The World ID action ID
    constructor(
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId
    ) {
        worldId = _worldId;
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
            .hashToField();
    }

    /// @param recommendedUser An arbitrary input from the user
    /// @param root The root of the Merkle tree (returned by the JS widget).
    /// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the JS widget).
    /// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the JS widget).
    /// @dev Feel free to rename this method however you want! We've used `claim`, `verify` or `execute` in the past.
    function _recommend(
        address recommendedUser,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) internal {
        // TODO: currently mocked as per worldid app issue
        // // First, we make sure this person hasn't done this before
        // if (nullifierHashes[nullifierHash]) {
        //     revert DuplicateNullifier(nullifierHash);
        // }

        // // We now verify the provided proof is valid and the user is verified by World ID
        // worldId.verifyProof(
        //     root,
        //     groupId,
        //     abi.encodePacked(recommendedUser).hashToField(),
        //     nullifierHash,
        //     externalNullifier,
        //     proof
        // );

        // // We now record the user has done this, so they can't do it again (proof of uniqueness)
        // nullifierHashes[nullifierHash] = true;

        if (recommended[msg.sender][recommendedUser]) {
            revert AlreadyRecommended();
        }

        // increment recommendation count
        recommendations[recommendedUser]++;
        recommended[msg.sender][recommendedUser] = true;
        
        emit Verified(nullifierHash);
    }

    /// @dev Get the number of recommendations for a given user
    function _recommendationsCount(
        address user
    ) internal view returns (uint256) {
        return recommendations[user];
    }

    /// @dev Slash reputation for a given user
    function _slashReputation(address user) internal {
        recommendations[user] -= 1;
    }
}
