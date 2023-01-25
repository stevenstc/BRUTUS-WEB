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
                            <h6>
                              En Brutus creemos que el staking es una de las formas más seguras de generar rentabilidades, por eso consideramos crear este producto.<br /><br />
                              Brutus Tron Staking, es uno de los 127 super socios que reparte las rentabilidades obtenidas por el staking de Tron entre todos los componentes de la comunidad Brutus que apoyan al proyecto.<br /><br />
                              Principalmente los usuarios pueden participar de dos maneras, la primera es gracias a nuestro token propio Brutus  Staking (BRST), mediante el cual los  poseedores de la moneda, obtendrán rentabilidades adicionales en Tron gracias a la reinversión del interés compuesto a díario.<br /><br />
                              La segunda es votando por nosotros mediante el congelado de Tron.<br /><br />
                              Brutus Tron Staking, pretende ser uno de los principales validadores de habla hispana dentro del ecosistema, además de generar interesantes rentabilidades para sus votantes.
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
