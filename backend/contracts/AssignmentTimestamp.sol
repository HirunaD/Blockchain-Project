// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AssignmentHashing {

    struct Submission {
        string assignmentId;
        string fileHash;
        uint256 timestamp;
    }

    mapping(address => mapping(string => Submission)) private submissions;

    event AssignmentSubmitted(
        address indexed student,
        string assignmentId,
        string fileHash,
        uint256 timestamp
    );

    function submitAssignment(
        string memory _assignmentId,
        string memory _fileHash
    ) public {
        require(
            submissions[msg.sender][_assignmentId].timestamp == 0,
            "Already submitted"
        );

        submissions[msg.sender][_assignmentId] = Submission(
            _assignmentId,
            _fileHash,
            block.timestamp
        );

        emit AssignmentSubmitted(
            msg.sender,
            _assignmentId,
            _fileHash,
            block.timestamp
        );
    }

    function getSubmission(
        address _student,
        string memory _assignmentId
    ) public view returns (string memory, uint256) {
        Submission memory sub = submissions[_student][_assignmentId];
        require(sub.timestamp != 0, "No submission found");
        return (sub.fileHash, sub.timestamp);
    }
}
