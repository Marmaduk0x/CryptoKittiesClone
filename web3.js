import Web3 from 'web3';

const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = JSON.parse(process.env.CONTRACT_ABI);

let web3;
let contract;
let accounts;

const initWeb3 = async () => {
  if(window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
      initContract();
    } catch(error) {
      console.error("User denied account access");
    }
  }
  else if(window.web3) {
    web3 = new Web3(web3.currentProvider);
    initContract();
  }
  else {
    console.error("Non-Ethereum browser detected. You should consider trying MetaMask!");
  }
};

const initContract = () => {
  contract = new web3.eth.Contract(contractABI, contractAddress);
  initApp();
};

const initApp = () => {
  loadAccounts();
};

const loadAccounts = async () => {
  accounts = await web3.eth.getAccounts();
  console.log(accounts);
};

const getKittyDetails = async (kittyId) => {
  const kittyDetails = await contract.methods.getKitty(kittyId).call();
  return kittyDetails;
};

const breedKitties = async (kittyId1, kittyId2) => {
  try {
    const txn = await contract.methods.breed(kittyId1, kittyId2).send({ from: accounts[0] });
    console.log("Kitty bred successfully:", txn);
  } catch (error) {
    console.error("Error breeding kitties:", error);
  }
};

window.addEventListener('load', initWeb2);