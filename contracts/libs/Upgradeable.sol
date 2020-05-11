pragma solidity 0.6.4;

contract Upgradeable {
    bool private isMigrating;
    bool private migrated;
    uint256 public version;
    address public lastVersion;
    
    /** 
     * Dev: The constructor must be called as a modifier in the main contract
     * @param _lastVersion the address of the contract being upgraded
     */ 
    constructor (address _lastVersion) internal {
        lastVersion = _lastVersion;
        if(_lastVersion == address(0)){
            migrated = false;
            isMigrating = false;
            version = 0;
        } else {
            Upgradeable last = Upgradeable(_lastVersion);
            bool migrationState = last.getMigrationState();
            if(!migrationState){
                revert();
            } else {
                migrated = false;
                isMigrating = true;
            }
        }
    }

    /**
     * Dev: this modifier should be added in all the functions of the main contract
     */
    modifier isLastVersion(){
        require(!migrated && !isMigrating, "UPGRADEABLE: the contract called is not the last version");
        _;
    }
    
    /**
     * Dev: returns the current version of the contract
     * @return current version
     */
    function getVersion() public view returns(uint256){
        return version;
    }

    /**
     * Dev: returns the current state of migration, if is the last version, should be false
     */
    function getMigrationState() public view returns(bool) {
        return isMigrating;
    }

    /**
     * Dev: this method must be public to be called by the last version to finish the migration
     * @param _versionIndex set the numeric index for version
     */
    function setNewVersion(uint256 _versionIndex) public {
        require(msg.sender == lastVersion, "UPGRADEABLE: only last version can set the new version index");
        require(_versionIndex > version, "UPGRADEABLE: new version must be higher than previus version");
        version = _versionIndex; 
        isMigrating = false;

    }

    function _initMigration() internal {
        require(!isMigrating);
        require(!migrated);
        isMigrating = true;
    }
    
    function _cancelMigration() internal {
        require(isMigrating);
        require(!migrated);
        require(version != 0);
        require(lastVersion != address(0));
        isMigrating = false;
    }
    
    function _endMigration(address nextVersion) internal {
        require(isMigrating);
        require(!migrated);
        Upgradeable next = Upgradeable(nextVersion);
        next.setNewVersion(version + 1);
        migrated = true;
        isMigrating = false;
    }
}