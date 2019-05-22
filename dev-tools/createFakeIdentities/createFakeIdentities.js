const Web3 = require('web3');
const utils = require('web3/lib/utils/utils');
const EthereumTx = require('ethereumjs-tx');
const fs = require('fs');
const accounts = require('./accounts');
const transactions = require('createIdentityTransactions');
const {
	networks
} = require('../../truffle');


//const web3 = new Web3(new Web3.providers.HttpProvider(`http://${networks.alastria.host}:${networks.alastria.port}`));
const web3 = new Web3(new Web3.providers.HttpProvider(`http://localhost:8545`));
const identityManagerBin = '0x' + fs.readFileSync('../../contracts/bin/__contracts_identityManager_AlastriaIdentityManager_sol_AlastriaIdentityManager.bin', 'utf-8')
const eidasBin = '0x' + fs.readFileSync('../../contracts/bin/__contracts_libs_Eidas_sol_Eidas.bin', 'utf-8')
const deployIdentityManagerData = `${identityManagerBin}${utils.padLeft(utils.toHex(0).slice(2, utils.toHex(0).length), 64)}`
var adminTransactions = []

adminTransactions.push(transactions.deployEidasLibTransaction(
	web3.eth.getTransactionCount(accounts.admin.address),
	eidasBin));

adminTransactions.push(transactions.deployIdentityManagerTransaction(web3.eth.getTransactionCount(
	accounts.admin.address) + 1,
	deployIdentityManagerData));

const issuerEidasLEvel = 2;
adminTransactions.push(transactions.setIssuerTransaction(
	web3.eth.getTransactionCount(accounts.admin.address) + 2, 
	accounts.issuer.address, utils.toHex(issuerEidasLEvel)));

adminTransactions.push(transactions.setServiceProviderTransaction(
	web3.eth.getTransactionCount(accounts.admin.address) + 3, 
	accounts.serviceProvider.address));

var serviceProviderTransaction = [];

serviceProviderTransaction.push(transactions.giveAccesToken(
	accounts.identity1.address,
	web3.eth.getTransactionCount(accounts.serviceProvider.address)
));

serviceProviderTransaction.push(transactions.createPublicKeyDidDocument(
	'7fdf96e9f8749d267319088775ad1cc245e5cd9fa0d6567426788a3ea10e675e',
	'identity1',
	web3.eth.getTransactionCount(accounts.serviceProvider.address) + 1
));

serviceProviderTransaction.push(transactions.giveAccesToken(
	accounts.identity2.address,
	web3.eth.getTransactionCount(accounts.serviceProvider.address) + 2
))
serviceProviderTransaction.push(transactions.createPublicKeyDidDocument(
	'7fdf96e9f8749d267319088775ad1cc245e5cd9fa0d6567426788a3ea10e675e',
	'identity2',
	web3.eth.getTransactionCount(accounts.serviceProvider.address) + 3
));

serviceProviderTransaction.push(transactions.giveAccesToken(
	accounts.identity3.address,
	web3.eth.getTransactionCount(accounts.serviceProvider.address) + 4
));

serviceProviderTransaction.push(transactions.createPublicKeyDidDocument(
	'7fdf96e9f8749d267319088775ad1cc245e5cd9fa0d6567426788a3ea10e675e',
	'identity3',
	web3.eth.getTransactionCount(accounts.serviceProvider.address) + 5
));

/**
 * Sign the payload data
 * @param {object} transaction transaction to be signed
 * @return {string} tx hash
 */
const signTransaction = (transaction, privateKey) => {
	try {
		const tx = new EthereumTx(transaction);
		tx.sign(privateKey);
		const signedTx = `0x${tx.serialize().toString('hex')}`;
		return signedTx;
	} catch (err) {
		console.log(err);
		throw err;
	}
}

//console.log(signTransaction(deployIdentityManagerTransaction,accounts.admin.privateKey))
adminTransactions.forEach((transaction)=>{
	web3.eth.sendRawTransaction(signTransaction(transaction, accounts.admin.privateKey), (e, r) => {
		console.log(e)
		console.log(r)
	});
})

serviceProviderTransaction.forEach((transaction)=>{
	web3.eth.sendRawTransaction(signTransaction(transaction, accounts.serviceProvider.privateKey), (e, r) => {
		console.log(e)
		console.log(r)
	});
});