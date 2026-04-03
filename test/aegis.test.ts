import { expect } from "chai";
import { ethers } from "hardhat";

describe("AegisOracle", function() {

    it("deploys correctly", async () => {
        const Oracle = await ethers.getContractFactory("AegisOracle");

        const orcle = await Oracle.deploy();

        expect(await orcle.maxDeviation()).to.equal(10);
    });
});