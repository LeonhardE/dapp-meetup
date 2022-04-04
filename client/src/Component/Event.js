import * as React from 'react';

import Title from './Title';
import { Component } from "react";
import MeetupContract from "../contracts/Meetup.json";
import getWeb3 from "../getWeb3";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from '@mui/material';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';


class Event extends Component {
  state = { owner: null, Token: 0, web3: null, accounts: null, contract: null, posts: []};

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

      const postCount = await instance.methods.postCount().call()
      this.setState({ postCount:postCount })
      // Load images
      for (var i = 1; i <= postCount; i++) {
        const post = await instance.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }
      console.log("printing posts:")
      for (let i = 0; i < this.state.posts.length; i++) {
          console.log(this.state.posts[i])
        }
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

  handleJoin = async (event) => {
    event.preventDefault();
    console.log("printing posts:")
      for (var i = 0; i < this.state.posts.length; i++) {
          console.log(this.state.posts[i])
        }
    const {owner, accounts, contract, Token} = this.state;
    let id = event.target[0].value;
    let price = 5;
    console.log("handleJoin:indexOfAllPosts=",id);
    if (accounts[0] === owner) {
      alert("Contract owner cannot join events.")
    }
    else if (accounts[0] === this.state.posts[id].author) {
      alert("Cannot join your own event.");
    }
    else if (Number(Token) < Number(price)) {
      alert("You don't have enough Tokens.")
    }
    else {
      const eventID = this.state.posts[id].id;
      const allowed = await contract.methods.checkJoinEventAbility(eventID, accounts[0]).call();
      if (allowed.toString() === "true") {
        var answer = window.confirm("Spend 5 tokens and join this event?");
        if (answer) {
          let newtoken = Number(Token) - Number(price)
          contract.methods.joinEvent(eventID).send({from: accounts[0]});
          this.setState({Token: newtoken})
        }
        else {
          return;
        }
              
      } else {
        alert('Cannot join this event.');
      }
    }
    event.preventDefault();
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    let posts = this.state.posts
    if (posts.length === 0) {
      return (
        <React.Fragment>
          <div>Owner: {this.state.owner}</div>
          <div>Account: {this.state.accounts[0]}</div>
          <div>Token Amount: {this.state.Token}</div>
          <div>No events yet</div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Title>Join events and get rewards!</Title>
        <div>Owner: {this.state.owner}</div>
        <div>Account: {this.state.accounts[0]}</div>
        <div>Token Amount: {this.state.Token}</div>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid key={post.id} item xs={6} >
                <Card sx={{ 
                                          width: 345,
                                          display: 'flex',
                                          flexDirection: 'column'
                                        }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={"https://ipfs.infura.io/ipfs/"+post.hash}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {post.title?post.title:"title"}
                      </Typography> 
                      <Typography variant="body2" color="text.secondary">
                        Time: {post.time?post.time:"time"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Location: {post.location?post.location:"location"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {post.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <form onSubmit={this.handleJoin}>
                      <input type="hidden" name="id" value={posts.indexOf(post)} />
                      <input type="submit" value="Join" />
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

export default Event

