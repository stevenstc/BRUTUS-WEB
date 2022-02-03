import React, { Component } from "react";

import Inicio from "../Inicio";
import HomeBaner from "../HomeBaner";
import Home from "../Home";
import StakingBaner from "../StakingBaner";
import Staking from "../Staking";
import NftBaner from "../nftBaner";
import Nft from "../nft";
import TronLinkGuide from "../TronLinkGuide";


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      
      tronWeb: {
        address: "Cargando...",
        installed: false,
        loggedIn: false,
        web3: null
      }
    };

    this.conectar = this.conectar.bind(this);
  }

  async componentDidMount() {
    
    setInterval(async() => {
      await this.conectar();
    }, 7*1000);
      
  }

  async conectar(){

    if (typeof window.tronLink !== 'undefined' && typeof window.tronWeb !== 'undefined' ) { 

      var tronWeb = this.state.tronWeb;

      tronWeb['installed'] = true;
      tronWeb['web3'] = window.tronWeb;

      this.setState({

        tronWeb: tronWeb
    
      });

      window.tronLink.request({method: 'tron_requestAccounts'})
        .then(()=>{

          tronWeb['installed'] = true;
          tronWeb['loggedIn'] = true;
        
          this.setState({

            tronWeb: tronWeb
        
          });
        })
        .catch(()=>{

          tronWeb['installed'] = false;
          tronWeb['loggedIn'] = false;

          this.setState({

            tronWeb: tronWeb
        
          });

        })



      
    }
  }

  render() {


    var getString = "";
    var loc = document.location.href;
    //console.log(loc);
    if(loc.indexOf('?')>0){
              
      getString = loc.split('?')[1];
      getString = getString.split('#')[0];

    }

    switch (getString) {
      case "staking": 
      case "brst":
      case "BRST": 
        if (!this.state.tronWeb.installed) return (
          <>
            <StakingBaner/>
            <div className="container">
              <TronLinkGuide  url={"/?"+getString}/>
            </div>
          </>
          );
    
        if (!this.state.tronWeb.loggedIn) return (
          <>
            <StakingBaner/>
            <div className="container">
              <TronLinkGuide installed url={"/?"+getString}/>
            </div>
          </>
          );
    
        return (
          <>
            <StakingBaner getString={getString}/>
            <Staking />
          </>
        );
      

      case "brut":
      case "BRUT":
      case "token":
      case "TOKEN":
        if (!this.state.tronWeb.installed) return (
          <>
            <HomeBaner/>
            <div className="container">
              <TronLinkGuide />
            </div>
          </>
          );
    
        if (!this.state.tronWeb.loggedIn) return (
          <>
            <HomeBaner/>
            <div className="container">
              <TronLinkGuide installed />
            </div>
          </>
          );
    
        return (
          <>
            <HomeBaner/>
            <Home />
          </>
        );

      case "brgy":
      case "BRGY":
      case "nft":
      case "NFT":
          if (!this.state.tronWeb.installed) return (
            <>
              <NftBaner/>
              <div className="container">
                <TronLinkGuide />
              </div>
            </>
            );
      
          if (!this.state.tronWeb.loggedIn) return (
            <>
              <NftBaner/>
              <div className="container">
                <TronLinkGuide installed />
              </div>
            </>
            );
      
          return (
            <>
              <NftBaner/>
              <Nft />
            </>
          );

    
      default:  

        return (<><Inicio /></>);
      
    }


    
  }

  
}
export default App;

// {tWeb()}
