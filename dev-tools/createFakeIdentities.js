
/*

This program creates 5 fake identities to test

accounts[0] is Entity 1 account (Issuer and Service Provider)
accounts[1] is Entity 2 account (Issuer and Service Provider)
accounts[2] is user 1 account
accounts[3] is user 2 account
accounts[3] is user 3 account

*/


// Environment selection
const envs = {
	GANACHE = 'ganache';
	LOCAL_ALASTRIA = 'local_alastria';
	ALASTRIA = 'alastria';
}
var env = envs.GANACHE;

// Smart Contracts configuration
var ABI_IDMANAGER = [];
var ADDRESS_IDMANAGER = '';
var ABI_PUBLICKEY = [];
var ADDRESS_PUBLICKEY = '';
var ABI_PROXY = [];
var ADDRESS_PROXY = '';


var web3;
var accounts;
var psw;
if(!env){
	throw new Error('Environment is not defined. Select one');
}else{
	console.log('Your chosen environment is ' + env);
}

switch(env){
	case envs.GANACHE:
		web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
		accounts = [
			web3.eth.accounts[0],
			web3.eth.accounts[1],
			web3.eth.accounts[2],
			web3.eth.accounts[3],
			web3.eth.accounts[4],
			];
	case envs.LOCAL_ALASTRIA:
		web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:22001'));
		web3.eth.defaultAccount = web3.eth.accounts[0];
		psw = 'Passw0rd'
		web3.personal.unlockAccount(web3.eth.defaultAccount, psw);
		accounts = web3.eth.accounts;
	case envs.ALASTRIA:
		web3 = new Web3(new Web3.providers.HttpProvider('http://138.4.143.82:8545'));
		accounts = [
				'0x994319e1b1de09aac4aa5b225a7d5cade79d04ed',
				'0x66c5a820d0e743fc7030f02aa873875c84a88f3f',
				'0x34322a678b16ce26fc0e2bdde1e3c1b666a34a66',
				'0xfc3b00c03b74ee1d94fa10e21aef4e6e9710e8a8',
				'0xc600d011aa4e705281958fd27778dab00e1fd7c4'
				];
		psw = 'Alumnos_2018_Q4_IKx5srvT';
		web3.eth.personal.unlockAccount(accounts[0], psw);
		web3.eth.defaultAccount = accounts[0];
}


// Instantiate smart contracts
var idManager = web3.eth.contract(ABI_IDMANAGER).at(ADDRESS_IDMANAGER);
var publicKey = web3.eth.contract(ABI_PUBLICKEY).at(ADDRESS_PUBLICKEY);
var proxy = web3.eth.contract(ABI_PROXY).at(ADDRESS_PROXY);


// Init accounts
var E1 = accounts[0];
var E2 = accounts[1];
var U1 = accounts[2];
var U2 = accounts[3];
var U3 = accounts[4];
console.log('INIT ACCOUNTS\n' + 'SERVICE PROVIDER: ' + sp + '\nUSER1: ' + u1 + '\nUSER2: ' + u2 + '\nUSER3: ' + u3 + '\n--------');

// Public keys generation

var publicKey_E1 = 'publickey_e1';
var publicKey_E2 = 'publickey_e2';
var publicKey_U1 = 'publickey_u1';
var publicKey_U2 = 'publickey_u2';
var publicKey_U3 = 'publickey_u3';

publicKey.addKey.sendTransaction(publicKey_E1, {from:E1});
publicKey.addKey.sendTransaction(publicKey_E1, {from:E2});
publicKey.addKey.sendTransaction(publicKey_U1, {from:U1});
publicKey.addKey.sendTransaction(publicKey_U2, {from:U2});
publicKey.addKey.sendTransaction(publicKey_U3, {from:U3});

// Identites creations

idManager.createIdentity().call();
idManager.createIdentity().call();
idManager.createIdentity().call();
idManager.createIdentity().call();
idManager.createIdentity().call();

// Add Service Providers and Issuers

idManager.addIdentityServiceProvider().call();
idManager.addIdentityServiceProvider().call();

idManager.addIdentityIssuer().call();
idManager.addIdentityIssuer().call();

// Proxy

// Desplegar para cada identidad
