import React, { Component } from "react";
import Utils from "../../../utils";

import cons from "../../../cons.js";
const contractAddress = cons.SC;


export default class Oficina extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deposito: "Cargando...",
      wallet: this.props.accountAddress,
      balanceBRUT: 0,
      precioBRUT: 0,
      tokenCompra: 0,
      usdCompra: 0,

    };

    this.estado = this.estado.bind(this);
    this.consultarPrecio = this.consultarPrecio.bind(this);
  }

  async componentDidMount() {
    await Utils.setContract(window.tronWeb, contractAddress);
    this.estado();
    setInterval(() => this.estado(),3*1000);
  };

  async consultarPrecio(){

    var proxyUrl = cons.proxy;
    var apiUrl = cons.PRICE;

    var response = {};
    try {
      response = await fetch(proxyUrl+apiUrl);
    } catch (err) {
      console.log(err);
      return this.state.precioBRUT;
    }

    const json = await response.json();
    return json.Data.usd;

  };

  async estado(){

    var accountAddress = this.props.accountAddress;

    var tronBRUT = await window.tronWeb;
    var contractBRUT = await tronBRUT.contract().at(cons.BRUT);

    var balanceBRUT = await contractBRUT.balanceOf(accountAddress).call();
    balanceBRUT = parseInt(balanceBRUT._hex)/10**6;

    
    var precioBRUT =  await this.consultarPrecio();

    var investor = await Utils.contract.investors(accountAddress).call();

    this.setState({
      wallet: accountAddress,
      precioBRUT: precioBRUT,
      balanceBRUT: balanceBRUT,
      tokenCompra: parseInt(investor.tokenCompra._hex)/10**6,
      usdCompra: parseInt(investor.usdCompra._hex)/10**6,
      tokenVenta: parseInt(investor.tokenVenta._hex)/10**6,
      usdVenta: parseInt(investor.usdVenta._hex)/10**6
    });

  }


  render() {


    return (


      <div className=" container text-center">
        <div className="row">
          
          <div className="col-lg-12 p-2">
            <div className="card">
            <div className="row justify-content-center align-items-center flex-column pb-30">
                  <h1 className="text-white  text-center">Mis Brutus Token (BRUT)</h1>
                </div>
            <hr color="white"/>

            <br /><br />
              
              <h6 >
              wallet:<br />
                <strong>{this.props.accountAddress}</strong><br /><br />
              </h6>

              <h5 className="p-3">
                Brutus Token: <strong>{this.state.balanceBRUT}</strong> (BRUT) <br />
              
                Valor: <strong>{(this.state.balanceBRUT*this.state.precioBRUT).toFixed(6)}</strong> (USDT)
              </h5>

              
            </div>
            
          </div>

          

          
        </div>
      </div>


    );
  }
}
