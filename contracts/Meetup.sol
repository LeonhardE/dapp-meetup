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
    string location;
    uint price;
  }

  struct withdraw {
    address payable useraddress;
    uint amount;
    bool success;
    bool cancel;
  }

  address payable public owner;
  mapping(address => uint) public Tokens;
  mapping(address => string[]) public UserPrize;
  mapping(uint => prize) public PrizeList;
  mapping(uint => withdraw) public WithdrawList;
  uint prizecount;
  uint withdrawcount;

  constructor() payable {
    owner = payable(msg.sender);
    prizecount = 2;
    withdrawcount = 0;
    prize memory newprize;
    newprize.name = "iPhone 13 Pro";
    newprize.price = 20;
    newprize.location = "prizephoto/prize0.jpeg";
    PrizeList[0] = newprize;
    prize memory newprize1;
    newprize1.name = "Macbook Pro";
    newprize1.price = 50;
    newprize1.location = "prizephoto/prize1.jpeg";
    PrizeList[1] = newprize1;
  }

  // get contract owner
  function getowner() public view returns(address){
    return owner;
  }

  // buy token from a different account than the contract owner
  function buyTokens(uint amount) external payable returns(bool) {
    // 1 ETH = 100 Tokens
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

  // get withdraw count
  function getWithdrawCount() public view returns(uint) {
    return withdrawcount;
  }

  // get withdraw request
  function getWithdrawRequest(uint id) public view returns(withdraw memory) {
    return WithdrawList[id];
  }

  // withdraw tokens request
  function withdrawRequest(uint amount) external returns(uint) {
    require(msg.sender != owner, "Contract owner cannot request withdraw");
    require(Tokens[msg.sender] >= amount, "Token not enough");
    WithdrawList[withdrawcount].useraddress = payable(msg.sender);
    WithdrawList[withdrawcount].amount = amount;
    WithdrawList[withdrawcount].success = false;
    WithdrawList[withdrawcount].cancel = false;
    uint withdrawid = withdrawcount;
    withdrawcount = withdrawid + 1;
    return withdrawid;
  }

  // cancel withdraw request
  function cancelWithdraw(uint id) external returns(bool) {
    require(msg.sender == WithdrawList[id].useraddress, "Cannot cancel other user's withdraw request");
    require(WithdrawList[id].success == false, "Cannot cancel a successful withdraw");
    require(WithdrawList[id].cancel == false, "Cannot double cancel a withdraw request");
    WithdrawList[id].cancel = true;
    return true;
  }

  // withdraw tokens confirmation by owner
  function withdrawConfirm(uint id) public payable returns(bool) {
    address payable useraddress = WithdrawList[id].useraddress;
    uint amount = WithdrawList[id].amount;
    require(Tokens[useraddress] >= amount, "Token not enough");
    require(msg.sender == owner, "Only owner can confirm withdraw");
    require(WithdrawList[id].cancel == false, "Cannot confirm a canceled request");
    require(WithdrawList[id].success == false, "Cannot double confirm a withdraw request");
    // 125 Tokens = 1 ETH
    uint withdrawamount = amount * 8e15;
    require(msg.value >= withdrawamount, "Ether not enough");
    (bool success, ) = useraddress.call{value: withdrawamount}("");
    require(success, "Failed to send Ether");
    if (success) {
      uint origin_amount = Tokens[useraddress];
      Tokens[useraddress] = origin_amount - amount;
      WithdrawList[id].success = success;
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

  // get prize count
  function getPrizeCount() public view returns(uint) {
    return prizecount;
  }

  // add a prize by owner only
  function addPrize(string memory name, string memory location, uint price) public returns(bool) {
    require(msg.sender == owner, "Only owner can add a prize");
    prize memory newprize;
    newprize.name = name;
    newprize.location = location;
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
