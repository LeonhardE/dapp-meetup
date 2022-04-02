import React, { Component } from "react";
import MeetupContract from "../contracts/Meetup.json";
import getWeb3 from "../getWeb3";
import Title from './Title';

class Tokenbuy extends Component {
  state = { owner: null, Token: 0, web3: null, accounts: null, contract: null, prizelist: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MeetupContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MeetupContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.initiate);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  initiate = async () => {
    const { accounts, contract } = this.state;

    // Get the value from the contract to prove it worked.
    const tokenamount = await contract.methods.getTokenAmount(accounts[0]).call();
    const contractowner = await contract.methods.getowner().call();
    

    // Update state with the result.
    this.setState({ Token: tokenamount, owner: contractowner });

  };

  handleBuyToken = async (event) => {
    const {owner, accounts, contract, Token} = this.state;
    let amount = event.target[0].value;
    if (accounts[0] === owner) {
      alert("Owner cannot buy tokens");
    }
    else {
      let etherprice = Number(amount) * 1e16;
      const response = contract.methods.buyTokens(amount).send({from: accounts[0], value: etherprice});
      alert("The tokens you are going to buy: " + amount);
      let newtoken = Number(Token) + Number(amount);
      this.setState({Token: newtoken});
      console.log(response)
    }
    event.preventDefault();
  }

  handleWithdraw = async (event) => {
    const {owner, accounts, contract, Token} = this.state;
    let amount = event.target[0].value;
    if (accounts[0] === owner) {
      alert("Owner cannot request withdraw");
    }
    else if(Token < amount) {
      alert("Your token is not enough");
    }
    else {
      const response = contract.methods.withdrawRequest(amount).send({from: accounts[0]});
      alert("The tokens you have requested to withdraw: " + amount);
      console.log(response)
    }
    event.preventDefault();
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <React.Fragment>
        <Title>Buy Token</Title>
        <div>Owner: {this.state.owner}</div>
        <div>Account: {this.state.accounts[0]}</div>
        <div>Token Amount: {this.state.Token}</div>
        <div>Buy Token (1 ETH = 100 Tokens):
          <form onSubmit={this.handleBuyToken}>
            <input type="text" name="amount" />
            <input type="submit" value="Submit" />
          </form> 
        </div>
        <div>Withdraw ETH (125 Tokens = 1 ETH):
          <form onSubmit={this.handleWithdraw}>
            <input type="text" name="amount" />
            <input type="submit" value="Submit" />
          </form> 
        </div>
      </React.Fragment>
      
    );
  }
}

export default Tokenbuy
