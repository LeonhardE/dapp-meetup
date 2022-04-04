import React, { Component } from "react";
import MeetupContract from "../contracts/Meetup.json";
import getWeb3 from "../getWeb3";
import Title from './Title';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from '@mui/material';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

class Tokenshop extends Component {
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
    const prizecount = await contract.methods.getPrizeCount().call();
    
    var prizelist = []
    for (let i = 0; i < prizecount; i++) {
      let prize = await contract.methods.getPrizeInfo(i).call();
      prizelist.push([prize, i]);
    }
    // Update state with the result.
    this.setState({ Token: tokenamount, owner: contractowner, list: prizelist, count: prizecount });

  };

  handleBuy = async (event) => {
    const {owner, accounts, contract, Token} = this.state;
    let id = event.target[0].value;
    let price = event.target[1].value;
    if (accounts[0] === owner) {
      alert("Owner cannot buy items.");
    }
    else if (Number(Token) < Number(price)) {
      alert("You don't have enough Tokens.")
    }
    else {
      const response = contract.methods.buyPrize(id).send({from: accounts[0]});
      alert("Purchase Successful!");
      let newtoken = Number(Token) - Number(price);
      this.setState({Token: newtoken});
      console.log(response)
    }
    event.preventDefault();
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    let prizelist = this.state.list
    if (prizelist.length === 0) {
      return <div>Loading Prize info</div>;
    }
    return (
      <React.Fragment>
        <Title>Token Shop</Title>
        <div>Owner: {this.state.owner}</div>
        <div>Account: {this.state.accounts[0]}</div>
        <div>Token Amount: {this.state.Token}</div>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {prizelist.map((prize) => (
              <Grid key={prize[1]} item xs={6} >
                <Card sx={{ 
                                          width: 345,
                                          display: 'flex',
                                          flexDirection: 'column'
                                        }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={prize[0].location}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {prize[0].name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Price: {prize[0].price} Tokens
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <form onSubmit={this.handleBuy}>
                      <input type="hidden" name="id" value={prize[1]} />
                      <input type="hidden" name="price" value={prize[0].price} />
                      <input type="submit" value="Buy" />
                    </form>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        
        
      </React.Fragment>
      
      
    );
  }
}

export default Tokenshop
