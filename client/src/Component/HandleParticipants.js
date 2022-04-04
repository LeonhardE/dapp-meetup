import * as React from 'react';

import Title from './Title';
import { Component } from "react";
import MeetupContract from "../contracts/Meetup.json";
import getWeb3 from "../getWeb3";


class HandleParticipants extends Component {
  state = { owner: null, Token: 0, web3: null, accounts: null, contract: null, posts: [], joinedPosts: []};

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

      // fetch post
      const post = await instance.methods.getPost(this.props.id).call()
      this.setState({ post:post })
      
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

  checkHost = () => {
    var answer = window.confirm("Confirm participation?");
    if (answer) {
      this.state.contract.methods.confirmHost(this.state.post.id).send({from: this.state.accounts[0]});
    }
  }

  checkParticipant = (addr) => {
    var answer = window.confirm("Confirm participation?");
    if (answer) {
      this.state.contract.methods.confirmParticipant(this.state.post.id, this.state.post.participants.indexOf(addr)).send({from: this.state.accounts[0]});
    }
    else {
      return;
    }
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    let post = this.state.post
    if (!post) {
      return <div>No post found</div>;
    }
    if (this.state.accounts[0] !== post.author) {
      return <div>Permission Denied</div>;
    }
    console.log(post);
    let participants = post.participants;
    let parConfirmed = post.parConfirmed;
    return (
      <React.Fragment>
        <Title>All participants: </Title>
        <ItemCount count = {participants.length} />
        <h3>Event ID={this.props.id}</h3>
        <Item message={"Host: " + post.author} handleClick={this.checkHost} confirmed={post.hostConfirmed} />
        {
          participants.map((user, i) =>
            <Item message={user} handleClick={this.checkParticipant} confirmed={parConfirmed[i]}/>)
        }

        <br />
        <br />
        <br />
        <hr />


      </React.Fragment>
      
    );
  }
}

export default HandleParticipants


class Item extends React.Component {
  constructor (props){
    super ();

    this.state = {
      checked: props.confirmed
    };

    this.handleClick = props.handleClick;    
  }
  // handleClick (e){
  //   this.setState({
  //     checked: !this.state.checked
  //   });

  // }
  render (){
    let text = this.state.checked ? <strike>{this.props.message}</strike> : this.props.message;
    return (
        <div className="row">
          <div className="col-md-12">
            <input type="checkbox" onClick={(event) => {
                if(!this.state.checked) {
                  this.setState({checked:true});
                  event.preventDefault()
                const address = this.props.message
                this.props.handleClick(address)
                }
                
              }} />&nbsp;{text}
            <hr />
          </div>
        </div>
    );
  }
}


class ItemCount extends React.Component {
  constructor (props){
    super ();
  }
  render (){
    return (
      <h4>There are {this.props.count} participants in this event.</h4>
    );
  }
}

