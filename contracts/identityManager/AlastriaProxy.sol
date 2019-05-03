pragma solidity ^0.4.23;

import "contracts/libs/Owned.sol";

contract AlastriaProxy is Owned {
    address public owner;
    address public recover;

    event Forwarded (address indexed destination, uint value, bytes data);
    event Received (address indexed sender, uint value);

    modifier onlyOwner() {
        require(isOwner(msg.sender));
        _;
    }

    modifier onlyOwnerOrRecover() {
        require(isOwner(msg.sender)||isRecover(msg.sender));
        _;
    }

    constructor () public {
        owner = msg.sender;
        recover = msg.sender;
    }

    function () payable public{
        emit Received(msg.sender, msg.value);
    }

    function forward(address destination, uint value, bytes data) public onlyOwner {
        require(destination.call.value(value)(data));
        emit Forwarded(destination, value, data);
    }

    function isRecover(address addr) public view returns(bool) {
        return addr == recover;
    }
}
