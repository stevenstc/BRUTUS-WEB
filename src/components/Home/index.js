import React, { Component } from "react";

import CrowdFunding from "../HomeCrowdFunding";
import Oficina from "../HomeOficina";

export default class Home extends Component {
  
  render() {

      return (
        <>
          
          <section className="convert-area" id="convert">
            <div className="container">
              <div className="convert-wrap">
                <div className="row justify-content-center align-items-center flex-column pb-30">
                  <h1 className="text-white  text-center">Intercambio de Tokens</h1>
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
                  <h1 className="text-white  text-center">Mis Brutus Token (BRUT)</h1>
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
