import React, { Component } from "react";
import Utils from "../../utils";

import cons from "../../cons.js";

const contractAddress = cons.SC3;

export default class nftCrowdFunding extends Component {
  constructor(props) {
    super(props);

    this.state = {


    };

    this.compra = this.compra.bind(this);
    
  }



  async compra() {

    var accountAddress =  await window.tronWeb.trx.getAccount();
    accountAddress = window.tronWeb.address.fromHex(accountAddress.address);

    var contractMistery = await window.tronWeb.contract().at(cons.SC3);

    var contractAPENFT = await window.tronWeb.contract().at(cons.APENFT);

    var aprovado = await contractAPENFT.allowance(accountAddress,contractAddress).call();
    aprovado = parseInt(aprovado._hex);
    aprovado = aprovado/10**6

    if ( aprovado > 0 ){

          await contractMistery.buyMisteryBox().send();

          window.alert("Mistery box comprada");


    }else{

      window.alert("por favor aprueba el balance para poder comprar la mistery Box");

      if (aprovado <= 0) {
        await contractAPENFT.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send();
      }

    }

  };

  render() {


    return (


      <div className="container text-center">
        
        <div className="card">
          <div className="row">

            <div className="col-lg-12">
              <img src="assets/img/MISTERY2.gif" />
                <h2>Mistery box</h2>
                <p>10'000.000 APENFT</p>
                <button className="btn btn-success" style={{"wordBreak":"break-all"}} onClick={() => this.compra()}>Buy Mistery Box</button>

            </div>

          </div>

        </div>


      </div>


    );
  }
}
