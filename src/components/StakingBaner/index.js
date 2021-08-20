import React, { Component } from "react";

export default class HomeBaner extends Component {

  constructor(props) {
    super(props);

    this.state = {

      minCompra: 10,
      minventa: 1,
      deposito: "Cargando...",
      wallet: "Cargando...",
      valueBRUT: "",
      valueUSDT: "",
      value: "",
      cantidad: 0,
      tiempo: ""

    };
    
  }

  
  render() {

      return (
        <>
          <div className="welcome-area wow fadeInUp" id="home">
              <div id="particles-js"></div>
              <div className="container">
                  <div className="row">
                      <div className="col-12 col-md-6 align-self-center">
                        <div className="welcome-right">
                          <div className="welcome-text">
                            <h1>BRUTUS TRON STAKING</h1>
                            <h6>En BRUTUS, hemos desarrollado un producto que genera RENTABILIDADES EXPONENCIALES en TRON, aplicando INTERES COMPUESTO DIARIO sobre el STAKING generado, además de INVERTIR EN DIFERENTES POOLS de LIQUIDEZ. De esta FORMA, tu STAKING de TRX, crece dia a dia sin necesidad de que tengas que preocuparte de RECLAMAR TUS GANANCIA.<br /><br />
                              Por otro lado con tu STAKING contribuyes al CONSTANTE desarrollo de la BLOCKCHAIN de TRON, ya que nos COMPROMETEMOS a delegar los TOKENS en los DESARROLLADORES que más ACTIVAMENTE participan en las mejoras del ECOSISTEMA.<br /><br />
                              Para terminar tu STAKING genera energía lo que nos PERMITIRÁ mover los TOKENS a coste cero mejorando así las rentabilidades OBTENIDAS.
                            </h6>
            
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                          <div className="welcome-img">
                              <img src="assets/img/brutus2.0.svg" alt="Brutus Staking" />
                          </div>
                      </div>
                  </div>
              </div>
          </div>

        </>
      );
  }
}
