import React, { Component } from "react";

import cons from "../../cons.js";

const contractAddress = cons.SC3;

export default class nftCrowdFunding extends Component {
  constructor(props) {
    super(props);

    this.state = {


      MB: "Cargando..."
    };

    this.compra = this.compra.bind(this);
    this.misterio = this.misterio.bind(this);

    
  }

  async componentDidMount() {

    setInterval(()=>{
      this.misterio();
    }, 7*1000)
  }

  async misterio() {
    var accountAddress =  await window.tronWeb.trx.getAccount();
    accountAddress = window.tronWeb.address.fromHex(accountAddress.address);
    var contractMistery = await window.tronWeb.contract().at(cons.SC3);

    var mb = 0;

    for (let index = 0; index < 25; index++) {
      var conteo = await contractMistery.entregaNFT(accountAddress, index).call()
      .then((conteo)=>{
        if(conteo._hex){
          console.log(parseInt(conteo._hex));
          return 1;
        }else{
          return 0;
        }
      })
      .catch(()=>{return 0;})

      mb += conteo;
      
    }


    this.setState({
      MB: mb
    })

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

    this.misterio();

  };

  render() {


    return (


      <div className="container text-center">
        
        <div className="card">
          <div className="row">

            <div className="col-lg-12">
              <img 
                src="assets/img/MISTERY2.gif" 
                alt="mistery box brutus"
              />
                <h2>Mistery box</h2>
                <p>10'000.000 APENFT</p>
                <button className="btn btn-success" style={{"cursor":"pointer"}} onClick={() => this.compra()}>Buy Mistery Box</button>

                <br></br><br></br>

                Mistery Box compradas: {this.state.MB}

                <br></br>

                <button className="btn btn-warning" style={{"cursor":"pointer"}} onClick={async() => { 

                  if(true){

                    window.alert("por favor espera a la fecha anunciada para reclamar tu NFT")

                  }else{
                    var contractMistery = await window.tronWeb.contract().at(cons.SC3);

                    contractMistery.claimNFT().send()
                    .then(window.alert("NFT's enviados a tu wallet"))
                    .catch(window.alert("Error al reclamar"))
                    
                  }
                  
                  }}>Abrir {this.state.MB} Mistery Box</button>
            </div>

          </div>

        </div>


      </div>


    );
  }
}
