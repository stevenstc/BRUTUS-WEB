import React, { Component } from "react";
import TronWeb from "tronweb";

import Utils from "../../utils";
import HomeBaner from "../HomeBaner";
import Home from "../Home";
import StakingBaner from "../StakingBaner";
import Staking from "../Staking";
import TronLinkGuide from "../TronLinkGuide";


const FOUNDATION_ADDRESS = "TWiWt5SEDzaEqS6kE5gandWMNfxR2B5xzg";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tronWeb: {
        installed: false,
        loggedIn: false
      }
    };
  }

  async componentDidMount() {
    await new Promise(resolve => {
      const tronWebState = {
        installed: !!window.tronWeb,
        loggedIn: window.tronWeb && window.tronWeb.ready
      };

      if (tronWebState.installed) {
        this.setState({
          tronWeb: tronWebState
        });

        return resolve();
      }

      let tries = 0;

      const timer = setInterval(() => {
        if (tries >= 10) {

          const TRONGRID_API = "https://api.trongrid.io";

          window.tronWeb = new TronWeb(
            TRONGRID_API,
            TRONGRID_API,
            TRONGRID_API
          );

          this.setState({
            tronWeb: {
              installed: false,
              loggedIn: false
            }
          });
          clearInterval(timer);
          return resolve();
        }

        tronWebState.installed = !!window.tronWeb;
        tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;

        if (!tronWebState.installed) {
          return tries++;
        }

        this.setState({
          tronWeb: tronWebState
        });

        resolve();
      }, 100);
    });

    if (!this.state.tronWeb.loggedIn) {
      // Set default address (foundation address) used for contract calls
      // Directly overwrites the address object if TronLink disabled the
      // function call
      window.tronWeb.defaultAddress = {
        hex: window.tronWeb.address.toHex(FOUNDATION_ADDRESS),
        base58: FOUNDATION_ADDRESS
      };

      window.tronWeb.on("addressChange", () => {
        if (this.state.tronWeb.loggedIn) {
          return;
        }

        this.setState({
          tronWeb: {
            installed: true,
            loggedIn: true
          }
        });
      });
    }

    Utils.setTronWeb(window.tronWeb);
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

    
      default:  

        return (<></>);
       
    
        
      
    }


    
  }

  
}
export default App;

// {tWeb()}
