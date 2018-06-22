pragma solidity ^0.4.8;
// Deleted dependency to import "./libs/Owned.sol";


contract proxy {
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

    constructor () {
      owner = msg.sender;
      recover = msg.sender;
    }

    function () payable { Received(msg.sender, msg.value); }

    function forward(address destination, uint value, bytes data) public onlyOwner {
        require(destination.call.value(value)(data));
        Forwarded(destination, value, data);
    }

    function Owned() {
      owner = msg.sender;
    }

    function isOwner(address addr) public returns(bool) {
      return addr == owner;
    }

    function isRecover(address addr) public returns(bool) {
      return addr == recover;
    }

    function transfer(address newOwner) public onlyOwnerOrRecover {
        if (newOwner != address(this)) {
            owner = newOwner;
        }
    }
}
