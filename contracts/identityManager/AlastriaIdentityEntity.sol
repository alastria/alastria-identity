pragma solidity 0.4.23;

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
        IdentityEntity storage identityEntity;
        identityEntity.active = true;
	    entities[msg.sender] = identityEntity;
    }
    
    function addEntity(address _addressEntity, string _name, string _cif, string _url_logo, string _url_createAID, string _url_AOA, bool _active) public notIdentityEntity(_addressEntity) onlyIdentityEntity(msg.sender) {
         IdentityEntity storage identityEntity = entities[_addressEntity];
         listEntities.push(_addressEntity);
         entities[_addressEntity].name = _name;
         entities[_addressEntity].cif = _cif;
         entities[_addressEntity].url_logo = _url_logo;
         entities[_addressEntity].url_createAID = _url_createAID;
         entities[_addressEntity].url_AOA = _url_AOA;
         entities[_addressEntity].active = _active;
    }
    
    function setNameEntity(address _addressEntity, string _name) public{
        entities[_addressEntity].name = _name;
    }
    
    function setCifEntity(address _addressEntity, string _cif) public{
        entities[_addressEntity].cif = _cif;
    }
    
    function setUrlLogo(address _addressEntity, string _url_logo) public{
        entities[_addressEntity].url_logo = _url_logo;
    }
    
    function setUrlCreateAID(address _addressEntity, string _url_createAID) public{
        entities[_addressEntity].url_createAID = _url_createAID;
    }
    
    function setUrlAOA(address _addressEntity, string _url_AOA) public {
        entities[_addressEntity].url_AOA = _url_AOA;
    }

    
    function getEntity(address _addressEntity) public view returns(string _name, string _cif, string _url_logo, string _url_createAID, string _url_AOA, bool _active){
        _name = entities[_addressEntity].name;
        _cif = entities[_addressEntity].cif;
        _url_logo = entities[_addressEntity].url_logo;
        _url_createAID = entities[_addressEntity].url_createAID;
        _url_AOA = entities[_addressEntity].url_AOA;
        _active = entities[_addressEntity].active;
    }
    
    function entitiesList() public view returns(address[]){
        return listEntities;
    } 

}
