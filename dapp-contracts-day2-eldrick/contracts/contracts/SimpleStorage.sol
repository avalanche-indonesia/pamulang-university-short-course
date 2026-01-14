// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract SimpleStorage {
    uint256 private storedValue;

    event ValueUpdated(uint256 newValue);

    function setValue(uint256 _value) public {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    function getValue() public view returns (uint256) {
        return storedValue;
    }
}
