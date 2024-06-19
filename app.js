import Web3 from 'web3';
import CryptoKittiesCloneABI from './CryptoKittiesCloneABI.json';

const API_URL = process.env.API_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;

if (!API_URL || !CONTRACT_ADDRESS || !PRIVATE_KEY || !PUBLIC_KEY) {
    console.error("Please ensure all environment variables are properly set.");
    alert("Configuration error detected. Check the console for details.");
}

let web3;
try {
    web3 = new Web3(new Web3.providers.HttpProvider(API_URL));
} catch (error) {
    console.error("Failed to connect to the Ethereum network:", error);
    alert("Could not connect to the Ethereum network. Please check your API URL.");
}

const cryptoKittiesCloneContract = web3 ? new web3.eth.Contract(CryptoKittiesCloneABI, CONTRACT_ADDRESS) : null;
if (!cryptoKittiesCloneContract) {
    console.error("Failed to instantiate the contract. Please check your ABI and contract address.");
    alert("Contract setup failure. Check the console for details.");
}

async function loadKitties() {
    try {
        const kittiesCount = await cryptoKittiesCloneContract.methods.totalSupply().call();
        const kitties = [];
        for (let i = 0; i < kittiesCount; i++) {
            const kitty = await cryptoKittiesCloneContract.methods.kitties(i).call();
            kitties.push(kitty);
        }
        updateKittiesUI(kitties);
    } catch (error) {
        console.error("Error loading kitties:", error);
        alert("Failed to load kitties.");
    }
}

function updateKittiesUI(kitties) {
    const kittiesList = document.getElementById('kittiesList');
    if (!kittiesList) {
        console.error("Failed to find the kittiesList element. Please check your HTML.");
        return;
    }
    kittiesList.innerHTML = '';

    kitties.forEach((kitty) => {
        const kittyElement = document.createElement('li');
        kittyElement.textContent = `Kitty ${kitty.id}: Color = ${kitty.color}`;
        kittiesList.appendChild(kittyElement);
    });
}

async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3.eth.defaultAccount = (await web3.eth.getAccounts())[0];
            alert('Wallet connected successfully');
        } catch (error) {
            console.error('User denied account access', error);
            alert('Failed to connect wallet. Please try again.');
        }
    } else {
        alert('Non-Ethereum browser detected. Please install MetaMask');
    }
}

async function createKitty(color) {
    if (!web3 || !web3.eth.defaultAccount) {
        alert('Please connect your wallet first.');
        return;
    }

    try {
        const tx = cryptoKittiesCloneContract.methods.createRandomKitty(color);
        const gas = await tx.estimateGas({ from: PUBLIC_KEY });
        const gasPrice = await web3.eth.getGasPrice();
        const data = tx.encodeABI();
        const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');

        const signedTx = await web3.eth.accounts.signTransaction({
            to: CONTRACT_ADDRESS,
            data,
            gas,
            gasPrice,
            nonce,
            chainId: await web3.eth.net.getId()
        }, PRIVATE_KEY);

        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        alert('Kitty created successfully!');
        loadKitties();
    } catch (error) {
        console.error('Error creating kitty:', error);
        alert('Failed to create kitty. Please check the console for more details.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (cryptoKittiesCloneContract) {
        connectWallet();
        loadKitties();
    }
});