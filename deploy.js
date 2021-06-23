const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const {interface,bytecode}=require('./compile');
const provider = new HDWalletProvider(
    'crime bicycle tent injury domain waste own throw kind tape kit energy',
    'https://rinkeby.infura.io/v3/c9e29ed1ca1c4582b068c32b978c8afa'
);
const web3 = new Web3(provider);
const deploy= async ()=>{
    const accounts= await  web3.eth.getAccounts();

    console.log('Attempting to deploy from account',accounts[0]);

    const result= await  new web3.eth.Contract(JSON.parse(interface))
      .deploy({data: bytecode})
      .send({from: accounts[0],gas:'1000000'});
    
  console.log("contract deployed to ", result.options.address);
};
deploy();