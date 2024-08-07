require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const KittyCoreABI = require('./build/contracts/KittyCore.json');

const MNEMONIC = process.env.MNEMONIC;
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const NETWORK = process.env.NETWORK;

if (!MNEMONIC || !INFURA_API_KEY || !NETWORK) {
    console.error("Missing one or more required environment variables: MNEMONIC, INFURA_API_KEY, NETWORK");
    process.exit(1);
}

try {
    const provider = new HDWalletProvider(
        MNEMONIC,
        `https://${NETWORK}.infura.io/v3/${INFURA_API_KEY}`
    );

    const web3 = new Web3(provider);

    const deploy = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            console.log('Attempting to deploy from account', accounts[0]);

            if (!accounts[0]) {
                throw new Error('No accounts found. Check if the MNEMONIC is correct and has access to accounts.');
            }

            const result = await new web3.eth.Contract(KittyCoreABI.abi)
                .deploy({ data: KittyCoreABI.bytecode })
                .send({ from: accounts[0] });

            console.log('Contract deployed to', result.options.address);
        } catch (error) {
            console.error("Deployment failed:", error.message);
            process.exit(1); // Exit process for fatal deployment error
        } finally {
            provider.engine.stop();
        }
    };

    deploy().catch(error => {
        console.error("Unhandled error in deployment process:", error.message);
        provider.engine.stop();
    });
} catch (error) {
    console.error("Failed to set up the provider or Web3 instance:", error.message);
    process.exit(1); // Exit process for initialization error
}