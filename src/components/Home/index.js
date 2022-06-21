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
                
                <div className="row justify-content-center align-items-start">
        
                  <div className="col-lg-6 cols">
                    <CrowdFunding accountAddress={this.props.accountAddress}/>
                  </div>

                  <div className="col-lg-6 cols">
                    <Oficina accountAddress={this.props.accountAddress}/>
                  </div>
        
                </div>
              </div>
            </div>
          </section>
    
         
        </>
      );
  }
}
