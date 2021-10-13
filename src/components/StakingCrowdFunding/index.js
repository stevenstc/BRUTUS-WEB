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
      tiempo: 0,
      enBrutus: 0,
      tokensEmitidos: 0,
      enPool: 0,
      solicitado: 0,

    };

    this.compra = this.compra.bind(this);
    this.venta = this.venta.bind(this);
    this.estado = this.estado.bind(this);

    this.handleChangeBRUT = this.handleChangeBRUT.bind(this);
    this.handleChangeUSDT = this.handleChangeUSDT.bind(this);

    this.llenarBRUT = this.llenarBRUT.bind(this);
    this.llenarUSDT = this.llenarUSDT.bind(this);

    this.consultarPrecio = this.consultarPrecio.bind(this);
  }

  handleChangeBRUT(event) {
    this.setState({valueBRUT: event.target.value});
  }

  handleChangeUSDT(event) {
    this.setState({valueUSDT: event.target.value});
  }

  llenarBRUT(){
    document.getElementById('amountBRUT').value = this.state.balanceBRUT;
    this.setState({valueBRUT: this.state.balanceBRUT});
    
  }

  llenarUSDT(){
    document.getElementById('amountUSDT').value = this.state.balanceUSDT;
    this.setState({valueUSDT: this.state.balanceUSDT});
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

    var deposito = await Utils.contract.todasSolicitudes(accountAddress).call();

    var tiempo = await Utils.contract.TIEMPO().call();

    tiempo = parseInt(tiempo._hex)*1000;

    console.log(deposito);

    deposito.cantidad = 0;
    deposito.tiempo = 0;
    deposito.tiempo = tiempo;

    var enBrutus = await Utils.contract.TRON_BALANCE().call();
    var tokensEmitidos = await contractBRUT.totalSupply().call();
    var enPool = await Utils.contract.TRON_PAY_BALANCE().call();
    var solicitado = await Utils.contract.TRON_SOLICITADO().call();
    var solicitudes = await Utils.contract.index().call();

    //console.log(tokensEmitidos);
    this.setState({
      depositoUSDT: aprovadoUSDT,
      depositoBRUT: aprovadoBRUT,
      balanceBRUT: balanceBRUT,
      balanceUSDT: balanceUSDT,
      wallet: accountAddress,
      precioBRUT: precioBRUT,
      cantidad: deposito.cantidad,
      tiempo: deposito.tiempo,
      espera: tiempo,
      enBrutus: parseInt(enBrutus._hex)/10**6,
      tokensEmitidos: parseInt(tokensEmitidos._hex)/10**6,
      enPool: parseInt(enPool._hex)/10**6,
      solicitado: parseInt(solicitado._hex)/10**6,
      solicitudes: parseInt(solicitudes._hex),
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

    this.llenarUSDT();

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

          var pass = window.confirm("Tu solicitud generará una orden de venta para tus BRST esperando a que sea completada por la comunidad");
          if(pass){await Utils.contract.solicitudRetiro(amount).send()};

          //window.alert("Estamos actualizando a la version 3 del contrato de liquidez por favor contacta atravez de telegram para intercambiar tus BRST por TRX, estamos mejorando nustro sistema ;)");

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

    this.llenarBRUT();

  };

  async retiro() {

    if (Date.now() >= this.state.tiempo && this.state.tiempo-this.state.espera !== 0) {
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

    if (tiempo-this.state.espera === 0) {
      tiempo = "## ## ####";
      
    }else{
      tiempo = new Date(tiempo);
      tiempo = tiempo+"";

    }

    


    return (


      <div className="container text-center">
        
        <div className="card">
          <div className="row">

            <div className="col-lg-4">
                <h2>TRX en SR</h2>
                <p>{this.state.enBrutus} TRX</p>
            </div>

            <div className="col-lg-4">
                <h2>1 BRST</h2>
                <p>{(this.state.enBrutus/this.state.tokensEmitidos).toFixed(6)} TRX</p>
            </div>

            <div className="col-lg-4">
                <h2>BRST emitidos</h2>
                <p>{this.state.tokensEmitidos} BRST</p>
            </div>

          </div>

        </div>
        <div className="row">
          <div className="col-lg-6 ">
            <div className="card pt-4">
            
              
              <h5 >
                <strong>Staking</strong><br />
              </h5>

              <hr color="white"/>

              <p onClick={() => this.llenarUSDT()} style={{"cursor" : "pointer"}}>
                Tron: <strong>{this.state.balanceUSDT}</strong> (TRX)
              </p>

              <div className="form-group">
                <input type="number" className="form-control mb-20 text-center" id="amountUSDT"  onChange={this.handleChangeUSDT} placeholder={minCompra} min={this.state.minCompra} max={this.state.balanceUSDT}></input>
                <p className="card-text">debes tener ~ 50 TRX para hacer la transacción</p>

                <a href="javascript:void(0)" className="gradient-btn v2" onClick={() => this.compra()}>{this.state.depositoUSDT} {} {(this.state.valueUSDT/this.state.precioBRUT).toFixed(6)} BRST</a>

              </div>
              
            </div>
            
          </div>
          

          
          <div className="col-lg-6">
            <div className="card pt-4">
            
              
              <h5 >
                <strong>Solicitar Retiro</strong><br />
              </h5>

              <hr color="white"/>

              <p onClick={() => this.llenarBRUT()} style={{"cursor" : "pointer"}}>
                Brutus Staking: <strong>{this.state.balanceBRUT}</strong> (BRST)
              </p>

              <div className="form-group">
                <input type="number" className="form-control mb-20 text-center" id="amountBRUT"  onChange={this.handleChangeBRUT} placeholder={minventa} min={this.state.minventa} max={this.state.balanceBRUT}></input>
                <p className="card-text">debes tener ~ 50 TRX para hacer la transacción</p>

                <a href="javascript:void(0)" className="gradient-btn v2" onClick={() => this.venta()}>{this.state.depositoBRUT} {(this.state.precioBRUT*this.state.valueBRUT).toFixed(6)} TRX</a>


              </div>
              
            </div>
            
          </div>

          <div className="col-lg-12">
            <div className="card pt-4">
            
              
              <h5 >
                <strong>Retirar a Wallet</strong><br />
              </h5>

              <hr color="white"/>

              <p>
                Tron Pendiente: <strong>{this.state.cantidad}</strong> (TRX)<br></br>
                Disponible despues de: <strong>{tiempo}</strong>
              </p>

              <div className="form-group">
          
                <p className="card-text">debes tener ~ 50 TRX para hacer la transacción</p>

                <a href="javascript:void(0)" className="gradient-btn v2" onClick={() => this.retiro()}>{cantidad2} TRX</a>


              </div>
              
            </div>
            
          </div>

        </div>

        <div className="card">
          <div className="row">

            <div className="col-lg-4">
                <h2>TRX Disponible</h2>
                <p>{this.state.enPool} TRX</p>
            </div>

            <div className="col-lg-4">
                <h2>TRX solicitado</h2>
                <p>{this.state.solicitado} TRX</p>
            </div>

            <div className="col-lg-4">
                <h2>En proceso</h2>
                <p>{this.state.solicitado-this.state.enPool} TRX</p>
            </div>

          </div>

          <hr  color="white"/>

          <div className="row">

            <div className="col-lg-12">
                <h2>Solicitudes</h2>
                <p>#{this.state.solicitudes}</p>
            </div>

          </div>

        </div>

      </div>


    );
  }
}
