import { task } from "hardhat/config";
import { keyInYNStrict } from "readline-sync";
import { Addresses, saveAddressFile, newAddresses } from "./address_file";
import { updateHreSigner } from "./signers";

export interface MockAddresses extends Addresses {
    mockTwapOracle: string;
    mockAprOracle: string;
    mockVToken: string;
    mockBtc: string;
    mockEth: string;
    mockUsdc: string;
    mockPancakePair: string;
}

task("deploy_mock", "Deploy mock contracts")
    .addFlag("silent", 'Assume "yes" as answer to all prompts and run non-interactively')
    .setAction(async (args, hre) => {
        await updateHreSigner(hre);
        const { ethers, waffle } = hre;
        const { parseEther } = ethers.utils;
        const { deployMockContract } = waffle;
        await hre.run("compile");
        const [deployer] = await ethers.getSigners();

        let mockTwapOracleAddress = "";
        if (args.silent || keyInYNStrict("Deploy MockTwapOracle?", { guide: true })) {
            const MockTwapOracle = await ethers.getContractAt(
                "ITwapOracle",
                ethers.constants.AddressZero
            );
            const mockTwapOracle = await deployMockContract(
                deployer,
                MockTwapOracle.interface.format() as string[]
            );
            console.log(`MockTwapOracle: ${mockTwapOracle.address}`);
            mockTwapOracleAddress = mockTwapOracle.address;
            await mockTwapOracle.mock.getTwap.returns(parseEther("10000"));
        }

        let mockAprOracleAddress = "";
        if (args.silent || keyInYNStrict("Deploy MockAprOracle?", { guide: true })) {
            const MockAprOracle = await ethers.getContractAt(
                "IAprOracle",
                ethers.constants.AddressZero
            );
            const mockAprOracle = await deployMockContract(
                deployer,
                MockAprOracle.interface.format() as string[]
            );
            console.log(`MockAprOracle: ${mockAprOracle.address}`);
            mockAprOracleAddress = mockAprOracle.address;
            await mockAprOracle.mock.capture.returns(parseEther("0.000261157876067812")); // 1.1 ^ (1/365) - 1
        }

        let mockVTokenAddress = "";
        if (args.silent || keyInYNStrict("Deploy MockVToken?", { guide: true })) {
            const MockVToken = await ethers.getContractAt(
                "VTokenInterfaces",
                ethers.constants.AddressZero
            );
            const mockVToken = await deployMockContract(
                deployer,
                MockVToken.interface.format() as string[]
            );
            console.log(`MockVToken: ${mockVToken.address}`);
            mockVTokenAddress = mockVToken.address;
            await mockVToken.mock.borrowRatePerBlock.returns(0);
            await mockVToken.mock.borrowIndex.returns(0);
            await mockVToken.mock.accrualBlockNumber.returns(0);
        }

        let mockBtcAddress = "";
        if (args.silent || keyInYNStrict("Deploy MockBtc?", { guide: true })) {
            const MockToken = await ethers.getContractFactory("MockToken");
            const mockBtc = await MockToken.deploy("Mock BTC", "BTC", 8);
            console.log(`MockBtc: ${mockBtc.address}`);
            mockBtcAddress = mockBtc.address;
            await mockBtc.mint(deployer.address, 1000000e8);
        }

        let mockEthAddress = "";
        if (args.silent || keyInYNStrict("Deploy MockEth?", { guide: true })) {
            const MockToken = await ethers.getContractFactory("MockToken");
            const mockEth = await MockToken.deploy("Mock ETH", "ETH", 18);
            console.log(`MockEth: ${mockEth.address}`);
            mockEthAddress = mockEth.address;
            await mockEth.mint(deployer.address, parseEther("1000000"));
        }

        let mockUsdcAddress = "";
        if (args.silent || keyInYNStrict("Deploy MockUsdc?", { guide: true })) {
            const MockToken = await ethers.getContractFactory("MockToken");
            const mockUsdc = await MockToken.deploy("Mock USDC", "USDC", 6);
            console.log(`MockUsdc: ${mockUsdc.address}`);
            mockUsdcAddress = mockUsdc.address;
            await mockUsdc.mint(deployer.address, 1000000e6);
        }

        let mockPancakePairAddress = "";
        if (args.silent || keyInYNStrict("Deploy MockPancakePair?", { guide: true })) {
            const MockPancakePair = await ethers.getContractAt(
                "IPancakePair",
                ethers.constants.AddressZero
            );
            const mockPancakePair = await deployMockContract(
                deployer,
                MockPancakePair.interface.format() as string[]
            );
            console.log(`MockPancakePair: ${mockPancakePair.address}`);
            mockPancakePairAddress = mockPancakePair.address;
            console.log(
                "Please manually set return values of token0(), token1() and getReserves() for MockPancakePair"
            );
        }

        const addresses: MockAddresses = {
            ...newAddresses(hre),
            mockTwapOracle: mockTwapOracleAddress,
            mockAprOracle: mockAprOracleAddress,
            mockVToken: mockVTokenAddress,
            mockBtc: mockBtcAddress,
            mockEth: mockEthAddress,
            mockUsdc: mockUsdcAddress,
            mockPancakePair: mockPancakePairAddress,
        };
        saveAddressFile(hre, "mock", addresses);
    });
