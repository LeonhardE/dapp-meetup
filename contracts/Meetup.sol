// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;


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
  string public AppName = "Decentralized Meetup";
  // Store posts
  uint public postCount = 0;
  mapping(uint => Post) public posts;
  mapping(address => uint[]) public joinedEvents;
  mapping(address => uint[]) public ownedEvents;

  // get total amount of posts
  function getPostAmount() public view returns(uint) {
    return postCount;
  }

  // get post at eventID
  function getPost(uint _id) public view returns(Post memory) {
    return posts[_id];
  }

  // get posts joined by the addr
  function getJoinedEvents(address addr) public view returns(uint[] memory) {
    return joinedEvents[addr];
  }

  // get posts created by the addr
  function getOwnedEvents(address addr) public view returns(uint[] memory) {
    return ownedEvents[addr];
  }

  struct Post {
    uint id;
    string hash;
    string title;
    string description;
    string time;
    string location;
    uint maxNum;
    address[] participants;
    bool[] parConfirmed;
    uint tipAmount;
    address payable author;
  }

  event PostCreated(
    uint id,
    string hash,
    string title,
    string description,
    string time,
    string location,
    uint maxNum,
    address[] participants,
    uint tipAmount,
    address payable author
  );

  event PostTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  event EventJoined(
    uint id,
    string hash,
    string title,
    string description,
    string time,
    string location,
    uint maxNum,
    address[] participants,
    address payable author
  );

  event FireEvent(
    uint id,
    string hash,
    bool hasJoined
  );

  // Create posts
  function uploadPost(string memory _postHash, string memory _title, string memory _desc, string memory _time, string memory _location, uint _maxNum) public {
    require(bytes(_postHash).length > 0, 'Imagehash cannot be empty');
    require(bytes(_title).length > 0, 'Post title cannot be empty');
    require(bytes(_desc).length > 0, 'Post description cannot be empty');
    require(msg.sender != address(0x0), 'Empty author');

    postCount ++;
    address[] memory _participants;
    bool[] memory _parConfirmed;
    posts[postCount] = Post(postCount, _postHash, _title, _desc, _time, _location, _maxNum, _participants, _parConfirmed, 0, payable(msg.sender));
    emit PostCreated(postCount, _postHash, _title, _desc, _time, _location, _maxNum, _participants, 0, payable(msg.sender));
    Tokens[msg.sender] = Tokens[msg.sender] - 10;
    ownedEvents[msg.sender].push(postCount);
  }

  // Tip author
  function tipAuthor(uint _id) public payable {
    require(_id > 0 && _id <= postCount);
    // fetch post
    Post memory _post = posts[_id];
    address payable _author = _post.author;
    _author.transfer(msg.value);
    _post.tipAmount += msg.value;
    posts[_id] = _post;
  }

  // Join event
  function checkJoinEventAbility(uint _id, address sender) public view returns(bool) {
    require(_id > 0 && _id <= postCount, 'invalid event id');
    require(sender != address(0x0), 'Empty participant');

    // check exceeding max participants
    if (posts[_id].participants.length >= posts[_id].maxNum) {
      return false;
    }
    // check if already joined
    bool hasJoined = false;
    for (uint i = 0; i < joinedEvents[sender].length; i++) {

      if (_id == joinedEvents[sender][i]) {
        hasJoined = true;
      }
    }
    if (hasJoined) {
      return false;
    }    
    return true;
  }

  function joinEvent(uint _id) public {
    posts[_id].participants.push(msg.sender);
    posts[_id].parConfirmed.push(false);
    joinedEvents[msg.sender].push(_id);
    Tokens[msg.sender] = Tokens[msg.sender] - 5;
  }

  function confirmParticipant(uint _id, uint _parIndex) public {
    posts[_id].parConfirmed[_parIndex] = true;
    Tokens[posts[_id].participants[_parIndex]] = Tokens[posts[_id].participants[_parIndex]] + 6;
  }

  //

  // Quit event

  // Confirm attendance


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
    prizecount = 6;
    withdrawcount = 0;
    prize memory newprize0;
    newprize0.name = "Kindle";
    newprize0.price = 5;
    newprize0.location = "prizephoto/prize0.jpeg";
    PrizeList[0] = newprize0;
    prize memory newprize1;
    newprize1.name = "Nike Air Force";
    newprize1.price = 8;
    newprize1.location = "prizephoto/prize1.jpeg";
    PrizeList[1] = newprize1;
    prize memory newprize2;
    newprize2.name = "Airpods Pro";
    newprize2.price = 10;
    newprize2.location = "prizephoto/prize2.jpeg";
    PrizeList[2] = newprize2;
    prize memory newprize3;
    newprize3.name = "iPhone 13";
    newprize3.price = 20;
    newprize3.location = "prizephoto/prize3.jpeg";
    PrizeList[3] = newprize3;
    prize memory newprize4;
    newprize4.name = "iPad Pro";
    newprize4.price = 25;
    newprize4.location = "prizephoto/prize4.jpeg";
    PrizeList[4] = newprize4;
    prize memory newprize5;
    newprize5.name = "Macbook Pro";
    newprize5.price = 50;
    newprize5.location = "prizephoto/prize5.jpeg";
    PrizeList[5] = newprize5;
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
