import React, { Component } from "react";
import MeetupContract from "../contracts/Meetup.json";
import getWeb3 from "../getWeb3";
import Title from './Title';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

class Withdrawinfo extends Component {
  state = { owner: null, Token: 0, web3: null, accounts: null, contract: null, list: [], count: 0 };

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
    const withdrawcount = await contract.methods.getWithdrawCount().call();
    console.log(withdrawcount)
    var withdrawlist = []
    for (let i = 0; i < withdrawcount; i++) {
      let withdraw = await contract.methods.getWithdrawRequest(i).call();
      withdrawlist.push([withdraw, i]);
    }
    // Update state with the result.
    this.setState({ Token: tokenamount, owner: contractowner, list: withdrawlist, count: withdrawcount });

  };

  handleConfirm = async (event) => {
    const {owner, accounts, contract} = this.state;
    let id = event.target[0].value;
    let amount = event.target[1].value;
    let success = event.target[2].value;
    let cancel = event.target[3].value;
    if (accounts[0] !== owner) {
      alert("Only contract owner can confirm withdraw request.");
    }
    else if (success.toString() === "true") {
      alert("Cannot double confirm a withdraw request.");
    }
    else if (cancel.toString() === "true") {
      alert("Cannot confirm a canceled request.")
    }
    else {
      let etherprice = Number(amount) * 8e15;
      const response = contract.methods.withdrawConfirm(id).send({from: accounts[0], value: etherprice});
      alert("Withdraw Confirmed");
      console.log(response)
    }
    event.preventDefault();
  }

  handleCancel = async (event) => {
    const {accounts, contract} = this.state;
    let id = event.target[0].value;
    let useraddress = event.target[1].value;
    let success = event.target[2].value;
    let cancel = event.target[3].value;
    if (accounts[0] !== useraddress) {
      alert("Cannot cancel other user's withdraw request");
    }
    else if (success.toString() === "true") {
      alert("Cannot cancel a successful confirmed request.");
    }
    else if (cancel.toString() === "true") {
      alert("Cannot double cancel a withdraw request.")
    }
    else {
      const response = contract.methods.cancelWithdraw(id).send({from: accounts[0]});
      alert("Withdraw Canceled");
      console.log(response)
    }
    event.preventDefault();
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    let withdrawlist = this.state.list
    if (withdrawlist.length === 0 && this.state.count > 0) {
      return <div>Loading Withdraw info</div>;
    }
    return (
      <React.Fragment>
        <Title>Withdraw Request</Title>
        <div>Owner: {this.state.owner}</div>
        <div>Account: {this.state.accounts[0]}</div>
        {withdrawlist.map((withdraw) => (
          <Card key={withdraw[1]} sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                ID: {withdraw[1]}
              </Typography>
              <Typography variant="h5" component="div">
                Withdraw Request
              </Typography>
              <Typography variant="body2">
                From: {withdraw[0].useraddress}
                <br />
                Amount: {withdraw[0].amount}
                <br />
                Success: {withdraw[0].success.toString()}
                <br />
                Canceled: {withdraw[0].cancel.toString()}
              </Typography>
            </CardContent>
            <CardActions>
              <form onSubmit={this.handleConfirm}>
                <input type="hidden" name="id" value={withdraw[1]} />
                <input type="hidden" name="amount" value={withdraw[0].amount} />
                <input type="hidden" name="success" value={withdraw[0].success} />
                <input type="hidden" name="cancel" value={withdraw[0].cancel} />
                <input type="submit" value="Confirm" />
              </form>
              <form onSubmit={this.handleCancel}>
                <input type="hidden" name="id" value={withdraw[1]} />
                <input type="hidden" name="address" value={withdraw[0].useraddress} />
                <input type="hidden" name="success" value={withdraw[0].success} />
                <input type="hidden" name="cancel" value={withdraw[0].cancel} />
                <input type="submit" value="Cancel" />
              </form>
            </CardActions>
          </Card>
        ))}
        
      </React.Fragment>
      
      
    );
  }
}

export default Withdrawinfo
