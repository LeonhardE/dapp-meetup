// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Meetup {
  
  // struct userevent {
  //   address owner;
  //   address[] participant;
  //   uint deadline;
  //   string location;
  //   string description;
  //   uint cost_owner;
  //   uint[] cost_participant;
  // }

  struct prize {
    string name;
    uint price;
  }

  address payable public owner;
  mapping(address => uint) public Tokens;
  mapping(address => string[]) public UserPrize;
  mapping(uint => prize) public PrizeList;
  uint prizecount;

  constructor() payable {
    owner = payable(msg.sender);
    prizecount = 1;
    prize memory newprize;
    newprize.name = "iphone";
    newprize.price = 10;
    PrizeList[0] = newprize;
  }

  // get contract owner
  function getowner() public view returns(address){
    return owner;
  }

  // buy token from a different account than the contract owner
  function buyTokens(uint amount) external payable returns(bool) {
    // unfinished: pay ETH
    uint tokenprice = amount * 1e16;
    require(msg.sender != owner, "Contract owner cannot buy tokens");
    require(msg.value >= tokenprice, "Ether not enough");
    if (msg.sender == owner) {
      return false;
    }
    (bool success, ) = owner.call{value: tokenprice}("");
    require(success, "Failed to send Ether");
    if (success) {
      uint origin_amount = Tokens[msg.sender];
      Tokens[msg.sender] = origin_amount + amount;
    }
    return success;
  }

  // get the token amount of an address
  function getTokenAmount(address useraddress) public view returns(uint) {
    return Tokens[useraddress];
  }

  // use tokens to buy a prize
  function buyPrize(uint prizeid) external returns(bool) {
    require(msg.sender != owner, "Contract owner cannot buy prize");
    if (Tokens[msg.sender] < PrizeList[prizeid].price) {
      return false;
    }
    uint origin_amount = Tokens[msg.sender];
    Tokens[msg.sender] = origin_amount - PrizeList[prizeid].price;
    UserPrize[msg.sender].push(PrizeList[prizeid].name);
    return true;
  }

  // get the prizes a user obtains
  function getUserPrize(address useraddress) public view returns(string[] memory) {
    return UserPrize[useraddress];
  }

  // get prize info according to id
  function getPrizeInfo(uint id) public view returns(prize memory) {
    return PrizeList[id];
  }

  // add a prize by owner only
  function addPrize(string memory name, uint price) public returns(bool) {
    require(msg.sender == owner, "Only owner can add a prize");
    prize memory newprize;
    newprize.name = name;
    newprize.price = price;
    PrizeList[prizecount] = newprize;
    prizecount = prizecount + 1;
    return true;
  }

  // delete a prize by owner only
  function deletePrize(uint prizeid) public returns(bool) {
    require(msg.sender == owner, "Only owner can delete a prize");
    if (prizeid >= prizecount) {
      return false;
    }
    for (uint i = prizeid; i < prizecount - 1; i++) {
      PrizeList[i] = PrizeList[i + 1];
    }
    prizecount = prizecount - 1;
    return true;
  }
}
