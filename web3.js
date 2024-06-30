import Web3 from 'web3';

const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = JSON.parse(process.env.CONTRACT_ABI);

let web3;
let contract;
let accounts;

const initWeb3 = async () => {
  try {
    if(window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (accountError) {
        console.error("Error requesting account access:", accountError);
        return;
      }
      initContract();
    } else if(window.web3) {
      web3 = new Web3(web3.currentProvider);
      initContract();
    } else {
      console.error("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
  } catch (error) {
    console.error("Error during Web3 initialization:", error);
  }
};

const initContract = () => {
  try {
    contract = new web3.eth.Contract(contractABI, contractAddress);
    initApp();
  } catch (contractError) {
    console.error("Error initializing contract:", contractError);
  }
};

const initApp = () => {
  loadAccounts().then(() => {
    console.log("Accounts loaded:", accounts);
  }).catch(error => {
    console.error("Error loading accounts:", error);
  });
};

const loadAccounts = async () => {
  try {
    accounts = await web3.eth.getAccounts();
  } catch (error) {
    console.error("Failed to load accounts. Error:", error.message);
    throw error; // Re-throwing the error to be caught by the caller
  }
};

const getKittyDetails = async (kittyId) => {
  try {
    const kittyDetails = await contract.methods.getKitty(kittyId).call();
    return kittyDetails;
  } catch (error) {
    console.error("Error fetching kitty details. Error:", error.message);
    return null; // Potentially reconsider returning null in case of error
  }
};

const breedKitties = async (kittyId1, kittyId2) => {
  try {
    const txn = await contract.methods.breed(kittyId1, kittyId2).send({ from: accounts[0] });
    console.log("Kitty bred successfully:", txn);
  } catch (error) {
    console.error("Error breeding kitties. Error:", error.message);
  }
};

window.addEventListener('load', async () => {
  try {
    await initWeb3();
    console.log("Web3 initialized successfully.");
  } catch (error) {
    console.error("Error initializing Web3:", error);
  }
});