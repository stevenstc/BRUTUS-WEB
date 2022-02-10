import React, { Component } from "react";

import CrowdFunding from "../nftCrowdFunding";
import Oficina from "../nftOficina";

export default class nfts extends Component {
  
  render() {

      return (
        <>
          <section className="convert-area" id="convert">
            <div className="container">
              <div className="convert-wrap">
                <div className="row justify-content-center align-items-center flex-column pb-30">
                  <h1 className="text-white text-center">¡¡SUMATE A LA REVOLUCIÓN DE LOS NFT!!</h1>
                </div>
                <div className="row justify-content-center align-items-start">
        
                  <div className="col-lg-12 cols">
                    <CrowdFunding accountAddress={this.props.accountAddress} />
                  </div>
        
                </div>
              </div>
            </div>
          </section>
    
          <section className="convert-area pt-5" id="convert">
            <div className="container">
              <div className="convert-wrap">
                <div className="row justify-content-center align-items-center flex-column pb-30">
                  <h1 className="text-white  text-center">Mis Brutus Gallery (BRGY)</h1>
                </div>
                <div className="row justify-content-center align-items-start">
        
                  <div className="col-lg-12 cols">
                    <Oficina accountAddress={this.props.accountAddress} />
                  </div>
        
                </div>
              </div>
            </div>
          </section>
        </>
      );
  }
}
