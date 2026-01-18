// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    // saya ingin menyimpan sebuah nilai dalam bentuk uint256
    uint256 private storedValue;

    // ketika ada update saya akan track perubahannya
    event ValueUpdated(uint256 newValue);

    // simpan nilai ke blockchain (write)
    function setValue(uint256 _value) public {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    // membaca nilai dari blockchain (read) terakhir kali di update
    function getValue() public view returns (uint256) {
        return storedValue;
    }
}
