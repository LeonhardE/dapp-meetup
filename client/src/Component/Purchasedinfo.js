import React, { Component } from "react";
import MeetupContract from "../contracts/Meetup.json";
import getWeb3 from "../getWeb3";
import Title from './Title';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

class Purchasedinfo extends Component {
  state = { owner: null, Token: 0, web3: null, accounts: null, contract: null, list: [] };

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
    const userprizes = await contract.methods.getUserPrize(accounts[0]).call();
    let userprizelist = []
    for (let i = 0; i < userprizes.length; i++) {
      userprizelist.push([userprizes[i], i])
    }
    console.log(userprizelist.length)
    // Update state with the result.
    this.setState({ Token: tokenamount, owner: contractowner, list: userprizelist });

  };

  

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    let userprizelist = this.state.list
    if (userprizelist.length === 0 && this.state.count > 0) {
      return <div>Loading Purchased info</div>;
    }
    return (
      <React.Fragment>
        <Title>Purchased Items</Title>
        <div>Owner: {this.state.owner}</div>
        <div>Account: {this.state.accounts[0]}</div>
        <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Purchased Item Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userprizelist.map((userprize) => (
            <TableRow key={userprize[1]}>
              <TableCell>{userprize[1]}</TableCell>
              <TableCell>{userprize[0]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
        
      </React.Fragment>
      
      
    );
  }
}

export default Purchasedinfo
