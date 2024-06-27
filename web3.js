import Web3 from 'web3';

const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = JSON.parse(process.env.CONTRACT_ABI);

let web3;
let contract;
let accounts;

const initWeb3 = async () => {
  try{
    if(window.ethereum) {
      web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      initContract();
    } else if(window.web3) {
      web3 = new Web3(web3.currentProvider);
      initContract();
    } else {
      console.error("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
  } catch(error) {
    console.error("Error during initialization:", error);
  }
};

const initContract = () => {
  contract = new web3.eth.Contract(contractABI, contractAddress);
  initApp();
};

const initApp = () => {
  loadAccounts().then(() => {
    console.log("Accounts loaded:", accounts);
  }).catch(error => {
    console.error("Error loading accounts:", error);
  });
};

const loadAccounts = async () => {
  try{
    accounts = await web3.eth.getAccounts();
  } catch(error) {
    throw new Error("Failed to get accounts:", error);
  }
};

const getKittyDetails = async (kittyId) => {
  try{
    const kittyDetails = await contract.methods.getKitty(kittyId).call();
    return kittyDetails;
  } catch(error) {
    console.error("Error fetching kitty details:", error);
    return null;
  }
};

const breedKitties = async (kittyId1, kittyId2) => {
  try {
    const txn = await contract.methods.breed(kittyId1, kittyId2).send({ from: accounts[0] });
    console.log("Kitty bred successfully:", txn);
  } catch (error) {
    console.error("Error breeding kitties:", error);
  }
};

window.addEventListener('load', () => {
  initWeb2().then(() => {
    console.log("Web3 initialized successfully.");
  }).catch(error => {
    console.error("Error initializing Web3:", error);
  });
});