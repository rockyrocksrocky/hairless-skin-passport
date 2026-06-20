const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkinPassport", function () {
  let passport, owner, client1, client2, stranger;

  beforeEach(async function () {
    [owner, client1, client2, stranger] = await ethers.getSigners();
    const SkinPassport = await ethers.getContractFactory("SkinPassport");
    passport = await SkinPassport.deploy();
  });

  it("mints a passport with skin type and metadata", async function () {
    await expect(
      passport.mintPassport(client1.address, "Fitzpatrick III", "ipfs://demo-cid-1")
    )
      .to.emit(passport, "PassportMinted")
      .withArgs(client1.address, 1, "Fitzpatrick III");

    expect(await passport.ownerOf(1)).to.equal(client1.address);
    expect(await passport.passportOf(client1.address)).to.equal(1);
  });

  it("prevents minting a second passport to the same client", async function () {
    await passport.mintPassport(client1.address, "Fitzpatrick III", "ipfs://demo-cid-1");
    await expect(
      passport.mintPassport(client1.address, "Fitzpatrick III", "ipfs://demo-cid-2")
    ).to.be.revertedWith("Client already has a passport");
  });

  it("allows authorized operator to update treatment history", async function () {
    await passport.mintPassport(client1.address, "Fitzpatrick III", "ipfs://demo-cid-1");
    await expect(passport.updatePassport(1, "ipfs://demo-cid-updated"))
      .to.emit(passport, "PassportUpdated")
      .withArgs(1, "ipfs://demo-cid-updated");

    expect(await passport.tokenURI(1)).to.equal("ipfs://demo-cid-updated");
  });

  it("blocks non-operators from minting or updating", async function () {
    await expect(
      passport.connect(stranger).mintPassport(client1.address, "Fitzpatrick III", "ipfs://x")
    ).to.be.revertedWith("Not authorized");
  });

  it("enforces soulbound: blocks transferFrom", async function () {
    await passport.mintPassport(client1.address, "Fitzpatrick III", "ipfs://demo-cid-1");
    await expect(
      passport.connect(client1).transferFrom(client1.address, client2.address, 1)
    ).to.be.revertedWith("Skin Passport is soulbound: non-transferable");
  });

  it("enforces soulbound: blocks approve", async function () {
    await passport.mintPassport(client1.address, "Fitzpatrick III", "ipfs://demo-cid-1");
    await expect(
      passport.connect(client1).approve(client2.address, 1)
    ).to.be.revertedWith("Skin Passport is soulbound: approvals disabled");
  });

  it("allows owner to authorize new clinic operators (e.g. Sonya, Kristin)", async function () {
    await passport.setOperator(client1.address, true);
    expect(await passport.authorizedOperators(client1.address)).to.equal(true);

    // Now client1 (acting as e.g. Sonya at Kyustendil) can mint for others
    await expect(
      passport.connect(client1).mintPassport(client2.address, "Fitzpatrick II", "ipfs://demo-cid-3")
    ).to.emit(passport, "PassportMinted");
  });
});
