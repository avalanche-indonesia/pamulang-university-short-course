// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract SimpleStorage {
  address public owner;
  uint256 private storedValue;
  string private message;

  event OwnerSet(address indexed oldOwner, address indexed newOwner);
  event ValueUpdated(uint256 newValue);
  event MessageUpdated(string newMessage);

  modifier onlyOwner {
    require(msg.sender == owner, "Not owner");
    _;
  }

  constructor() {
    owner = msg.sender;
    emit OwnerSet(address(0), msg.sender);
  }

  function setValue(uint256 _value) public onlyOwner {
    storedValue = _value;
    emit ValueUpdated(_value);
  }

  function getValue() public view returns (uint256) {
    return storedValue;
  }

  function setMessage(string memory _message) public onlyOwner {
    message = _message;
    emit MessageUpdated(_message);
  }

  function getMessage() public view returns (string memory) {
    return message;
  }

  function changeOwner(address newOwner) public onlyOwner {
    require(newOwner != address(0), "Invalid address");
    address oldOwner = owner;
    owner = newOwner;
    emit OwnerSet(oldOwner, newOwner);
  }
}