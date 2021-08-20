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
                            <h1>!El token que tradea por ti!</h1>
                            <h6>Brutus Token nace como un proyecto que acerca el TRADING AUTOMATIZADO a los HOLDERS de la MONEDA.<br /><br />
                                Mediante DIFERENTES BOTS con diferentes estrategias definidas, utilizamos la volatilidad del mercado CRIPTO, para generar rentabilidades, intentando minimizar las pérdidas a la mínima expresión. <br /><br />
                                Para ello, hemos desarrollado un TOKEN (TRC-20) en la BLOCKCHAIN de TRON con la FINALIDAD de crear una COMUNIDAD donde los NOOBS tendrán su primer CONTACTO con la BLOCKCHAIN y los VETERANOS serán HOLDER de un TOKEN con todas las utilidades que este ofrece.
                            </h6>
                              
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                          <div className="welcome-img">
                              <img src="assets/img/Brutus.png" alt="Brutus Token" />
                          </div>
                      </div>
                  </div>
              </div>
          </div>

        </>
      );
  }
}
