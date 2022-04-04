import React, { Component } from "react";
import MeetupContract from "../contracts/Meetup.json";
import getWeb3 from "../getWeb3";
import Title from './Title';
import UploadImage from './UploadImage'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


class HandleCreate extends Component {
  state = { owner: null, Token: 0, web3: null, accounts: null, contract: null};

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


  // handle image upload
  // preprocess the image before uploading to ipfs
  captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result)})
      console.log('buffer', this.state.buffer)
    }
  }

  uploadImage = (title, description, time, location, maxNum) => {
    if (this.state.accounts[0] === this.state.owner) {
      alert("Owner cannot create events");
    }
    else if (Number(this.state.Token) < 10) {
      alert("You don't have enough tokens to create an event");
    }
    else {
      let newtoken = Number(this.state.Token) - 10;
      console.log("Submitting file to ipfs... title=", title, "description=", description, "maxNum=", maxNum)
      console.log(ipfs)
      //adding file to the IPFS
      ipfs.add(this.state.buffer, (error, result) => {
        console.log('Success! Ipfs result', result)
        if(error) {
          console.error('error!!!!,', error)
          return
        }
        this.setState({ loading: true })
        this.state.contract.methods.uploadPost(result[0].hash, title, description, time, location, maxNum).send({ from: this.state.accounts[0] }).on('transactionHash', (hash) => {
        this.setState({ loading: false, Token: newtoken })
        
        })
      })
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <React.Fragment>
        <Title>Create new events here!</Title>
        <div>Owner: {this.state.owner}</div>
        <div>Account: {this.state.accounts[0]}</div>
        <div>Token Amount: {this.state.Token}</div>
        <UploadImage
              images={this.state.images}
              captureFile={this.captureFile}
              uploadImage={this.uploadImage}
              />
      </React.Fragment>
      
    );
  }
}

export default HandleCreate
