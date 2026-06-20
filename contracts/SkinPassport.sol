// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Skin Passport — Soulbound treatment record NFT for Hairless Laser Aesthetics
/// @notice Non-transferable NFT. One per client. Updated by authorized clinic operators only.
/// @dev Minimal first version for grant demo / testnet proof-of-concept.
contract SkinPassport is ERC721, Ownable {
    uint256 private _nextTokenId;

    struct PassportData {
        string skinType;       // e.g. "Fitzpatrick III"
        string metadataURI;    // IPFS URI with full treatment history JSON
        uint256 lastUpdated;
    }

    mapping(uint256 => PassportData) public passports;
    mapping(address => uint256) public passportOf; // 1 wallet = 1 passport
    mapping(address => bool) public authorizedOperators; // clinic staff wallets

    event PassportMinted(address indexed client, uint256 indexed tokenId, string skinType);
    event PassportUpdated(uint256 indexed tokenId, string metadataURI);
    event OperatorSet(address indexed operator, bool authorized);

    modifier onlyOperator() {
        require(authorizedOperators[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    constructor() ERC721("Hairless Skin Passport", "HSKIN") Ownable(msg.sender) {
        authorizedOperators[msg.sender] = true;
    }

    /// @notice Mint a new soulbound passport for a client. Called by clinic staff at first visit.
    function mintPassport(
        address client,
        string calldata skinType,
        string calldata metadataURI
    ) external onlyOperator returns (uint256) {
        require(passportOf[client] == 0, "Client already has a passport");

        uint256 tokenId = ++_nextTokenId;
        _safeMint(client, tokenId);

        passports[tokenId] = PassportData({
            skinType: skinType,
            metadataURI: metadataURI,
            lastUpdated: block.timestamp
        });
        passportOf[client] = tokenId;

        emit PassportMinted(client, tokenId, skinType);
        return tokenId;
    }

    /// @notice Update treatment history after a session. Only clinic staff can call this.
    function updatePassport(uint256 tokenId, string calldata newMetadataURI) external onlyOperator {
        require(_ownerOf(tokenId) != address(0), "Passport does not exist");
        passports[tokenId].metadataURI = newMetadataURI;
        passports[tokenId].lastUpdated = block.timestamp;
        emit PassportUpdated(tokenId, newMetadataURI);
    }

    /// @notice Grant or revoke clinic staff permission to mint/update passports.
    function setOperator(address operator, bool authorized) external onlyOwner {
        authorizedOperators[operator] = authorized;
        emit OperatorSet(operator, authorized);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Passport does not exist");
        return passports[tokenId].metadataURI;
    }

    // ---- Soulbound enforcement: block all transfers ----

    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        // Allow minting (from == address(0)). Block everything else, including burns by non-owner.
        if (from != address(0) && to != address(0)) {
            revert("Skin Passport is soulbound: non-transferable");
        }
        return super._update(to, tokenId, auth);
    }

    function approve(address, uint256) public pure override {
        revert("Skin Passport is soulbound: approvals disabled");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Skin Passport is soulbound: approvals disabled");
    }
}
