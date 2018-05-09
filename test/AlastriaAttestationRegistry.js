"use strict";
var AlastriaAttestationRegistry = artifacts.require('./AlastriaAttestationRegistry.sol')
// var Web3Utils = artifacts.require('web3-utils') not available, use solidity function instead.

// No se puede usar web3.toAscii porque añade un \0
// al final del string y falla el assert.equal
function hex2string(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
	var code = 0;
	// Nos saltamos el 0x inicial y eliminamos los caracteres 00
    for (var i = 2; i < hex.length; i += 2) {
		code = parseInt(hex.substr(i, 2), 16)
		if (code != 0)  
			str += String.fromCharCode(code);
	}
    return str;
}

function string2hex(str) {
  var arr = [];
  for (var i = 1, l = str.length; i < l; i ++) {
    var hex = Number(str.charCodeAt(i)).toString(16);
    arr.push(hex);
  }
  return arr.join('');
}

contract('AlastriaAttestationRegistry', function (accounts) {
  let Attestation

  let subject1 = accounts[0]
  let subject2 = accounts[1]
  let issuer1 = accounts[2]
  let issuer2 = accounts[3]

  var attribute1 = "Atribute1"  
  var attribute2 = "Attribute2"  
  var attribute3 = "Attribute2"  
  var attribute4 = "Attribute4"  
  
  var inputHex1 = web3.fromUtf8(attribute1);

  var dataHash1 = "0x3131"  // Should be web3.utils.soliditySha3(attribute1)
  var dataHash2 = "dataHash2"  
  var dataHash3 = "dataHash3"  
  var dataHash4 = "dataHash4" 
  
  var revocationKey1 = "0x3231" // Could be anything
  var revocationKey2 = "RevKey2"
  var revocationKey3 = "RevKey3"
  var revocationKey4 = "RevKey4"
  
  var revocationChallenge1 // Should be web3.utils.soliditySha3(dataHash1 + revocationKey1)
  var revocationChallenge2 
  var revocationChallenge3 
  var revocationChallenge4 
  var revCha
  
  //we can't reuse enum in solidity contract so status definition is duplicated here
  let Status = {
      "Valid": 0,
      "AskIssuer": 1,
      "Revoked": 2,
      "DeletedByUser": 3
  }
  
  
  before(done => {
    done()
  })

  it('Creates Attestation correctly', done => {
    let fakePrevVersion = accounts[3]
    AlastriaAttestationRegistry.new(fakePrevVersion, {from: accounts[0], gas: 3141592}).then(attestation => {
      Attestation = attestation
      return Attestation.version()
    }).then(version => {
      assert.equal(version.toNumber(), 3)
      return Attestation.previousPublishedVersion()
    }).then(previousVersion => {
      assert.equal(previousVersion, fakePrevVersion)
      return Attestation.revocationHash.call(dataHash1, revocationKey1)
    }).then(revCha => {
      revocationChallenge1 = revCha
      console.log("revCha1:"+revocationChallenge1)
      return Attestation.revocationHash.call(dataHash2, revocationKey2)
    }).then(revCha => {
      revocationChallenge2 = revCha
      console.log("revCha2:"+revocationChallenge2)
      return Attestation.revocationHash.call(dataHash3, revocationKey3)
    }).then(revCha => {
      revocationChallenge3 = revCha
      console.log("revCha3:"+revocationChallenge3)
      return Attestation.revocationHash.call(dataHash4, revocationKey4)
    }).then(revCha => {
      revocationChallenge4 = revCha
      console.log("revCha4:"+revocationChallenge4)
      done()
    }).catch(done)
  })

  
//Test Set 1: Subject1, Issuer1, dataHash1, revocationChallenge1, revocationKey1. One by one transitions
  it('Initial Set for subject1 ', done => {
    console.log ("Test Set 1: Subject1, Issuer1, dataHash1, revocationChallenge1, revocationKey1. One by one transitions")
    console.log("dataHash1 :"+dataHash1);
    console.log("revKey1 :"+revocationKey1);
    console.log("revCha1 :"+revocationChallenge1);
	
    Attestation.set(dataHash1, revocationChallenge1, "Direccion1", {from: subject1}).then(() => {
      return Attestation.get.call(subject1, dataHash1)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.Valid, 'should be valid')
      done()	  
    }).catch(done)
  })

  it('Change to AskIssuer by subject, no change', done => {
    Attestation.revoke(subject1, dataHash1, Status.AskIssuer, 0, {from: subject1}).then(() => {
      return Attestation.get.call(subject1, dataHash1)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.Valid, 'should be Valid, no change')
      done()	  
    }).catch(done)
  })

  it('Change to AskIssuer by issuer1', done => {
    Attestation.revoke(subject1, dataHash1, Status.AskIssuer, revocationKey1, {from: issuer1}).then(() => {
      return Attestation.get.call(subject1, dataHash1)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.AskIssuer, 'should be AskIssuer')
      done()	  
    }).catch(done)
  })

  it('Change to Revoked by issuer1', done => {
    Attestation.revoke(subject1, dataHash1, Status.Revoked, revocationKey1, {from: issuer1}).then(() => {
      return Attestation.get.call(subject1, dataHash1)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.Revoked, 'should be Revoked')
      done()	  
    }).catch(done)
  })

  it('Change to DeletedByUser by issuer1, no change', done => {
    Attestation.revoke(subject1, dataHash1, Status.DeletedByUser, revocationKey1, {from: issuer1}).then(() => {
      return Attestation.get.call(subject1, dataHash1)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.Revoked, 'should be Revoked')
      done()	  
    }).catch(done)
  })

  it('Change to DeletedByUser by subject', done => {
    Attestation.revoke(subject1, dataHash1, Status.DeletedByUser, 0, {from: subject1}).then(() => {
      return Attestation.get.call(subject1, dataHash1)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      done()	  
    }).catch(done)
  })


//Connjunto 2: Subject1, Issuer2, dataHash2, revocationChallenge2, revocationKey2. One by one transitions
  it('Initial Set for subject1 ', done => {
    console.log ("Test Set 2: Subject1, Issuer2, dataHash2, revocationChallenge2, revocationKey2. One by one transitions")
    console.log("dataHash2 :"+dataHash2);
    console.log("revKey2 :"+revocationKey2);
    console.log("revCha2 :"+revocationChallenge2);
	
    Attestation.set(dataHash2, revocationChallenge2, "Direccion2", {from: subject1}).then(() => {
      return Attestation.get.call(subject1, dataHash2)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.Valid, 'should be valid')
      done()	  
    }).catch(done)
  })

  it('Change to AskIssuer by subject1, no change', done => {
    Attestation.revoke(subject1, dataHash2, Status.AskIssuer, 0, {from: subject1}).then(() => {
      return Attestation.get.call(subject1, dataHash2)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.Valid, 'should be Valid, no change')
      done()	  
    }).catch(done)
  })

  it('Change to AskIssuer by issuer2', done => {
    Attestation.revoke(subject1, dataHash2, Status.AskIssuer, revocationKey2, {from: issuer2}).then(() => {
      return Attestation.get.call(subject1, dataHash2)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.AskIssuer, 'should be AskIssuer')
      done()	  
    }).catch(done)
  })

  it('Change to Revoked by subject1', done => {
    Attestation.revoke(subject1, dataHash2, Status.Revoked, 0, {from: subject1}).then(() => {
      return Attestation.get.call(subject1, dataHash2)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.Revoked, 'should be Revoked')
      done()	  
    }).catch(done)
  })

  it('Change to DeletedByUser by issuer2, no change', done => {
    Attestation.revoke(subject1, dataHash2, Status.DeletedByUser, revocationKey2, {from: issuer2}).then(() => {
      return Attestation.get.call(subject1, dataHash2)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.Revoked, 'should be Revoked')
      done()	  
    }).catch(done)
  })

  it('Change to DeletedByUser by subject1', done => {
    Attestation.revoke(subject1, dataHash2, Status.DeletedByUser, 0, {from: subject1}).then(() => {
      return Attestation.get.call(subject1, dataHash2)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      done()	  
    }).catch(done)
  })

  
//Test Set 3: Subject2, Issuer2, dataHash3, revocationChallenge3, revocationKey3. Direct jump to Revoked and backtransitions
  it('Initial Set for subject2 ', done => {
    console.log ("Test Set 3: Subject2, Issuer2, dataHash3, revocationChallenge3, revocationKey3. Direct jump to Revoked and backtransitions")
    console.log("dataHash3 :"+dataHash3);
    console.log("revKey3 :"+revocationKey3);
    console.log("revCha3 :"+revocationChallenge3);
	
    Attestation.set(dataHash3, revocationChallenge3, "Direccion3", {from: subject2}).then(() => {
      return Attestation.get.call(subject2, dataHash3)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.Valid, 'should be valid')
      done()	  
    }).catch(done)
  })

  it('Change to AskIssuer by subject2, no change', done => {
    Attestation.revoke(subject2, dataHash3, Status.AskIssuer, 0, {from: subject2}).then(() => {
      return Attestation.get.call(subject2, dataHash3)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.Valid, 'should be Valid, no change')
      done()	  
    }).catch(done)
  })

  it('Direct Change to Revoked by subject2', done => {
    Attestation.revoke(subject2, dataHash3, Status.Revoked, 0, {from: subject2}).then(() => {
      return Attestation.get.call(subject2, dataHash3)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.Revoked, 'should be Revoked')
      done()	  
    }).catch(done)
  })

  it('Back Change to Valid by subject2, no change', done => {
    Attestation.revoke(subject2, dataHash3, Status.Valid, 0, {from: subject2}).then(() => {
      return Attestation.get.call(subject2, dataHash3)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.Revoked, 'should be Revoked')
      done()	  
    }).catch(done)
  })

  it('Change to DeletedByUser by issuer2, no change', done => {
    Attestation.revoke(subject2, dataHash3, Status.DeletedByUser, revocationKey3, {from: issuer2}).then(() => {
      return Attestation.get.call(subject2, dataHash3)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.Revoked, 'should be Revoked')
      done()	  
    }).catch(done)
  })

  it('Change to DeletedByUser by subject 2', done => {
    Attestation.revoke(subject2, dataHash3, Status.DeletedByUser, 0, {from: subject2}).then(() => {
      return Attestation.get.call(subject2, dataHash3)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      done()	  
    }).catch(done)
  })

   it('Back Change to Valid by subject2, no change', done => {
    Attestation.revoke(subject2, dataHash3, Status.Valid, 0, {from: subject2}).then(() => {
      return Attestation.get.call(subject2, dataHash3)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      done()	  
    }).catch(done)
  })

   it('Back Change to AskIssuer by subject2, no change', done => {
    Attestation.revoke(subject2, dataHash3, Status.AskIssuer, 0, {from: subject2}).then(() => {
      return Attestation.get.call(subject2, dataHash3)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      done()	  
    }).catch(done)
  })

   it('Back Change to Revoked by subject2, no change', done => {
    Attestation.revoke(subject2, dataHash3, Status.Revoked, 0, {from: subject2}).then(() => {
      return Attestation.get.call(subject2, dataHash3)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      done()	  
    }).catch(done)
  })

   it('Back Change to Valid by Issuer2, no change', done => {
    Attestation.revoke(subject2, dataHash3, Status.Valid, revocationKey3, {from: issuer2}).then(() => {
      return Attestation.get.call(subject2, dataHash3)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      done()	  
    }).catch(done)
  })
  
   it('Back Change to AskIssuer by Issuer2, no change', done => {
    Attestation.revoke(subject2, dataHash3, Status.AskIssuer, revocationKey3, {from: issuer2}).then(() => {
      return Attestation.get.call(subject2, dataHash3)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      done()	  
    }).catch(done)
  })
  
   it('Back Change to Revoked by Issuer2, no change', done => {
    Attestation.revoke(subject2, dataHash3, Status.Revoked, revocationKey3, {from: issuer2}).then(() => {
      return Attestation.get.call(subject2, dataHash3)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      done()	  
    }).catch(done)
  })
  
//Test Set 4: Subject2, Issuer2, dataHash4, revocationChallenge4, revocationKey4. Direct jump to DeletedByUser
  it('Initial Set for subject2 ', done => {
    console.log ("Test Set 4: Subject2, Issuer2, dataHash4, revocationChallenge4, revocationKey4. Direct jump to DeletedByUser")
    console.log("dataHash4 :"+dataHash4);
    console.log("revKey4 :"+revocationKey4);
    console.log("revCha4 :"+revocationChallenge4);
	
    Attestation.set(dataHash4, revocationChallenge4, "Direccion4", {from: subject2}).then(() => {
      return Attestation.get.call(subject2, dataHash4)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.Valid, 'should be Valid')
      done()	  
    }).catch(done)
  })

  it('Direct Change to DeletedByUser by issuer2, no change', done => {
    Attestation.revoke(subject2, dataHash4, Status.DeletedByUser, revocationKey4, {from: issuer2}).then(() => {
      return Attestation.get.call(subject2, dataHash4)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.Valid, 'should be Valid')
      done()	  
    }).catch(done)
  })
  
  it('Direct Change to DeletedByUser by subject2', done => {
    Attestation.revoke(subject2, dataHash4, Status.DeletedByUser, 0, {from: subject2}).then(() => {
      return Attestation.get.call(subject2, dataHash4)
    }).then(function(r) {
      console.log("exists   :", r[0])
      console.log("status   :", r[1])
	  assert.strictEqual(r[0], true, 'should exists')
	  assert.strictEqual(r[1].toNumber(), Status.DeletedByUser, 'should be Revoked')
      done()	  
    }).catch(done)
  })

})

