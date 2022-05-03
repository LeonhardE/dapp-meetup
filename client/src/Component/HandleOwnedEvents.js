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


class HandleOwnedEvents extends Component {
  state = { owner: null, Token: 0, web3: null, accounts: null, contract: null, posts: [], ownedPosts: []};

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

      // fetch all posts
      const postCount = await instance.methods.postCount().call()
      this.setState({ postCount:postCount })
      // Load images
      for (let i = 1; i <= postCount; i++) {
        const post = await instance.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }
      console.log("printing posts:")
      for (let i = 0; i < this.state.posts.length; i++) {
          console.log(this.state.posts[i])
        }

      // const postCount = await instance.methods.postCount().call()
      const ownedPosts = await instance.methods.getOwnedEvents(accounts[0]).call()
      this.setState({ ownedPosts:ownedPosts })
      console.log("owned posts length:", ownedPosts.length)
      console.log("ownedposts:", ownedPosts)
      console.log("printing owned posts:")
      for (let i = 0; i < this.state.ownedPosts.length; i++) {
          console.log(this.state.ownedPosts[i])
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

  handleDelete = async (event) => {
    event.preventDefault();
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    let posts = this.state.posts
    let ownedPosts = this.state.ownedPosts
    if (ownedPosts.length === 0) {
      return (
        <React.Fragment>
          <div>Owner: {this.state.owner}</div>
          <div>Account: {this.state.accounts[0]}</div>
          <div>Token Amount: {this.state.Token}</div>
          <div>No created events yet</div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Title>Created Events </Title>
        <div>Owner: {this.state.owner}</div>
        <div>Account: {this.state.accounts[0]}</div>
        <div>Token Amount: {this.state.Token}</div>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {ownedPosts.map((eventID) => (
              <Grid item xs={6} >
                <Card key={eventID} sx={{ 
                                          width: 345,
                                          display: 'flex',
                                          flexDirection: 'column'
                                        }}>
                  <CardActionArea href={"/details/"+eventID}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={"https://ipfs.infura.io/ipfs/"+posts[eventID-1].hash}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {posts[eventID-1].title?posts[eventID-1].title:"title"}
                      </Typography> 
                      <Typography variant="body2" color="text.secondary">
                        Time: {posts[eventID-1].time?posts[eventID-1].time:"time"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Location: {posts[eventID-1].location?posts[eventID-1].location:"location"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {posts[eventID-1].description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    {/* <form onSubmit={this.handleDelete}>
                      <input type="hidden" name="id" value={eventID} />
                      <input type="submit" value="Delete" />
                    </form> */}
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

export default HandleOwnedEvents

