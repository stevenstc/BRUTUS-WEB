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
                            <h6>Brutus Token nace como un proyecto que acerca el trading automatizado a los holders de la moneda.<br /><br />
                                Mediante diferentes bots con diferentes estrategias definidas, utilizamos la volatilidad del cripto mercado , para generar rentabilidades, intentando minimizar las pérdidas a la mínima expresión. <br /><br />
                                Para ello, hemos desarrollado un Token (TRC-20) en la BlockChain de TRON con la finalidad de crear una comunidad donde los noobs tendrán su primer contacto con la BlockChain y los veteranos serán holder de un Token con todas las utilidades del ecosistema.
                            </h6>
                              
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                          <div className="welcome-img">
                              <img src="assets/img/Brutus.svg" alt="Brutus Token" />
                          </div>
                      </div>
                  </div>
              </div>
          </div>

        </>
      );
  }
}
