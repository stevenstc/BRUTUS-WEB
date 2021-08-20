import React, { Component } from "react";
import Utils from "../../utils";

import cons from "../../cons.js";

const contractAddress = cons.SC2;

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
      value: "",
      cantidad: 0,
      tiempo: 0

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

    var inicio = accountAddress.substr(0,4);
    var fin = accountAddress.substr(-4);

    var texto = inicio+"..."+fin;

    document.getElementById("login").innerHTML = '<a href="https://tronscan.io/#/address/'+accountAddress+'" class="logibtn gradient-btn">'+texto+'</a>';

    var aprovadoUSDT = await window.tronWeb.trx.getBalance();

    aprovadoUSDT = aprovadoUSDT/10**6;

    var balanceUSDT = aprovadoUSDT;

    if (aprovadoUSDT > 0) {
      aprovadoUSDT = "Staking "; 
    }else{
      aprovadoUSDT = "Necesitas TRX para hacer Staking"; 
      this.setState({
        valueUSDT: ""
      })
    }

    var tronBRUT = await window.tronWeb;
    var contractBRUT = await tronBRUT.contract().at(cons.BRST);

    var aprovadoBRUT = await contractBRUT.allowance(accountAddress,contractAddress).call();
    aprovadoBRUT = parseInt(aprovadoBRUT._hex);

    var balanceBRUT = await contractBRUT.balanceOf(accountAddress).call();
    balanceBRUT = parseInt(balanceBRUT._hex)/10**6;

    if (aprovadoBRUT > 0) {
      aprovadoBRUT = "Solicitar ";
    }else{
      aprovadoBRUT = "Aprobar intercambio";
      this.setState({
        valueBRUT: ""
      })
    }

    var precioBRUT =  await this.consultarPrecio();

    var deposito = await Utils.contract.solicitudes(accountAddress).call();

    deposito.cantidad = parseInt(deposito.cantidad._hex)/10**6;
    deposito.tiempo = parseInt(deposito.tiempo._hex)*1000;

    this.setState({
      depositoUSDT: aprovadoUSDT,
      depositoBRUT: aprovadoBRUT,
      balanceBRUT: balanceBRUT,
      balanceUSDT: balanceUSDT,
      wallet: accountAddress,
      precioBRUT: precioBRUT,
      cantidad: deposito.cantidad,
      tiempo: deposito.tiempo
    });

  }


  async compra() {


    const { minCompra } = this.state;

    var amount = document.getElementById("amountUSDT").value;
    amount = parseFloat(amount);
    amount = parseInt(amount*10**6);

    var aprovado = await window.tronWeb.trx.getBalance();

    if ( aprovado >= amount ){


        if ( amount >= minCompra){

          document.getElementById("amountUSDT").value = "";

          await Utils.contract.staking().send({callValue: amount});

        }else{
          window.alert("Please enter an amount greater than "+minCompra+" USDT");
          document.getElementById("amountUSDT").value = minCompra;
        }



    }else{

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
    var contractBRUT = await tronBRUT.contract().at(cons.BRST);

    var aprovado = await contractBRUT.allowance(accountAddress,contractAddress).call();
    aprovado = parseInt(aprovado._hex);

    if ( aprovado >= amount ){


        if ( amount >= minventa){

          document.getElementById("amountBRUT").value = "";

          await Utils.contract.solicitudRetiro(amount).send();

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

  async retiro() {

    var accountAddress =  await window.tronWeb.trx.getAccount();
    accountAddress = window.tronWeb.address.fromHex(accountAddress.address);

    var deposito = await Utils.contract.solicitudes(accountAddress).call();

    deposito.cantidad = parseInt(deposito.cantidad._hex)/10**6;
    deposito.tiempo = parseInt(deposito.tiempo._hex)*1000;

    if (Date.now() >= deposito.tiempo && deposito.tiempo !== 0) {
      await Utils.contract.retirar().send();
    }else{
      window.alert("todavia no es tiempo de retirar");
    }


  };


  render() {

    var { minCompra, minventa } = this.state;

    minCompra = "Min. "+minCompra+" TRX";
    minventa = "Min. "+minventa+" BRST";

    var cantidad2 = this.state.cantidad;

    var tiempo = this.state.tiempo;

    if(Date.now() < tiempo){
      cantidad2 = 0;
    }

    if (tiempo === 0) {
      tiempo = "## ## ####";
      
    }else{
      tiempo = new Date(tiempo);
      tiempo = tiempo+"";

    }

    


    return (


      <div className="container text-center">
        <div className="row">
          <div className="col-lg-6 p-3">
            <div className="card">
            
              
              <h6 >
                <strong>Staking</strong><br />
              </h6>

              <p>
                Tron: <strong>{this.state.balanceUSDT}</strong> (TRX)
              </p>

              <div className="form-group">
                <input type="number" className="form-control mb-20 text-center" id="amountUSDT" value={this.state.valueUSDT} onChange={this.handleChangeUSDT} placeholder={minCompra}></input>
                <p className="card-text">debes tener ~ 50 TRX para hacer la transacción</p>

                <a href="#convert" className="gradient-btn v2" onClick={() => this.compra()}>{this.state.depositoUSDT} {} {(this.state.valueUSDT/this.state.precioBRUT).toFixed(6)} BRST</a>

              </div>
              
            </div>
            
          </div>
          

          
          <div className="col-lg-6 p-3">
            <div className="card">
            
              
              <h6 >
                <strong>Solicitar Retiro</strong><br />
              </h6>

              <p>
                Brutus Staking: <strong>{this.state.balanceBRUT}</strong> (BRST)
              </p>

              <div className="form-group">
                <input type="number" className="form-control mb-20 text-center" id="amountBRUT" value={this.state.valueBRUT} onChange={this.handleChangeBRUT} placeholder={minventa}></input>
                <p className="card-text">debes tener ~ 50 TRX para hacer la transacción</p>

                <a href="#convert" className="gradient-btn v2" onClick={() => this.venta()}>{this.state.depositoBRUT} {(this.state.precioBRUT*this.state.valueBRUT).toFixed(6)} TRX</a>


              </div>
              
            </div>
            
          </div>

          <div className="col-lg-12 p-3">
            <div className="card">
            
              
              <h6 >
                <strong>Retirar a Wallet</strong><br />
              </h6>

              <p>
                Tron Pendiente: <strong>{this.state.cantidad}</strong> (TRX)<br></br>
                Disponible despues de: <strong>{tiempo}</strong>
              </p>

              <div className="form-group">
          
                <p className="card-text">debes tener ~ 50 TRX para hacer la transacción</p>

                <a href="#convert" className="gradient-btn v2" onClick={() => this.retiro()}>{cantidad2} TRX</a>


              </div>
              
            </div>
            
          </div>

        </div>
      </div>


    );
  }
}
