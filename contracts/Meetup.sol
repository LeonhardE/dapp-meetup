// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

contract Meetup {
  // user's Token
  struct Token {
    address owner;
    uint amount;
  }
  // user's prize
  struct Prize {
    address owner;
    uint[10] list;
  }

  address owner;

  uint storagedata;
  Token[] public tokenlist;
  Prize[] public userprize;
  // the price of prize
  uint[10] private prizelist;

  constructor() public {
    owner = msg.sender;
    for (uint i = 0; i < 10; i++) {
      prizelist[i] = 2;
    }
    Token memory newaccount;
    newaccount.amount = 0;
    newaccount.owner = address(0x0);
    tokenlist.push(newaccount);
  }

  function set(uint x) public {
    storagedata = x;
  }

  function get() public view returns(uint) {
    return storagedata;
  }

  function getowner() public view returns(address){
    return owner;
  }

  // check if one address have token
  function HaveToken(address useraddress) private view returns(bool) {
    bool exist = false;
    for (uint i = 0; i < tokenlist.length; i++) {
      if (tokenlist[i].owner == useraddress) {
        exist = true;
        break;
      }
    }
    return exist;
  }

  // add token to an address
  function addToken(address useraddress, uint fund) public {
    for (uint i = 0; i < tokenlist.length; i++) {
      if (tokenlist[i].owner == useraddress) {
        tokenlist[i].amount += fund;
        break;
      }
    }
  }

  // buy token from a different account than the contract owner
  function buyTokens(uint amount) public {
    // unfinished: pay ETH
    addToken(msg.sender, amount);
  }

  function getTokenAmount(address useraddress) public returns (uint) {
    if (!HaveToken(useraddress)) {
      Token memory newaccount;
      newaccount.owner = useraddress;
      newaccount.amount = 10;
      tokenlist.push(newaccount);
    }
    prizelist[0] = 10;
    uint amount = 0;
    for (uint i = 0; i < tokenlist.length; i++) {
      if (tokenlist[i].owner == useraddress) {
        amount = tokenlist[i].amount;
        break;
      }
    }
    return amount;
  }
}
