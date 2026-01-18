// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract SimpleStorage {
    // menyimpan nilai dalam bentuk uint256
    uint256 private storedValue;
    //tracking saat update nilai
    event ValueUpdated(uint256 newValue);

    // menyimpan nilai ke blockchain (Write)
    function setValue(uint256 _value) public {
        storedValue = _value;
        emit ValueUpdated(_value);
    }
    //baca nilai dari blockchain (Read) terakhir kali di update
    function getValue() public view returns (uint256) {
        return storedValue;
    }

    

     // owner dan access control
    address public owner;

    event OwnerSet(address indexed oldOwner, address indexed newOwner);

    // state tambahan (misal: message)
    string public message;

    // constructor untuk set owner dan emit OwnerSet
    constructor() {
        owner = msg.sender;
        emit OwnerSet(address(0), owner);
    }

    // modifier onlyOwner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // override setValue untuk akses kontrol
    function setValueWithOwner(uint256 _value) public onlyOwner {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    // fungsi tambahan untuk update message
    function setMessage(string calldata _message) public onlyOwner {
        message = _message;
    }
}