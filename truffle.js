module.exports = {
  networks: {
    'development': {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    'red-t': {
      host: "http://63.33.206.111/rpc", //identity node
      port: 80,
      network_id: "*",
      type: "quorum",
      gas: 0xffffff,
      gasPrice: 0x0,
      from: "0xd65616c46a2e55957aff33e238b31bc568358e20"
    },
    'red-b': {
      host: "", //identiy node
      port: 22000,
      network_id: "*",
      gas: 0xffffff,
      gasPrice: 0x0,
      from: "0xd65616c46a2e55957aff33e238b31bc568358e20"
    }

  },
  compilers: {
    solc: {
      version: "0.5.17", // A version or constraint - Ex. "^0.5.0"
      settings: {
        optimizer: {
          enabled: true,
          runs: 100   // Optimize for how many times you intend to run the code
        },
        evmVersion: "byzantium" // for T network
      }
    }
  }

  /*//HD Wallet for keyless servers (infura)
  const HDWalletProvider = require("truffle-hdwallet-provider");
  const Ganache = require("ganache-cli");

  let provider

  function getNmemonic() {
    try{
      return require('fs').readFileSync("./seed", "utf8").trim();
    } catch(err){
      return "";
    }
  }

  function getProvider(rpcUrl) {
    if (!provider) {
      provider = new HDWalletProvider(getNmemonic(), rpcUrl);
    }
    return provider;
  }

  module.exports = {
    networks: {
      in_memory: {
        get provider() {
          if (!provider) {
            provider = Ganache.provider({total_accounts: 25, gasLimit: '0xfffffff'});
          }
          return provider;
        },
        network_id: "*"
      },
      coverage: {
        host: "localhost",
        network_id: "*",
        port: 7555,         // <-- Use port 7555
        gas: 0xfffffff, // <-- Use this high gas value
        gasPrice: 0x01      // <-- Use this low gas price
      },
      development: {
        host: "localhost",
        port: 8545,
        network_id: "*",
        gas: 0xfffffff,
        gasPrice: 0x01
      },
      alastria_general1: {
        host: "192.168.31.200",
        port: 22001,
        network_id: "*", // Match any network id
        gas: 0xfffffff,
        gasPrice: 0x0,
        from: "0x0defda53d6e0ba7627a4891b43737c5889e280cc"
      },
      alastria_general2: {
        host: "192.168.31.200",
        port: 22002,
        network_id: "*", // Match any network id
        gas: 0xfffffffffffff,
        gasPrice: 0x0,
        from: "0x95066cdf6a5ac9489eeb28755f0e878eb3de711d"
      },
      alastria: {
        host: "34.246.45.100",
        port: 22000,
        network_id: "*", // Match any network id
        gas: 0xffffff,
        gasPrice: 0x0,
        from: "0x95066cdf6a5ac9489eeb28755f0e878eb3de711d"
      }
    }
  };
  */
};
