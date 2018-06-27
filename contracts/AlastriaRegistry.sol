pragma solidity ^0.4.8;

//group_bme
contract AlastriaRegistry{

  uint public version;
  address public previousPublishedVersion;

  enum EidasLevel { Reputational, Low, Substantial, High }

  struct RegistryEntry {
    bytes32 value; //hash or url of attestation. This might change if we use IPFS since it sometimes uses more than 32 bytes
    EidasLevel eidas; //level of eidas
    bool accepted; //accepted by subject
	bool revoked; //Revoked by Issue
	bool exists; //exists in mapping
  }

  struct UserAtributeList {
    bytes32[] registrationIdentifier;
    address[] issuer;
  }

  mapping(bytes32 => mapping(address => mapping(address => RegistryEntry))) internal registry;
  mapping (address => UserAtributeList) internal userAttributes;

  function UportRegistry(address _previousPublishedVersion) public {
    version = 3;
    previousPublishedVersion = _previousPublishedVersion;
  }

  //events
  event Set(
    bytes32 indexed registrationIdentifier,
    address indexed issuer,
    address indexed subject,
    EidasLevel eidas,
    bool accepted,
	bool revoked,
    uint updatedAt);

  event AcceptedEntry(
    bytes32 indexed registrationIdentifier,
    address indexed issuer,
    address indexed subject,
    uint acceptedAt);

  event RejectedEntry(
    bytes32 indexed registrationIdentifier,
    address indexed issuer,
    address indexed subject,
    uint rejectAt);

  event RemovedEntry(
    bytes32 indexed registrationIdentifier,
    address indexed issuer,
    address indexed subject,
    uint removedAt);

  event RevokedEntry(
    bytes32 indexed registrationIdentifier,
    address indexed issuer,
    address indexed subject,
    uint revokedAt);

  modifier validEntryData(address issuer, address subject, EidasLevel eidas) {
    require(issuer!=subject || eidas==EidasLevel.Reputational); //issuer is different than subject or eidas level equal to reputational
    //we can add other conditions here such as value!=0 etc
    _;
  }

  modifier entryExists(bytes32 registrationIdentifier, address issuer, address subject) {
    assert(registry[registrationIdentifier][issuer][subject].exists == true);
    _;
  }

  //create or update attestation for me or other entity. It will be marked as 'accepted' only if issuer == subject
  function set(bytes32 registrationIdentifier, address subject, bytes32 value, EidasLevel eidas) public validEntryData(msg.sender, subject, eidas){
      bool accepted = (msg.sender == subject);
      bool revoked = false;
      registry[registrationIdentifier][msg.sender][subject] = RegistryEntry ({value:value, eidas:eidas, accepted:accepted, revoked:revoked, exists:true});
      userAttributes[subject].registrationIdentifier.push(registrationIdentifier);
      userAttributes[subject].issuer.push(msg.sender);
	  Set(registrationIdentifier, msg.sender, subject, eidas, accepted, revoked, now);
  }

  //create or update attestation for myself. Eidas level will be Reputational and accepted=true
  function setMyself(bytes32 registrationIdentifier, bytes32 value) public {
      set(registrationIdentifier, msg.sender, value, EidasLevel.Reputational);
  }

  //revoked a previously saved entry in registry
  function revokeEntry(bytes32 registrationIdentifier, address subject, address issuer) public entryExists(registrationIdentifier, subject, issuer ){
        registry[registrationIdentifier][issuer][msg.sender].revoked = false;
        RevokedEntry(registrationIdentifier, issuer, msg.sender, now);
   }


  //reject a previously saved entry in registry
  function rejectEntry(bytes32 registrationIdentifier, address issuer) public entryExists(registrationIdentifier, issuer, msg.sender){
    registry[registrationIdentifier][issuer][msg.sender].accepted = false;
    RejectedEntry(registrationIdentifier, issuer, msg.sender, now);
  }

  //accept a previously saved entry in registry
  function acceptEntry(bytes32 registrationIdentifier, address issuer) public entryExists(registrationIdentifier, issuer, msg.sender){
    registry[registrationIdentifier][issuer][msg.sender].accepted = true;
    AcceptedEntry(registrationIdentifier, issuer, msg.sender, now);
  }

  //get entry by id, issuer and subject
  function get(bytes32 registrationIdentifier, address issuer, address subject) public constant returns (bytes32 value, EidasLevel eidas, bool accepted, bool revoked, bool exists) {
      RegistryEntry storage entry = registry[registrationIdentifier][issuer][subject];
      return (entry.value, entry.eidas, entry.accepted, entry.revoked, entry.exists);//should throw exception if not exists?
  }

  //get entry for myself by id and issuer
  function getMyself(bytes32 registrationIdentifier, address issuer) public constant returns (bytes32 value, EidasLevel eidas, bool accepted, bool revoked, bool exists) {
      return get(registrationIdentifier, issuer, msg.sender);
  }

  //get my attributes
  function getMyAttributes() public constant returns (bytes32[], address[]) {
    UserAtributeList storage myAttributes = userAttributes[msg.sender];
    return (myAttributes.registrationIdentifier, myAttributes.issuer);
  }

  //
    /*
	//remove entry ---- If implemented, the related attributes, userAttributes, must be taken into consideration
	//=======================================================================================================================================================
	  function removeEntry(bytes32 registrationIdentifier, address issuer, address subject) public entryExists(registrationIdentifier, issuer, msg.sender){
	    require(msg.sender == issuer || msg.sender == subject);
	    RemovedEntry(registrationIdentifier, issuer, subject, now);
	    delete registry[registrationIdentifier][issuer][subject];
		// Remove attribute form userAttributes. Pending

	  }

	  //remove entry for myself
	  function removeEntryMyself(bytes32 registrationIdentifier, address issuer) public {
	    removeEntry(registrationIdentifier, issuer, msg.sender);
	  }
	*/
}
