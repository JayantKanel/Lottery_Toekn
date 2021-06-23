const assert =require('assert');
const ganache = require('ganache-cli');
const Web3=require('web3');
const web3=new Web3(ganache.provider());

const { interface, bytecode }=require('../compile');
let accounts;
let lottery;
beforeEach(async ()=>{
    accounts= await web3.eth.getAccounts();
    lottery= await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:bytecode})
    .send({from: accounts[0], gas:'1000000'});
});
describe('Lottery Contract',()=>{
    it('deploys a contract',()=>{
        assert.ok(lottery.options.address);
    });
    
    it('allows one acount to enter', async()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });
        console.log(accounts[0]);
        const players=await lottery.methods.getPlayers().call({
            from : accounts[0]
        });
        console.log(players[0]);
        assert.equal(accounts[0],players[0]);
        assert.equal(1,players.length);
    });
    it('allows multiple  acount to enter', async()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });
        console.log(accounts[0]);
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });
        console.log(accounts[1]);
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });
        console.log(accounts[2]);
        const players=await lottery.methods.getPlayers().call({
            from : accounts[0]
        });
        console.log(players);
        assert.equal(accounts[0],players[0]);
        assert.equal(accounts[1],players[1]);
        assert.equal(accounts[2],players[2]);
        assert.equal(3,players.length);
    });
    it('require a minimum amount of ether to enter',async()=>{
        try{
        await lottery.methods.enter().send({
            from: account[0],
            value: 0
        });
        // if above function dosent have any error assert (false) will tell us that there is no error by failing our test 
        assert(false);
    }catch (err){
        assert(err);
    }
    });
    it('Only Managar can pickWinner not you',async()=>{
        try{
        await lottery.methods.pickWinner().send({
            from: accounts[1]
        });
        
        // if above function dosent have any error assert (false) will tell us that there is no error by failing our test 
        assert(false);
    }catch (err){
        assert(err);
    }
    });
    it('sends money to the winner and resets the players array', async()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2','ether')
        });
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        console.log("Initial Balace ",initialBalance);
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        console.log("Final Balance ",finalBalance);
        const diff= finalBalance- initialBalance;
        assert(diff>web3.utils.toWei('1.8','ether'));
    });
});
