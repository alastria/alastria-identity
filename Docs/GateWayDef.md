#GateWay
```
  //API POST
  //@AlastriaIdentityCreationToken: MetaIdentityManagerTx + AT + SubjectPubKey
  function IdentityCreation (JSON AlastriaIdentityCreationToken){}

  //API POST
  //@AlastriaID
  function getPubKey (address AlastridID)

  //API POST
  //
  function setPubKey (address AlastriaID, bytes32 newPubKey)

  //API POST
  /*
    txData : {
    "from": "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
    "to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
    "gas": "0x76c0", // 30400
    "gasPrice": "0x9184e72a000", // 10000000000000
    "value": "0x9184e72a", // 2441406250
    "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
    }.FirmaCuentaUsuario
  */
  function sendRawTransaction (bytes txData)

  //API GET
  function get ()
```
