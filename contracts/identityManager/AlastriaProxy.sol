pragma solidity 0.6.6;

import "../libs/Owned.sol";

contract AlastriaProxy is Owned {
    //address public owner;

    event Forwarded (address indexed destination, uint value, bytes data);

    //TODO: upgradeable owner for version in Identity Manager
    //constructor () public {
    //    owner = msg.sender;
    //}

    fallback() external {
        revert();
    }

    function forward(address destination, uint value, bytes memory data) public onlyOwner {
        bool ret; 
        (ret, ) = destination.call.value(value)(data);
        require(ret);
        emit Forwarded(destination, value, data);
    }
}
