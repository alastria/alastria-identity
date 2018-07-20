module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    }, // FIXME: This is a deprecated network, use alastria
    'alastria.uport': {
      host: "35.176.19.89",
      port: 22000,
      network_id: "*",
      gas: 0xffffff,
      gasPrice: 0x0,
      from: "0xd65616c46a2e55957aff33e238b31bc568358e20"
    }, // FIXME: This is a deprecated network, use alastria
    'alastria.identity': {
      host: "35.176.19.89",
      port: 22000,
      network_id: "*",
      gas: 0xffffff,
      gasPrice: 0x0,
      from: "0xd65616c46a2e55957aff33e238b31bc568358e20"
      }, 
      'alastria': {
        host: "35.176.19.89",
        port: 22000,
        network_id: "*",
        gas: 0xffffff,
        gasPrice: 0x0,
        from: "0xd65616c46a2e55957aff33e238b31bc568358e20"
      },
  }
};
