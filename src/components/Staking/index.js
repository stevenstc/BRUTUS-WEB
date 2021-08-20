import React, { Component } from "react";

import CrowdFunding from "../StakingCrowdFunding";
import Oficina from "../StakingOficina";

export default class Staking extends Component {
  
  render() {

      return (
        <>
          <section className="convert-area" id="convert">
            <div className="container">
              <div className="convert-wrap">
                <div className="row justify-content-center align-items-center flex-column pb-30">
                  <h1 className="text-white text-center">¡¡SUMATE A LA REVOLUCIÓN DEL STAKING de TRON!!</h1>
                </div>
                <div className="row justify-content-center align-items-start">
        
                  <div className="col-lg-12 cols">
                    <CrowdFunding />
                  </div>
        
                </div>
              </div>
            </div>
          </section>
    
          <section className="convert-area pt-5" id="convert">
            <div className="container">
              <div className="convert-wrap">
                <div className="row justify-content-center align-items-center flex-column pb-30">
                  <h1 className="text-white  text-center">Mis Brutus Staking (BRST)</h1>
                </div>
                <div className="row justify-content-center align-items-start">
        
                  <div className="col-lg-12 cols">
                    <Oficina />
                  </div>
        
                </div>
              </div>
            </div>
          </section>
        </>
      );
  }
}
