pragma solidity 0.5.17;

import "../libs/Ownable.sol";

contract AlastriaProxy is Ownable {

    event Forwarded (address indexed destination, uint value, bytes data);
    string public reason;

    function () external {
        revert();
    }

    function forward(address destination, bytes memory data) public payable onlyOwner returns(bytes memory){
        (bool success, bytes memory returnData) = destination.call.value(msg.value)(data);
        require(success);
        emit Forwarded(destination, msg.value, data);
        return returnData;
    }
}
