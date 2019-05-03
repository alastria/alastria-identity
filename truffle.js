module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    'alastria': {
      host: "35.176.19.89",
      port: 22000,
      network_id: "*",
      gas: 0xffffff,
      gasPrice: 0x0,
      from: "0xd65616c46a2e55957aff33e238b31bc568358e20"
    },
    compilers: {
      solc: {
        version: "^0.4.23", // A version or constraint - Ex. "^0.5.0"
      }
    }
  }
};
