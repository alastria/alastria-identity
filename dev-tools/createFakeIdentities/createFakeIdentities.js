
/*

This program creates 5 fake identities to test

accounts[0] is Entity 1 account (Issuer and Service Provider)
accounts[1] is Entity 2 account (Issuer and Service Provider)
accounts[2] is user 1 account
accounts[3] is user 2 account
accounts[4] is user 3 account

*/


// Environment selection
const envs = {
	GANACHE : 'ganache',
	LOCAL_ALASTRIA : 'local_alastria',
	ALASTRIA : 'alastria'
}
var env = envs.GANACHE;

// Smart Contracts configuration

// ABIs
var ABI_IDMANAGER = [  { "constant": true, "inputs": [  {   "name": "",   "type": "address"  } ], "name": "identityKeys", "outputs": [  {   "name": "",   "type": "address"  } ], "payable": false, "stateMutability": "view", "type": "function"  },  { "constant": true, "inputs": [  {   "name": "_identityIssuer",   "type": "address"  } ], "name": "getEidasLevel", "outputs": [  {   "name": "",   "type": "uint8"  } ], "payable": false, "stateMutability": "view", "type": "function"  },  { "constant": false, "inputs": [  {   "name": "_identityServiceProvider",   "type": "address"  } ], "name": "addIdentityServiceProvider", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"  },  { "constant": false, "inputs": [  {   "name": "newOwner",   "type": "address"  } ], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"  },  { "constant": false, "inputs": [  {   "name": "owner",   "type": "address"  },  {   "name": "destination",   "type": "address"  },  {   "name": "data",   "type": "bytes"  } ], "name": "createIdentityWithCall", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"  },  { "constant": true, "inputs": [  {   "name": "addr",   "type": "address"  } ], "name": "isOwner", "outputs": [  {   "name": "",   "type": "bool"  } ], "payable": false, "stateMutability": "view", "type": "function"  },  { "constant": false, "inputs": [  {   "name": "_identityServiceProvider",   "type": "address"  } ], "name": "deleteIdentityServiceProvider", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"  },  { "constant": false, "inputs": [  {   "name": "_signAddress",   "type": "address"  } ], "name": "generateAccessToken", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"  },  { "constant": false, "inputs": [  {   "name": "_identityIssuer",   "type": "address"  },  {   "name": "_level",   "type": "uint8"  } ], "name": "updateIdentityIssuerEidasLevel", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"  },  { "constant": true, "inputs": [], "name": "version", "outputs": [  {   "name": "",   "type": "uint256"  } ], "payable": false, "stateMutability": "view", "type": "function"  },  { "constant": false, "inputs": [  {   "name": "_identityIssuer",   "type": "address"  },  {   "name": "_level",   "type": "uint8"  } ], "name": "addIdentityIssuer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"  },  { "constant": true, "inputs": [], "name": "owner", "outputs": [  {   "name": "",   "type": "address"  } ], "payable": false, "stateMutability": "view", "type": "function"  },  { "constant": false, "inputs": [  {   "name": "_identityIssuer",   "type": "address"  } ], "name": "deleteIdentityIssuer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"  },  { "constant": true, "inputs": [  {   "name": "_identityServiceProvider",   "type": "address"  } ], "name": "isIdentityServiceProvider", "outputs": [  {   "name": "",   "type": "bool"  } ], "payable": false, "stateMutability": "view", "type": "function"  },  { "constant": false, "inputs": [  {   "name": "owner",   "type": "address"  },  {   "name": "recoveryKey",   "type": "address"  } ], "name": "createIdentity", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"  },  { "constant": false, "inputs": [], "name": "createAlastriaIdentity", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"  },  { "inputs": [  {   "name": "_version",   "type": "uint256"  } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor"  },  { "anonymous": false, "inputs": [  {   "indexed": true,   "name": "signAddress",   "type": "address"  } ], "name": "AccessTokenGenerated", "type": "event"  },  { "anonymous": false, "inputs": [  {   "indexed": true,   "name": "method",   "type": "string"  } ], "name": "OperationWasNotSupported", "type": "event"  },  { "anonymous": false, "inputs": [  {   "indexed": true,   "name": "identity",   "type": "address"  },  {   "indexed": true,   "name": "creator",   "type": "address"  },  {   "indexed": false,   "name": "owner",   "type": "address"  } ], "name": "IdentityCreated", "type": "event"  } ];

var ABI_PUBLICKEY = [  {   "constant": true,   "inputs": [    { "name": "subject", "type": "address"    },    { "name": "publicKey", "type": "bytes32"    }   ],   "name": "getPublicKeyStatus",   "outputs": [    { "name": "exists", "type": "bool"    },    { "name": "status", "type": "uint8"    },    { "name": "startDate", "type": "uint256"    },    { "name": "endDate", "type": "uint256"    }   ],   "payable": false,   "stateMutability": "view",   "type": "function"  },  {   "constant": false,   "inputs": [    { "name": "publicKey", "type": "bytes32"    }   ],   "name": "deletePublicKey",   "outputs": [],   "payable": false,   "stateMutability": "nonpayable",   "type": "function"  },  {   "constant": true,   "inputs": [    { "name": "subject", "type": "address"    }   ],   "name": "getCurrentPublicKey",   "outputs": [    { "name": "", "type": "bytes32"    }   ],   "payable": false,   "stateMutability": "view",   "type": "function"  },  {   "constant": true,   "inputs": [],   "name": "version",   "outputs": [    { "name": "", "type": "int256"    }   ],   "payable": false,   "stateMutability": "view",   "type": "function"  },  {   "constant": false,   "inputs": [    { "name": "publicKey", "type": "bytes32"    }   ],   "name": "addKey",   "outputs": [],   "payable": false,   "stateMutability": "nonpayable",   "type": "function"  },  {   "constant": true,   "inputs": [],   "name": "previousPublishedVersion",   "outputs": [    { "name": "", "type": "address"    }   ],   "payable": false,   "stateMutability": "view",   "type": "function"  },  {   "constant": false,   "inputs": [    { "name": "publicKey", "type": "bytes32"    }   ],   "name": "revokePublicKey",   "outputs": [],   "payable": false,   "stateMutability": "nonpayable",   "type": "function"  },  {   "constant": true,   "inputs": [    { "name": "", "type": "address"    },    { "name": "", "type": "uint256"    }   ],   "name": "publicKeyList",   "outputs": [    { "name": "", "type": "bytes32"    }   ],   "payable": false,   "stateMutability": "view",   "type": "function"  },  {   "inputs": [    { "name": "_previousPublishedVersion", "type": "address"    }   ],   "payable": false,   "stateMutability": "nonpayable",   "type": "constructor"  },  {   "anonymous": false,   "inputs": [    { "indexed": false, "name": "publicKey", "type": "bytes32"    }   ],   "name": "PublicKeyDeleted",   "type": "event"  },  {   "anonymous": false,   "inputs": [    { "indexed": false, "name": "publicKey", "type": "bytes32"    }   ],   "name": "PublicKeyRevoked",   "type": "event"  } ];


// Addresses
var ADDRESS_IDMANAGER = '0x34c3689234bf2c2fed81bd38d97a2f1fcfe5e520';
var ADDRESS_PUBLICKEY = '0x0e268408a8b8bf5cd7981b5af6143eaaa098c8af';

// Connecting with the blokchain
let web3;
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
			break;
	case envs.LOCAL_ALASTRIA:
		web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:22001'));
		web3.eth.defaultAccount = web3.eth.accounts[0];
		psw = 'Passw0rd'
		web3.personal.unlockAccount(web3.eth.defaultAccount, psw);
		accounts = web3.eth.accounts;
		break;
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
		break;
}

// Instantiate smart contracts
var idManager = web3.eth.contract(ABI_IDMANAGER).at(ADDRESS_IDMANAGER);
var publicKey = web3.eth.contract(ABI_PUBLICKEY).at(ADDRESS_PUBLICKEY);

// Aux funtion to print accounts in HTML
function print(msg){
	document.getElementById("result").innerHTML = document.getElementById("result").innerHTML + "<br/>" + msg;
	console.log(msg);
}

function initFakeIdentities(){

		// Init accounts
		var E1 = accounts[0];
		var E2 = accounts[1];
		var U1 = accounts[2];
		var U2 = accounts[3];
		var U3 = accounts[4];

		console.log('ACCOUNTS HAVE BEEN INIT\n' + 'ENTITY1: ' + E1 + '\nENTITY2: ' + E2 + '\nUSER1: ' + U1 + '\nUSER2: ' + U2 + '\nUSER3: ' + U3 + '\n--------\n');

		// Public keys generation
		var publicKey_E1 = 'publickey_e1';
		var publicKey_E2 = 'publickey_e2';
		var publicKey_U1 = 'publickey_u1';
		var publicKey_U2 = 'publickey_u2';
		var publicKey_U3 = 'publickey_u3';

		/*
		publicKey.addKey.sendTransaction(publicKey_E1, {from:E1});
		publicKey.addKey.sendTransaction(publicKey_E1, {from:E2});
		publicKey.addKey.sendTransaction(publicKey_U1, {from:U1});
		publicKey.addKey.sendTransaction(publicKey_U2, {from:U2});
		publicKey.addKey.sendTransaction(publicKey_U3, {from:U3});
		*/

		console.log('PUBLIC KEYS HAVE BEEN REGISTERED\n' + 'ENTITY1: ' + publicKey_E1 + '\nENTITY2: ' + publicKey_E2 + '\nUSER1: '
			+ publicKey_U1 + '\nUSER2: ' + publicKey_U2 + '\nUSER3: ' + publicKey_U3 + '\n--------\n');

		// Identites creations. Proxy deployment for each identity
		/*
		var proxy_E1 = idManager.createIdentity().call(E1);
		var proxy_E2 = idManager.createIdentity().call(E2);
		var proxy_U1 = idManager.createIdentity().call(U1);
		var proxy_U2 = idManager.createIdentity().call(U2);
		var proxy_U3 = idManager.createIdentity().call(U3);

		console.log('IDENTITIES HAVE BEEN CREATED\n' + '\nENTITY1: ' + proxy_E1 + '\nENTITY2: ' + proxy_E2 + '\nUSER1: ' + proxy_U1 + '\nUSER2: ' + proxy_U2 + '\nUSER3: ' + proxy_U3 + '\n--------');
		*/
		// Add Service Providers and Issuers
		/*
		idManager.addIdentityServiceProvider().call(E1);
		idManager.addIdentityServiceProvider().call(E2);

		idManager.addIdentityIssuer().call(E1);
		idManager.addIdentityIssuer().call(E2);

		console.log('E1 AND E2 HAVE BEEN REGISTERED AS ISSUERS AND SERVICE PROVIDERS' + '\n--------');
		*/

		var msg ='ENTITY1: ' + E1 + '<br>ENTITY2: ' + E2 + '<br>USER1: ' + U1 + '<br>USER2: ' + U2 + '<br>USER3: ' + U3 + '<br>--------<br>';
		print(msg);
}
