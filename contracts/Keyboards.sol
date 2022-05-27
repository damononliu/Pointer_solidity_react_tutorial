// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract Keyboards {

  enum KeyboardKind { 
	  SixtyPercent, 
	  SeventyFivePercent,
    EightyPercent, 
	  Iso105 
	}

  struct Keyboard {
    KeyboardKind kind; 
    // ABS = false, PBT = true
    bool isPBT;
    // tailwind filters to layer over
    string filter;
    address owner;
}

  event KeyboardCreated (
    Keyboard keyboard
  );

  event tipSent (
    address recepient,
    uint amount
  );

  Keyboard[] public createdKeyboards;

  function getKeyboards() view public returns(Keyboard[] memory) {
    return createdKeyboards;
  }

  function create(
    KeyboardKind _kind,
    bool _isPBT,
    string calldata _filter) external {
      Keyboard memory newKeyboard = Keyboard({
        kind: _kind,
        isPBT: _isPBT,
        filter: _filter,
        owner: msg.sender
      });
    createdKeyboards.push(newKeyboard);
    emit KeyboardCreated(newKeyboard);
  }

  function tip(uint _index) payable external {
    address payable owner = payable(createdKeyboards[_index].owner);
    owner.transfer(msg.value);
    emit tipSent(owner, msg.value);
  }

}