import React, { Component } from "react";
import Utils from "../../utils";

import cons from "../../cons.js";
const contractAddress = cons.SC2;

export default class nftOficina extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deposito: "Cargando...",
      wallet: "Cargando...",
      balanceBRUT: 0,
      precioBRUT: 0

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

    var precio = await Utils.contract.RATE().call();
    precio = parseInt(precio._hex)/10**6;

    this.setState({
      precioBRUT: precio
    });

    return precio;

  };

  async estado(){

    var accountAddress =  await window.tronWeb.trx.getAccount();
    accountAddress = window.tronWeb.address.fromHex(accountAddress.address);

    var tronBRUT = await window.tronWeb;
    var contractBRUT = await tronBRUT.contract().at(cons.BRST);

    var balanceBRUT = await contractBRUT.balanceOf(accountAddress).call();
    balanceBRUT = parseInt(balanceBRUT._hex)/10**6;

    var precioBRUT =  await this.consultarPrecio();

    this.setState({
      wallet: accountAddress,
      precioBRUT: precioBRUT,
      balanceBRUT: balanceBRUT
    });

  }

  render() {

    return (

      <div className=" container text-center">
        <div className="row">
          
          <div className="col-lg-12 p-2">
            <div className="card">
              <br /><br />
              
              <h5 >
              wallet:<br />
                <strong>{this.state.wallet}</strong><br /><br />
              </h5>

              
            </div>
            
          </div>

        </div>

      </div>


    );
  }
}
