pragma solidity 0.5.17;

import "../libs/Eidas.sol";

contract AlastriaIdentityEntity {

    using Eidas for Eidas.EidasLevel;

    struct IdentityEntity {  
        string name;
        string cif;
        string url_logo;
        string url_createAID;
        string url_AOA;
        bool active;
    }

    mapping(address => IdentityEntity) internal entities;
    address[] listEntities;

    modifier onlyIdentityEntity(address _identityEntity) {
        require (entities[_identityEntity].active == true);
        _;
    }
    
     modifier notIdentityEntity(address _identityEntity) {
        require (!entities[_identityEntity].active);
        _;
    }
   
    constructor () public {
        IdentityEntity storage identityEntity = entities[msg.sender];
	    identityEntity.active = true;
    }
    

    /**
    * @dev function that allows you to add a entity to the entities mapping
    * @param _addressEntity the address that identify the entity in the blockchain
    * @param _name the name of the entity
    * @param _cif the cif of the entity
    * @param _url_logo the url that contains the logo of the entity
    * @param _url_createAID the url that contains the alastria ID of the entity
    * @param _url_AOA the url that contains the AOA of the entity
    * @param _active a flag that shows if a entity is active or not
    */ 
    function addEntity(address _addressEntity, string memory _name, string memory _cif, string memory _url_logo, string memory _url_createAID, string memory _url_AOA, bool _active) public notIdentityEntity(_addressEntity) onlyIdentityEntity(msg.sender) {
         listEntities.push(_addressEntity);
         entities[_addressEntity].name = _name;
         entities[_addressEntity].cif = _cif;
         entities[_addressEntity].url_logo = _url_logo;
         entities[_addressEntity].url_createAID = _url_createAID;
         entities[_addressEntity].url_AOA = _url_AOA;
         entities[_addressEntity].active = _active;
    }
    
    /**
    * @dev function that allows you to change the name of the entity
    * @param _addressEntity the address that identify the entity in the blockchain
    * @param _name the new name of the entity
    */
    function setNameEntity(address _addressEntity, string memory _name) public onlyIdentityEntity(_addressEntity) {
        entities[_addressEntity].name = _name;
    }
    
    /**
    * @dev function that allows you to change the CIF of the entity
    * @param _addressEntity the address that identify the entity in the blockchain
    * @param _cif the new cif of the entity
    */
    function setCifEntity(address _addressEntity, string memory _cif) public onlyIdentityEntity(_addressEntity) {
        entities[_addressEntity].cif = _cif;
    }
    
    /**
    * @dev function that allows you to change the Url that contains the logo of the entity
    * @param _addressEntity the address that identify the entity in the blockchain
    * @param _url_logo the new url that contains the logo of the entity
    */
    function setUrlLogo(address _addressEntity, string memory _url_logo) public onlyIdentityEntity(_addressEntity) {
        entities[_addressEntity].url_logo = _url_logo;
    }
    
    /**
    * @dev function that allows you to change the Url that contains the Alastria ID of the entity
    * @param _addressEntity the address that identify the entity in the blockchain
    * @param _url_createAID the new url that contains the Alastria ID of the entity
    */
    function setUrlCreateAID(address _addressEntity, string memory _url_createAID) public onlyIdentityEntity(_addressEntity) {
        entities[_addressEntity].url_createAID = _url_createAID;
    }
    
    /**
    * @dev function that allows you to change the Url that contains the AOA of the entity
    * @param _addressEntity the address that identify the entity in the blockchain
    * @param _url_AOA the new url that contains the AOA of the entity
    */
    function setUrlAOA(address _addressEntity, string memory _url_AOA) public onlyIdentityEntity(_addressEntity) {
        entities[_addressEntity].url_AOA = _url_AOA;
    }

    /**
    * @dev function that returns all the information of a entity
    * @param _addressEntity the address that identify the entity in the blockchain
    * @return _name of the entity you pass to the functions as a parameter
    * @return _cif of the entity you pass to the functions as a parameter
    * @return _url_logo of the entity you pass to the functions as a parameter
    * @return _url_createAID of the entity you pass to the functions as a parameter
    * @return _url_AOA of the entity you pass to the functions as a parameter
    * @return _active of the entity you pass to the functions as a parameter
    */
    function getEntity(address _addressEntity) public view returns(string memory _name, string memory _cif, string memory _url_logo, string memory _url_createAID, string memory _url_AOA, bool _active){
        _name = entities[_addressEntity].name;
        _cif = entities[_addressEntity].cif;
        _url_logo = entities[_addressEntity].url_logo;
        _url_createAID = entities[_addressEntity].url_createAID;
        _url_AOA = entities[_addressEntity].url_AOA;
        _active = entities[_addressEntity].active;
    }
    
    /**
    * @dev function that return the list of entities that are registered in the blockchain
    * @return array of address of entities
    */
    function entitiesList() public view returns(address[] memory){
        return listEntities;
    } 

}
