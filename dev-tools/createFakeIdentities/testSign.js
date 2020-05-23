const Web3 = require('web3');
const utils = require('web3/lib/utils/utils');
const EthereumTx = require('ethereumjs-tx');
const fs = require('fs');
const accounts = require('./accounts');

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

const signedTx = ()=>{
    return signTransaction(
        {
            to: "0x4CD13A59c98cf7db4c0614E9ea8DdD2dff10441C",
            value: 100000000000000000,
            nonce: 1,
            gas: 21000
        },accounts.admin.privateKey
    )
}

console.log(signedTx());