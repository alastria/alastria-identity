pragma solidity 0.4.23;

import "../libs/Owned.sol";

contract AlastriaProxy is Owned {
    address public owner;

    event Forwarded (address indexed destination, uint value, bytes data);

    //TODO: upgradeable owner for version in Identity Manager
    constructor () public {
        owner = msg.sender;
    }

    function () payable public{
        revert();
    }

    function forward(address destination, uint value, bytes data) public onlyOwner {
        require(destination.call.value(value)(data));
        emit Forwarded(destination, value, data);
    }
}
