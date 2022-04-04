import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LinkUI from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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
      for (var i = 0; i < this.state.posts.length; i++) {
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

  handleJoin = async (event) => {
    event.preventDefault();
    console.log("printing posts:")
      for (var i = 0; i < this.state.posts.length; i++) {
          console.log(this.state.posts[i])
        }
    const {owner, accounts, contract, Token} = this.state;
    let id = event.target[0].value;
    console.log("handleJoin:indexOfAllPosts=",id);
    if (accounts[0] === this.state.posts[id].author) {
      alert("Cannot join your own event.");
    }
    // else if (Number(Token) < Number(price)) {
    //   alert("You don't have enough Tokens.")
    // }
    else {
      const eventID = this.state.posts[id].id;
      const allowed = await contract.methods.checkJoinEventAbility(eventID, accounts[0]).call();
      if (allowed.toString() === "true") {
        var answer = window.confirm("Spend 5 tokens and join this event?");
        if (answer) {
          contract.methods.joinEvent(eventID).send({from: accounts[0]});
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
      return <div>No events yet</div>;
    }

    return (
      <React.Fragment>
        <Title>Join events and get rewards!</Title>

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

