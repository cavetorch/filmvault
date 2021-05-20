import { task } from "hardhat/config";
import { createAddressFile, selectAddressFile } from "./address_file";
import { LAUNCH_CAP_END_TIME, EXCHANGE_CONFIG } from "../config";

task("deploy_exchange", "Deploy exchange contracts")
    .addOptionalParam("governance", "Path to the governance address file", "")
    .addOptionalParam("fund", "Path to the fund address file", "")
    .setAction(async function (args, hre) {
        const { ethers } = hre;
        const { parseEther } = ethers.utils;

        await hre.run("compile");
        const [deployer] = await ethers.getSigners();
        const addressFile = createAddressFile(hre, "exchange");
        const governanceAddresses = await selectAddressFile(hre, "governance", args.governance);
        const fundAddresses = await selectAddressFile(hre, "fund", args.fund);

        const quoteToken = await ethers.getContractAt("ERC20", EXCHANGE_CONFIG.QUOTE_ADDRESS);
        const quoteDecimals = await quoteToken.decimals();

        const Exchange = await ethers.getContractFactory("Exchange");
        const exchangeImpl = await Exchange.deploy(
            fundAddresses.fund,
            governanceAddresses.chess,
            governanceAddresses.chessController,
            quoteToken.address,
            quoteDecimals,
            governanceAddresses.votingEscrow,
            parseUnits(EXCHANGE_CONFIG.INITIAL_MIN_ORDER_AMOUNT, quoteDecimals),
            parseUnits(EXCHANGE_CONFIG.MIN_ORDER_AMOUNT, quoteDecimals),
            parseEther(EXCHANGE_CONFIG.MIN_ORDER_AMOUNT),
            parseEther(EXCHANGE_CONFIG.MAKER_REQUIREMENT),
            EXCHANGE_CONFIG.ORDER_PLACING_START_TIME,
            LAUNCH_CAP_END_TIME
        );
        console.log(`Exchange implementation: ${exchangeImpl.address}`);
        addressFile.set("exchangeImpl", exchangeImpl.address);

        const TransparentUpgradeableProxy = await ethers.getContractFactory(
            "TransparentUpgradeableProxy"
        );
        const exchangeProxy = await TransparentUpgradeableProxy.deploy(
            exchangeImpl.address,
            deployer.address,
            "0x",
            { gasLimit: 1e6 } // Gas estimation may fail
        );
        const exchange = Exchange.attach(exchangeProxy.address);
        console.log(`Exchange: ${exchange.address}`);
        addressFile.set("exchange", exchange.address);

        const chess = await ethers.getContractAt("Chess", governanceAddresses.chess);
        await chess.addMinter(exchange.address);
        console.log("Exchange is a CHESS minter now");

        const AccountData = await ethers.getContractFactory("AccountData");
        const accountData = await AccountData.deploy();
        console.log(`AccountData: ${accountData.address}`);
        addressFile.set("accountData", accountData.address);
    });
