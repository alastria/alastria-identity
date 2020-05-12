pragma solidity 0.5.17;

contract Owned {
    address public owner;
    modifier onlyOwner() {
        require(isOwner(msg.sender));
        _;
    }

    constructor () public {
        owner = msg.sender;
    }

    function isOwner(address addr) public view returns(bool) {
        return addr == owner;
    }

    function transfer(address newOwner) public onlyOwner {
        if (newOwner != address(this)) {
            owner = newOwner;
        }
    }
}
