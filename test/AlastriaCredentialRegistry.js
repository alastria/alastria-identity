"use strict";
var AlastriaCredentialRegistry = artifacts.require('./AlastriaCredentialRegistry.sol');


contract('AlastriaCredentialRegistry', (accounts) => {
  let Credential;

  var verboseLevel = 1;

  let subject1 = accounts[0];
  let subject2 = accounts[1];
  let issuer1 = accounts[2];
  let issuer2 = accounts[3];

  var credential1 = "Credential1";
  var credential2 = "Credential2";
  var credential3 = "Credential2";
  var credential4 = "Credential4";

  var subjectCredentialHash1 = "subjectCredentialHash1"; // Should be web3.eth.abi.encodeParameter("bytes32",web3.utils.soliditySha3(credential1))
  var subjectCredentialHash2 = "subjectCredentialHash2"; // but readable strings make life easier.
  var subjectCredentialHash3 = "subjectCredentialHash3";
  var subjectCredentialHash4 = "subjectCredentialHash4";

  var signature1 = "signature1"; // Should be the signature of credential1
  var signature2 = "signature2";
  var signature3 = "signature3";
  var signature4 = "signature4";

  var issuerCredentialHash1 = "issuerCredentialHash1"; // Should be web3.eth.abi.encodeParameter("bytes32",web3-utils.soliditySha3(subjectCredentialHash1 + signature1))
  var issuerCredentialHash2 = "issuerCredentialHash2";
  var issuerCredentialHash3 = "issuerCredentialHash3";
  var issuerCredentialHash4 = "issuerCredentialHash4";
  var issuerCredentialHash

  // Return Variables from Solidity Smart Contract
  var txResult;
  var subjectStatus;
  var issuerStatus;
  var credentialStatus;
  var credentialList;

  //we can't reuse enum in solidity contract, so status definition is duplicated here
  let Status = {
      "Valid": 0,
      "AskIssuer": 1,
      "Revoked": 2,
      "DeletedBySubject": 3
  }

  function logStatus(verbosity) {
    var i
    var attString

    if (verbosity <= verboseLevel) {
      /* More detailled view: log(2, "subject    : " , subjectStatus[0] , ", " , subjectStatus[1], ",", subjectStatus[1].c)*/
      console.log("subject    : " + subjectStatus)
      console.log("issuer     : " + issuerStatus)
      console.log("att. status: " + credentialStatus)
      /* console.log("AttList    : ", credentialList) */
      /* Detailed credentialList one by one in UTF8 */
      attString = credentialList[0]
      for (i = 0; i < credentialList[0]; i++) {
        attString = attString + ", " + web3.toUtf8(credentialList[1][i])
      }
      console.log("AttList    : ", attString)

      for (i = 0; i < txResult.logs.length; i++) {
        console.log("Event      : " + txResult.logs[i].event, ", args: ", txResult.logs[i].args)
      }
    }
  }

  function log (verbosity, message) {
    if (verbosity <= verboseLevel) {
      console.log(message);
    }
  }

  before(done => {
    done()
  })

  it('Creates AlastriaCredentialRegistry correctly', async() => {
    Credential = await AlastriaCredentialRegistry.deployed();
    const version = await Credential.version();
    const previousVersion = await Credential.previousPublishedVersion();

    assert.equal(version.toNumber(), 3, 'The `version` must be `3`.');
    assert.equal(previousVersion, accounts[0], 'The contract was deployed for the 0 account.');
  })


//Test Set 1: Subject1, Issuer1, subjectCredentialHash1, issuerCredentialHash1. One by one transitions
  it('Initial addSubjectCredential for subject1, Issuer1', done => {
    log(2, "");
    log(2, "Test Set 1: Subject1, Issuer1, subjectCredentialHash1, issuerCredentialHash1. One by one transitions")
    log(2, "Subject1  : "+subject1);
    log(2, "Issuer1   : "+issuer1);
    log(2, "subjectCredentialHash1 : "+subjectCredentialHash1);
    log(2, "issuerCredentialHash1  : "+issuerCredentialHash1);
    log(2, "");
    Credential.addSubjectCredential(subjectCredentialHash1, "Direccion1", {from: subject1}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject1, subjectCredentialHash1)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer1, issuerCredentialHash1)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject1})
    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(credentialStatus.toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(credentialList[0].toNumber(), 1, 'should be 1')
      assert.strictEqual(web3.toUtf8(credentialList[1][0]), subjectCredentialHash1, 'should be subjectCredentialHash1')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)

  })

  it('Second equal addSubjectCredential for subject1, Issuer1, will fail & revert', done => {
    Credential.addSubjectCredential(subjectCredentialHash1, "Direccion1", {from: subject1}).then(() => {
      log(2, "")
      assert (false, "ERROR: Expected exception")
      log(2, "")
      done()
    }).catch ( () => {
      log(2, "")
      log(2, "Expected exception caught, check nothing changed")
      log(2, "")
      return Credential.getSubjectCredentialStatus.call(subject1, subjectCredentialHash1)
      .then(function(r) {
        subjectStatus = r
        return Credential.getIssuerCredentialStatus.call(issuer1, issuerCredentialHash1)
      }).then(function(r) {
        issuerStatus = r
        return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
      }).then(function(r) {
        credentialStatus = r
        return Credential.getSubjectCredentialList({from: subject1})
      }).then(function(r) {
        credentialList = r
        logStatus(2)
        assert.strictEqual(subjectStatus[0], true, 'should exist')
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
        assert.strictEqual(issuerStatus[0], false, 'should exist')
        assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be valid')
        assert.strictEqual(credentialStatus.toNumber(), Status.Valid, 'should be valid')
        assert.strictEqual(credentialList[0].toNumber(), 1, 'should be 1')
        assert.strictEqual(web3.toUtf8(credentialList[1][0]), subjectCredentialHash1, 'should be subjectCredentialHash1')
        done()
        })
    }).catch(done)
  })

  it('Change to invalid Status by issuer1, will fail & revert', done => {
    Credential.updateCredentialStatus(issuerCredentialHash1, 10, {from: issuer1}).then(() => {
      log(2, "")
      assert (false, "ERROR: Expected exception")
      log(2, "")
      done()
    }).catch ( () => {
      log(2, "")
      log(2, "Expected exception caught, check nothing changed")
      log(2, "")
      return Credential.getSubjectCredentialStatus.call(subject1, subjectCredentialHash1)
      .then(function(r) {
        subjectStatus = r
        return Credential.getIssuerCredentialStatus.call(issuer1, issuerCredentialHash1)
      }).then(function(r) {
        issuerStatus = r
        return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
      }).then(function(r) {
        credentialStatus = r
        return Credential.getSubjectCredentialList({from: subject1})
      }).then(function(r) {
        credentialList = r
        logStatus(2)
        assert.strictEqual(subjectStatus[0], true, 'should exist')
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
        assert.strictEqual(issuerStatus[0], false, 'should exist')
        assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be valid')
        assert.strictEqual(credentialStatus.toNumber(), Status.Valid, 'should be valid')
        assert.strictEqual(credentialList[0].toNumber(), 1, 'should be 1')
        assert.strictEqual(web3.toUtf8(credentialList[1][0]), subjectCredentialHash1, 'should be subjectCredentialHash1')
        done()
        })
    }).catch(done)
  })

  it('Change to AskIssuer by subject, no change', done => {
    Credential.updateCredentialStatus(issuerCredentialHash1, Status.AskIssuer, {from: subject1}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject1, subjectCredentialHash1)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer1, issuerCredentialHash1)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject1})
    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(credentialStatus.toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "IssuerCredentialRevoked", 'should be IssuerCredentialRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.issuerCredentialHash), issuerCredentialHash1, 'should be issuerCredentialHash1' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.AskIssuer, 'should be AkIssuer' )
      done()
    }).catch(done)
  })

  it('Change to AskIssuer by issuer1', done => {
    Credential.updateCredentialStatus(issuerCredentialHash1, Status.AskIssuer, {from: issuer1}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject1, subjectCredentialHash1)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer1, issuerCredentialHash1)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject1})
    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(credentialStatus.toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "IssuerCredentialRevoked", 'should be IssuerCredentialRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.issuerCredentialHash), issuerCredentialHash1, 'should be issuerCredentialHash1' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.AskIssuer, 'should be AkIssuer' )
      done()
    }).catch(done)
  })

  it('Change to Revoked by issuer1', done => {
    Credential.updateCredentialStatus(issuerCredentialHash1, Status.Revoked, {from: issuer1}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject1, subjectCredentialHash1)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer1, issuerCredentialHash1)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject1})
    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(credentialStatus.toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "IssuerCredentialRevoked", 'should be IssuerCredentialRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.issuerCredentialHash), issuerCredentialHash1, 'should be issuerCredentialHash1' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Revoked, 'should be Revoked' )
      done()
    }).catch(done)
  })

  it('Change to DeletedBySubject by issuer1, no change', done => {
    Credential.deleteSubjectCredential(subjectCredentialHash1, {from: issuer1}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject1, subjectCredentialHash1)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer1, issuerCredentialHash1)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject1})
    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(credentialStatus.toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })

  it('Change to DeletedBySubject by subject', done => {
    Credential.deleteSubjectCredential(subjectCredentialHash1, {from: subject1}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject1, subjectCredentialHash1)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer1, issuerCredentialHash1)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject1})
    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(credentialStatus.toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "SubjectCredentialDeleted", 'should be SubjectCredentialDeleted')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.subjectCredentialHash), subjectCredentialHash1, 'should be subjectCredentialHash1' )
      done()
    }).catch(done)
  })


//Connjunto 2: Subject1, Issuer2, subjectCredentialHash2, issuerCredentialHash2. One by one transitions
  it('Initial Set for subject1, Issuer2', done => {
    log(2, "");
    log(2, "Test Set 2: Subject1, Issuer2, subjectCredentialHash2, issuerCredentialHash2. One by one transitions")
    log(2, "subjectCredentialHash2 : "+subjectCredentialHash2);
    log(2, "issuerCredentialHash2  : "+issuerCredentialHash2);
    log(2, "");

    Credential.addSubjectCredential(subjectCredentialHash2, "Direccion2", {from: subject1}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject1, subjectCredentialHash2)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash2)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject1})
    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(credentialStatus.toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(credentialList[0].toNumber(), 2, 'should be 2')
      assert.strictEqual(web3.toUtf8(credentialList[1][1]), subjectCredentialHash2, 'should be subjectCredentialHash2')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })

  it('Change to AskIssuer by subject1, no change', done => {
    Credential.updateCredentialStatus(issuerCredentialHash2, Status.AskIssuer, {from: subject1}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject1, subjectCredentialHash2)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash2)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject1})
    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(credentialStatus.toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "IssuerCredentialRevoked", 'should be IssuerCredentialRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.issuerCredentialHash), issuerCredentialHash2, 'should be issuerCredentialHash2' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.AskIssuer, 'should be AskIssuer' )
      done()
    }).catch(done)
  })

  it('Change to AskIssuer by issuer2', done => {
    Credential.updateCredentialStatus(issuerCredentialHash2, Status.AskIssuer, {from: issuer2}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject1, subjectCredentialHash2)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash2)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject1})
    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(credentialStatus.toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "IssuerCredentialRevoked", 'should be IssuerCredentialRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.issuerCredentialHash), issuerCredentialHash2, 'should be issuerCredentialHash2' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.AskIssuer, 'should be AskIssuer' )
      done()
    }).catch(done)
  })

  it('Change to Revoked by subject1, no change', done => {
    Credential.updateCredentialStatus(issuerCredentialHash2, Status.Revoked, {from: subject1}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject1, subjectCredentialHash2)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash2)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject1})
    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(credentialStatus.toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "IssuerCredentialRevoked", 'should be IssuerCredentialRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.issuerCredentialHash), issuerCredentialHash2, 'should be issuerCredentialHash2' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Revoked, 'should be Revoked' )
      done()
    }).catch(done)
  })

  it('Change to Revoked by issuer1, no change', done => {
    Credential.updateCredentialStatus(issuerCredentialHash2, Status.Revoked, {from: issuer1}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject1, subjectCredentialHash2)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash2)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject1})
    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(credentialStatus.toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "IssuerCredentialRevoked", 'should be IssuerCredentialRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.issuerCredentialHash), issuerCredentialHash2, 'should be issuerCredentialHash2' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Revoked, 'should be Revoked' )
      done()
    }).catch(done)
  })

  it('Change to Revoked by issuer2', done => {
    Credential.updateCredentialStatus(issuerCredentialHash2, Status.Revoked, {from: issuer2}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject1, subjectCredentialHash2)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash2)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject1})
    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(credentialStatus.toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "IssuerCredentialRevoked", 'should be IssuerCredentialRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.issuerCredentialHash), issuerCredentialHash2, 'should be issuerCredentialHash2' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Revoked, 'should be Revoked' )
      done()
    }).catch(done)
  })

  it('Change to DeletedBySubject by issuer2, no change', done => {
    Credential.deleteSubjectCredential (subjectCredentialHash2, {from: issuer2}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject1, subjectCredentialHash2)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash2)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject1})
    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(credentialStatus.toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })

  it('Change to DeletedBySubject by subject1', done => {
    Credential.deleteSubjectCredential (subjectCredentialHash2, {from: subject1}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject1, subjectCredentialHash2)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash2)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject1})
    }).then(function(r) {
      credentialList = r
      return Credential.getSubjectCredentialList({from: subject1})
    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(credentialStatus.toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "SubjectCredentialDeleted", 'should be SubjectCredentialDeleted')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.subjectCredentialHash), subjectCredentialHash2, 'should be subjectCredentialHash2' )
      done()
    }).catch(done)
  })


//Test Set 3: Subject2, Issuer2, subjectCredentialHash3, issuerCredentialHash3. Direct jump to Revoked and backtransitions
  it('Initial Set for subject2 ', done => {
    log(2, "");
    log(2, "Test Set 3: Subject2, Issuer2, subjectCredentialHash3, issuerCredentialHash3. Direct jump to Revoked and backtransitions")
    log(2, "subjectCredentialHash3 : "+subjectCredentialHash3);
    log(2, "issuerCredentialHash3  : "+issuerCredentialHash3);
    log(2, "");

    Credential.addSubjectCredential(subjectCredentialHash3, "Direccion3", {from: subject2}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject2, subjectCredentialHash3)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash3)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject2})
    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(credentialStatus.toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(credentialList[0].toNumber(), 1, 'should be 1')
      assert.strictEqual(web3.toUtf8(credentialList[1][0]), subjectCredentialHash3, 'should be subjectCredentialHash3')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })

  it('Change to AskIssuer by subject2, no change', done => {
    Credential.updateCredentialStatus(issuerCredentialHash3, Status.AskIssuer, {from: subject2}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject2, subjectCredentialHash3)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash3)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject2})
    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(credentialStatus.toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "IssuerCredentialRevoked", 'should be IssuerCredentialRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.issuerCredentialHash), issuerCredentialHash3, 'should be issuerCredentialHash3' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.AskIssuer, 'should be AskIssuer' )
      done()
    }).catch(done)
  })

  it('Direct Change to Revoked by subject2, no change', done => {
    Credential.updateCredentialStatus(issuerCredentialHash3, Status.Revoked, {from: subject2}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject2, subjectCredentialHash3)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash3)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject2})    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(credentialStatus.toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "IssuerCredentialRevoked", 'should be IssuerCredentialRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.issuerCredentialHash), issuerCredentialHash3, 'should be issuerCredentialHash3' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Revoked, 'should be Revoked' )
      done()
    }).catch(done)
  })

  it('Change to DeletedBySubject by issuer2, no change', done => {
    Credential.deleteSubjectCredential (subjectCredentialHash3, {from: issuer2}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject2, subjectCredentialHash3)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash3)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject2})    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(credentialStatus.toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })

  it('Direct Change to Revoked by issuer2', done => {
    Credential.updateCredentialStatus(issuerCredentialHash3, Status.Revoked, {from: issuer2}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject2, subjectCredentialHash3)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash3)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject2})    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(credentialStatus.toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "IssuerCredentialRevoked", 'should be IssuerCredentialRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.issuerCredentialHash), issuerCredentialHash3, 'should be issuerCredentialHash3' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Revoked, 'should be Revoked' )
      done()
    }).catch(done)
  })

  it('Back Change to Valid by Issuer2, no change', done => {
    Credential.updateCredentialStatus(issuerCredentialHash3, Status.Valid, {from: issuer2}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject2, subjectCredentialHash3)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash3)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject2})    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(credentialStatus.toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })

   it('Back Change to AskIssuer by Issuer2, no change', done => {
    Credential.updateCredentialStatus(issuerCredentialHash3, Status.AskIssuer, {from: issuer2}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject2, subjectCredentialHash3)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash3)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject2})    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(credentialStatus.toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
      }).catch(done)
  })

  it('Change to DeletedBySubject by subject 2', done => {
    Credential.deleteSubjectCredential(subjectCredentialHash3, {from: subject2}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject2, subjectCredentialHash3)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash3)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject2})    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(credentialStatus.toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "SubjectCredentialDeleted", 'should be SubjectCredentialDeleted')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.subjectCredentialHash), subjectCredentialHash3, 'should be subjectCredentialHash3' )
      done()
    }).catch(done)
  })

  it('Back Change to Valid by subject2, no change', done => {
    Credential.deleteSubjectCredential(subjectCredentialHash3, {from: subject2}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject2, subjectCredentialHash3)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash3)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject2})    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(credentialStatus.toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })


//Test Set 4: Subject2, Issuer2, subjectCredentialHash4, issuerCredentialHash4. Direct jump to DeletedBySubject, registering many hashes in the middle
  it('Initial Set for subject2 subjectCredentialHash4 ', done => {
    log(2, "");
    log(2, "Test Set 4: Subject2, Issuer2, subjectCredentialHash4, issuerCredentialHash4. Direct jump to DeletedBySubject, registering many hashes in the middle")
    log(2, "subjectCredentialHash4 : " +subjectCredentialHash4);
    log(2, "issuerCredentialHash4  : " +issuerCredentialHash4);
    log(2, "");
    Credential.addSubjectCredential("MiddH2", "MidDireccion2", {from: subject2})
    Credential.addSubjectCredential("MiddH3", "MidDireccion3", {from: subject2})
    Credential.addSubjectCredential("MiddH4", "MidDireccion4", {from: subject2})
    Credential.addSubjectCredential("MiddH5", "MidDireccion5", {from: subject2})
    Credential.addSubjectCredential("MiddH6", "MidDireccion6", {from: subject2})
    Credential.addSubjectCredential("MiddH7", "MidDireccion7", {from: subject2})
    Credential.addSubjectCredential("MiddH8", "MidDireccion8", {from: subject2})
    Credential.addSubjectCredential("MiddH9", "MidDireccion9", {from: subject2})
    Credential.addSubjectCredential(subjectCredentialHash4, "Direccion4", {from: subject2}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject2, subjectCredentialHash4)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash4)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject2})    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(credentialStatus.toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(credentialList[0].toNumber(), 10, 'should be 10')
      assert.strictEqual(web3.toUtf8(credentialList[1][9]), subjectCredentialHash4, 'should be subjectCredentialHash4')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })

  it('Direct Change to DeletedBySubject by issuer2, no change', done => {
    Credential.deleteSubjectCredential(subjectCredentialHash4, {from: issuer2}).then(function(r) {
      txResult = r
      return Credential.getSubjectCredentialStatus.call(subject2, subjectCredentialHash4)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash4)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject2})    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(credentialStatus.toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })

  it('Direct Change to DeletedBySubject by subject2', done => {
    Credential.deleteSubjectCredential(subjectCredentialHash4, {from: subject2}).then(function(r) {
      txResult = r
       return Credential.getSubjectCredentialStatus.call(subject2, subjectCredentialHash4)
    }).then(function(r) {
      subjectStatus = r
      return Credential.getIssuerCredentialStatus.call(issuer2, issuerCredentialHash4)
    }).then(function(r) {
      issuerStatus = r
      return Credential.getCredentialStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      credentialStatus = r
      return Credential.getSubjectCredentialList({from: subject2})    }).then(function(r) {
      credentialList = r
      logStatus(2)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(credentialStatus.toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "SubjectCredentialDeleted", 'should be SubjectCredentialDeleted')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.subjectCredentialHash), subjectCredentialHash4, 'should be subjectCredentialHash4' )
      done()
    }).catch(done)
  })

})
