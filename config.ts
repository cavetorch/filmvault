import * as dotenv from "dotenv";
dotenv.config();

export const TEST_DEPLOYER_PK = process.env.TEST_DEPLOYER_PK;
export const TEST_ETH_RPC = process.env.TEST_ETH_RPC;
export const TEST_ETH_CHAIN_ID = process.env.TEST_ETH_CHAIN_ID;

export const TEST_TWAP_ORACLE = process.env.TEST_TWAP_ORACLE;
export const TEST_APR_ORACLE = process.env.TEST_APR_ORACLE;
export const TEST_WBTC = process.env.TEST_WBTC;
export const TEST_MIN_CREATION = process.env.TEST_MIN_CREATION ?? "";

export const STAGING_DEPLOYER_PK = process.env.STAGING_DEPLOYER_PK;
export const STAGING_ETH_RPC = process.env.STAGING_ETH_RPC;
export const STAGING_ETH_CHAIN_ID = process.env.STAGING_ETH_CHAIN_ID;

export const STAGING_TWAP_ORACLE = process.env.STAGING_TWAP_ORACLE;
export const STAGING_APR_ORACLE = process.env.STAGING_APR_ORACLE;
export const STAGING_WBTC = process.env.STAGING_WBTC;
export const STAGING_MIN_CREATION = process.env.STAGING_MIN_CREATION ?? "";

export const TEST_FUND = process.env.TEST_FUND ?? "";
export const TEST_CHESS = process.env.TEST_CHESS ?? "";
export const TEST_USDC = process.env.TEST_USDC ?? "";
export const TEST_VOTING_ESCROW = process.env.TEST_VOTING_ESCROW ?? "";
export const TEST_MIN_ORDER_AMOUNT = process.env.TEST_MIN_ORDER_AMOUNT ?? "";
export const TEST_MAKER_REQUIREMENT = process.env.TEST_MAKER_REQUIREMENT ?? "";

export const STAGING_FUND = process.env.STAGING_FUND ?? "";
export const STAGING_CHESS = process.env.STAGING_CHESS ?? "";
export const STAGING_USDC = process.env.STAGING_USDC ?? "";
export const STAGING_VOTING_ESCROW = process.env.STAGING_VOTING_ESCROW ?? "";
export const STAGING_MIN_ORDER_AMOUNT = process.env.STAGING_MIN_ORDER_AMOUNT ?? "";
export const STAGING_MAKER_REQUIREMENT = process.env.STAGING_MAKER_REQUIREMENT ?? "";

export const BSC_MAINNET_VUSDC_ADDRESS = "0xecA88125a5ADbe82614ffC12D0DB554E2e2867C8";
export const BSC_TESTNET_VUSDC_ADDRESS = "0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7";
