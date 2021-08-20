import React, { Component } from "react";
import Utils from "../../utils";
import contractAddress from "../Contract";

import cons from "../../cons.js";

export default class Trading extends Component {
  constructor(props) {
    super(props);

    this.state = {

      minCompra: 10,
      minventa: 1,
      deposito: "Cargando...",
      wallet: "Cargando...",
      valueBRUT: "",
      valueUSDT: "",
      value: ""

    };

    this.compra = this.compra.bind(this);
    this.venta = this.venta.bind(this);
    this.estado = this.estado.bind(this);
    this.handleChangeBRUT = this.handleChangeBRUT.bind(this);
    this.handleChangeUSDT = this.handleChangeUSDT.bind(this);
    this.consultarPrecio = this.consultarPrecio.bind(this);
  }

  handleChangeBRUT(event) {
    this.setState({valueBRUT: event.target.value});
  }

  handleChangeUSDT(event) {
    this.setState({valueUSDT: event.target.value});
  }

  async componentDidMount() {
    await Utils.setContract(window.tronWeb, contractAddress);
    this.estado();
    setInterval(() => this.estado(),1*1000);
  };

  async consultarPrecio(){

    var proxyUrl = cons.proxy;
    var apiUrl = cons.PRICE;

    var response;
    try {
      response = await fetch(proxyUrl+apiUrl);
    } catch (err) {
      console.log(err);
      return this.state.precioBRUT;
    }

    const json = await response.json();

    return json.Data.precio;

  };

  async estado(){

    var accountAddress =  await window.tronWeb.trx.getAccount();
    accountAddress = window.tronWeb.address.fromHex(accountAddress.address);

    var inicio = accountAddress.substr(0,4);
    var fin = accountAddress.substr(-4);

    var texto = inicio+"..."+fin;

    document.getElementById("login").innerHTML = '<a href="https://tronscan.io/#/address/'+accountAddress+'" class="logibtn gradient-btn">'+texto+'</a>';

    var tronUSDT = await window.tronWeb;
    var contractUSDT = await tronUSDT.contract().at(cons.USDT);

    var aprovadoUSDT = await contractUSDT.allowance(accountAddress,contractAddress).call();
    aprovadoUSDT = parseInt(aprovadoUSDT.remaining._hex);

    var balanceUSDT = await contractUSDT.balanceOf(accountAddress).call();
    balanceUSDT = parseInt(balanceUSDT._hex)/10**6;

    if (aprovadoUSDT > 0) {
      aprovadoUSDT = "Comprar "; 
    }else{
      aprovadoUSDT = "Aprobar intercambio"; 
      this.setState({
        valueUSDT: ""
      })
    }

    var tronBRUT = await window.tronWeb;
    var contractBRUT = await tronBRUT.contract().at(cons.BRUT);

    var aprovadoBRUT = await contractBRUT.allowance(accountAddress,contractAddress).call();
    aprovadoBRUT = parseInt(aprovadoBRUT.remaining._hex);

    var balanceBRUT = await contractBRUT.balanceOf(accountAddress).call();
    balanceBRUT = parseInt(balanceBRUT._hex)/10**6;

    if (aprovadoBRUT > 0) {
      aprovadoBRUT = "Vender ";
    }else{
      aprovadoBRUT = "Aprobar intercambio";
      this.setState({
        valueBRUT: ""
      })
    }

    var precioBRUT =  await this.consultarPrecio();


    this.setState({
      depositoUSDT: aprovadoUSDT,
      depositoBRUT: aprovadoBRUT,
      balanceBRUT: balanceBRUT,
      balanceUSDT: balanceUSDT,
      wallet: accountAddress,
      precioBRUT: precioBRUT
    });

  }


  async compra() {


    const { minCompra } = this.state;

    var amount = document.getElementById("amountUSDT").value;
    amount = parseFloat(amount);
    amount = parseInt(amount*10**6);

    var accountAddress =  await window.tronWeb.trx.getAccount();
    accountAddress = window.tronWeb.address.fromHex(accountAddress.address);

    var tronUSDT = await window.tronWeb;
    var contractUSDT = await tronUSDT.contract().at(cons.USDT);

    var aprovado = await contractUSDT.allowance(accountAddress,contractAddress).call();
    aprovado = parseInt(aprovado.remaining._hex);

    if ( aprovado >= amount ){


        if ( amount >= minCompra){

          document.getElementById("amountUSDT").value = "";

          await Utils.contract.comprar(amount).send();

        }else{
          window.alert("Please enter an amount greater than "+minCompra+" USDT");
          document.getElementById("amountUSDT").value = minCompra;
        }



    }else{

        if (aprovado <= 0) {
          await contractUSDT.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send();
        }

        if ( amount > aprovado) {
          if (aprovado <= 0) {
            document.getElementById("amountUSDT").value = minCompra;
            window.alert("You do not have enough funds in your account you place at least 10 USDT");
          }else{
            document.getElementById("amountUSDT").value = minCompra;
            window.alert("You must leave 50 TRX free in your account to make the transaction");
          }



        }else{

          document.getElementById("amountUSDT").value = amount;
          window.alert("You must leave 50 TRX free in your account to make the transaction");

        }
    }


  };

  async venta() {


    const { minventa } = this.state;

    var amount = document.getElementById("amountBRUT").value;
    amount = parseFloat(amount);
    amount = parseInt(amount*10**6);

    var accountAddress =  await window.tronWeb.trx.getAccount();
    accountAddress = window.tronWeb.address.fromHex(accountAddress.address);

    var tronBRUT = await window.tronWeb;
    var contractBRUT = await tronBRUT.contract().at(cons.BRUT);

    var aprovado = await contractBRUT.allowance(accountAddress,contractAddress).call();
    aprovado = parseInt(aprovado.remaining._hex);

    if ( aprovado >= amount ){


        if ( amount >= minventa){

          document.getElementById("amountBRUT").value = "";

          await Utils.contract.vender(amount).send();

        }else{
          window.alert("Please enter an amount greater than 10 USDT");
          document.getElementById("amountBRUT").value = 10;
        }



    }else{


        if (aprovado <= 0) {
          await contractBRUT.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send();
        }

        if ( amount > aprovado) {
          if (aprovado <= 0) {
            document.getElementById("amountBRUT").value = minventa;
            window.alert("You do not have enough funds in your account you place at least "+minventa+" USDT");
          }else{
            document.getElementById("amountBRUT").value = minventa;
            window.alert("You must leave 50 TRX free in your account to make the transaction");
          }



        }else{

          document.getElementById("amountBRUT").value = minventa;
          window.alert("You must leave 50 TRX free in your account to make the transaction");

        }

    }


  };


  render() {

    var { minCompra, minventa } = this.state;

    minCompra = "Min. "+minCompra+" USDT";
    minventa = "Min. "+minventa+" BRUT";


    return (


      <div className="container text-center">
        <div className="row">
          <div className="col-lg-6 p-3">
            <div className="card">
            
              
              <h6 >
                <strong>Comprar</strong><br />
              </h6>

              <p>
                Tether: <strong>{this.state.balanceUSDT}</strong> (USDT)
              </p>

              <div className="form-group">
                <input type="number" className="form-control mb-20 text-center" id="amountUSDT" value={this.state.valueUSDT} onChange={this.handleChangeUSDT} placeholder={minCompra}></input>
                <p className="card-text">debes tener ~ 50 TRX para hacer la transacción</p>

                <a href="#convert" className="gradient-btn v2" onClick={() => this.compra()}>{this.state.depositoUSDT} {} {(this.state.valueUSDT/this.state.precioBRUT).toFixed(8)} BRUT</a>

              </div>
              
            </div>
            
          </div>
          

          
          <div className="col-lg-6 p-3">
            <div className="card">
            
              
              <h6 >
                <strong>Vender</strong><br />
              </h6>

              <p>
                Brutus Token: <strong>{this.state.balanceBRUT}</strong> (BRUT)
              </p>

              <div className="form-group">
                <input type="number" className="form-control mb-20 text-center" id="amountBRUT" value={this.state.valueBRUT} onChange={this.handleChangeBRUT} placeholder={minventa}></input>
                <p className="card-text">debes tener ~ 50 TRX para hacer la transacción</p>

                <a href="#convert" className="gradient-btn v2" onClick={() => this.venta()}>{this.state.depositoBRUT} {(this.state.precioBRUT*this.state.valueBRUT).toFixed(6)} USDT</a>


              </div>
              
            </div>
            
          </div>
        </div>
      </div>


    );
  }
}
