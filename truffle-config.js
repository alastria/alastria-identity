module.exports = {
  networks: {
    'development': {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 0xffffff,
      gasPrice: 0x0,
    },
    'red-t-nodo-identidad': {
      host: "63.33.206.111/rpc",
      port: 80,
      network_id: "*",
      gas: 0xffffff,
      gasPrice: 0x0,
      from: "0xd65616c46a2e55957aff33e238b31bc568358e20"
    }
  },
  compilers: {
    solc: {
      version: "0.4.23", // A version or constraint - Ex. "^0.5.0"
      parser: "solcjs",  // Leverages solc-js purely for speedy parsing
      settings: {
        optimizer: {
          enabled: true,
          runs: 200   // Optimize for how many times you intend to run the code
        },
        evmVersion: "byzantium" // Default: "petersburg"
      }
    }
  }
};
