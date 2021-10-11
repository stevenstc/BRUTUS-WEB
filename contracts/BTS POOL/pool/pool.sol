pragma solidity >=0.7.0;
// SPDX-License-Identifier: Apache-2.0

import "./Ownable.sol";
import "./SafeMath.sol";

interface TRC20_Interface {

    function allowance(address _owner, address _spender) external view returns (uint remaining);

    function transferFrom(address _from, address _to, uint _value) external returns (bool);

    function transfer(address direccion, uint cantidad) external returns (bool);

    function balanceOf(address who) external view returns (uint256);

    function decimals() external view returns (uint256);

    function totalSupply() external view returns (uint256);

    function issue(uint amount) external;
        
    function redeem(uint amount) external;

    function transferOwnership(address newOwner) external;
}

contract PoolBRST is Ownable{
  using SafeMath for uint;

  TRC20_Interface BRTS_Contract;

  TRC20_Interface OTRO_Contract;

  struct Usuario {
    uint[] id;
    bool[] completado; 
    uint256[] tiempo;
    uint256[] trx;
    uint256[] brst;
    address[] partner;

  }

  uint public MIN_DEPOSIT = 10 *10**6;
  uint public TRON_GANANCIAS = 0;
  uint public TRON_SOLICITADO = 0;

  uint public TRON_WALLET_BALANCE = 13000 *10**6;

  uint public porcentaje_equipo = 3;
  uint public porcentaje_usuarios = 97;

  uint public dias_de_pago = 7;
  uint public unidades_tiempo = 86400;

  address public NoValido = address(0);

  mapping (address => Usuario) private usuarios;
  mapping (uint => address ) public solicitudesEnProgreso;
  mapping (uint => uint ) public solicitudInterna;

  uint public index = 0;

  constructor(address _tokenTRC20) {
    BRTS_Contract = TRC20_Interface(_tokenTRC20);

  }

  function TRON_TOTAL_BALANCE() public view returns (uint){
      return TRON_PAY_BALANCE().add(TRON_WALLET_BALANCE).add(TRON_GANANCIAS.mul(porcentaje_usuarios).div(100));
  }

  function TRON_BALANCE() public view returns (uint){
      return TRON_WALLET_BALANCE.add(TRON_GANANCIAS.mul(porcentaje_usuarios).div(100));
  }

  function TRON_GANANCIAS_EQUIPO() public view returns (uint){
      return TRON_GANANCIAS.mul(porcentaje_equipo).div(100);
  }

  function TRON_PAY_BALANCE() public view returns (uint){
    return address(this).balance;
  }

  function RATE() public view returns (uint){

    return (TRON_BALANCE().mul(10**BRTS_Contract.decimals())).div( BRTS_Contract.totalSupply() );

  }

  function TIEMPO() public view returns (uint){

    return dias_de_pago.mul(unidades_tiempo);

  }

  function setPorcentajeUsuario(uint _porcent) public onlyOwner returns (bool, uint user, uint platafom ){

    porcentaje_equipo = 100-_porcent;
    porcentaje_usuarios = _porcent;

    return (true , porcentaje_usuarios, porcentaje_equipo );

  }

  function setPorcentajes(uint _porcentUser, uint _porcentTeam) public onlyOwner returns (bool, uint user, uint platafom ){

    porcentaje_equipo = _porcentTeam;
    porcentaje_usuarios = _porcentUser;

    return (true , porcentaje_usuarios, porcentaje_equipo );

  }

  function setDias(uint _dias) public onlyOwner returns (bool){

    dias_de_pago = _dias;

    return true;

  }

  function setUnidadesTiempo(uint _unidades) public onlyOwner returns (bool){

    unidades_tiempo = _unidades;

    return true;

  }

  function ChangeToken(address _tokenTRC20) public onlyOwner returns (bool){

    BRTS_Contract = TRC20_Interface(_tokenTRC20);

    return true;

  }

  function ChangeTokenOTRO(address _tokenTRC20) public onlyOwner returns (bool){

    OTRO_Contract = TRC20_Interface(_tokenTRC20);

    return true;

  }

  function transferirOwnerBRTS(address _newowner) public onlyOwner returns (bool){

    BRTS_Contract.transferOwnership(_newowner);

    return true;

  }

  function solicitudRetiro(uint256 _value) public returns (uint256){

    if( BRTS_Contract.allowance(msg.sender, address(this)) < _value || BRTS_Contract.balanceOf(msg.sender) < _value)revert();

    uint pago = _value.mul(RATE()).div(10 ** BRTS_Contract.decimals());
    
    if( !BRTS_Contract.transferFrom(msg.sender, address(this), _value) )revert();
    //BRTS_Contract.redeem(_value);

    Usuario storage usuario = usuarios[msg.sender];

    usuario.id.push(index);
    usuario.completado.push(false);
    usuario.tiempo.push(block.timestamp);
    usuario.trx.push(pago);
    usuario.brst.push(_value);
    usuario.partner.push(address(0));

    TRON_WALLET_BALANCE -= pago;
    TRON_SOLICITADO += pago;

    solicitudesEnProgreso[index] = msg.sender;
    solicitudInterna[index] = usuario.id.length-1;
    index++;

    return pago;

  }

  function retirar(uint256 _id) public {

    Usuario storage usuario = usuarios[msg.sender];

    if( _id >= largoSolicitudes(msg.sender) || block.timestamp < usuario.tiempo[_id].add(TIEMPO()) || usuario.completado[_id] )revert();

    uint pago = usuario.trx[_id];

    if(TRON_PAY_BALANCE() < pago)revert();
    payable(msg.sender).transfer(pago);
    BRTS_Contract.redeem(usuario.brst[_id]);
    usuario.completado[_id] = true;
    TRON_SOLICITADO -= pago;

  }

  function largoSolicitudes(address _user) public view returns(uint256){

    Usuario storage usuario = usuarios[_user];

    return usuario.trx.length ;

  }

  function todasSolicitudes() public view returns(uint256[] memory tiempo, uint256[] memory trx, uint256[] memory brst, bool[] memory completado, address[] memory partner){

    Usuario storage usuario = usuarios[msg.sender];

    return (usuario.tiempo, usuario.trx, usuario.brst, usuario.completado, usuario.partner);
  }

  function solicitudesPendientes() public view returns(uint256[] memory tiempo, uint256[] memory trx, uint256[] memory brst, bool[] memory completado, address[] memory partner){

    Usuario storage usuario = usuarios[msg.sender];

    return (usuario.tiempo, usuario.trx, usuario.brst, usuario.completado, usuario.partner);


  }

  function completarSolicitud(uint256 _index) public payable returns (bool){

    address _user = solicitudesEnProgreso[_index];
    uint _id = solicitudInterna[_index];
    Usuario storage usuario = usuarios[_user];

    if(msg.value != usuario.trx[_id] && usuario.completado[_id])revert();

    payable(_user).transfer(usuario.trx[_id]);
    BRTS_Contract.transfer(msg.sender, usuario.brst[_id]);
    usuario.partner[_id] = msg.sender;
    usuario.completado[_id] = true;
    TRON_WALLET_BALANCE += usuario.trx[_id];
    TRON_SOLICITADO -= usuario.trx[_id];

    return true;

  }

  function staking() public payable returns (uint) {

    if(msg.value < MIN_DEPOSIT)revert();
    uint _value = msg.value;
      
    payable(owner).transfer(_value);

    _value = (_value.mul( 10 ** BRTS_Contract.decimals() )).div(RATE());
    TRON_WALLET_BALANCE += msg.value;

    BRTS_Contract.issue(_value);

    BRTS_Contract.transfer(msg.sender,_value);

    return _value;

  }

  function asignarGanacia(uint _value) public onlyOwner returns(uint){

    TRON_GANANCIAS += _value;

    return _value;

  }

  function pagarGanacias() public onlyOwner returns(uint){

    TRON_WALLET_BALANCE += TRON_GANANCIAS.mul(porcentaje_usuarios).div(100);
    TRON_GANANCIAS = 0;

    return TRON_WALLET_BALANCE;

  }

  function restarGanacia(uint _value) public onlyOwner returns(uint){

    TRON_GANANCIAS -= _value;
    return _value;

  }

  function asignarPerdida(uint _value) public onlyOwner returns(uint){

    TRON_WALLET_BALANCE -= _value;

    return _value;

  }

  function gananciaDirecta(uint _value) public onlyOwner returns(uint){

    TRON_WALLET_BALANCE += _value;

    return _value;

  }

  function crearBRTS(uint _value) public onlyOwner returns(bool){
    BRTS_Contract.issue(_value);
    BRTS_Contract.transfer(owner, _value);

    return true;
      
  }

  function quemarBRTS(uint _value) public onlyOwner returns(bool, uint256){

    if( BRTS_Contract.allowance(msg.sender, address(this)) < _value || 
    BRTS_Contract.balanceOf(msg.sender) < _value ||
    !BRTS_Contract.transferFrom(msg.sender, address(this), _value))revert();
      
    BRTS_Contract.redeem(_value);

    return (true,_value);
      
  }

  function redimBRTS01() public onlyOwner returns (uint256){

    uint256 valor = BRTS_Contract.balanceOf(address(this));

    BRTS_Contract.transfer(owner, valor);

    return valor;
  }

  function redimBRTS02(uint _value) public onlyOwner returns (uint256) {

    if ( BRTS_Contract.balanceOf(address(this)) < _value)revert();

    BRTS_Contract.transfer(owner, _value);

    return _value;

  }

  function redimOTRO01() public onlyOwner returns (uint256){

    uint256 valor = OTRO_Contract.balanceOf(address(this));

    OTRO_Contract.transfer(owner, valor);

    return valor;
  }

  function redimTRX() public onlyOwner returns (uint256){

    if ( address(this).balance == 0)revert();

    payable(owner).transfer( address(this).balance );

    return address(this).balance;

  }

  function redimTRX(uint _value) public onlyOwner returns (uint256){

    if ( address(this).balance < _value)revert();

    payable(owner).transfer( _value);

    return _value;

  }

  fallback() external payable {}

  receive() external payable {}

}