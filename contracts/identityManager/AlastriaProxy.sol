pragma solidity 0.6.4;

import "../libs/Owned.sol";

contract AlastriaProxy is Owned {
//    address public owner;

    event Forwarded (address indexed destination, uint value, bytes data);

    //TODO: upgradeable owner for version in Identity Manager
    constructor () public {
        owner = msg.sender;
    }

//    function () payable external {
//        revert();
//    }

// payable deleted 
    fallback () payable external {  
        revert(); 
    }

    function forward(address destination, uint value, bytes memory data) public onlyOwner {
        (bool success, bytes memory returnData) = destination.call.value(value)(data);
	//destination.call.value(value);
	require(success);
        emit Forwarded(destination, value, returnData);

        //require(destination.call.value(value)(data));
    }
}

