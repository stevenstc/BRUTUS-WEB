pragma solidity >=0.8.0;

// SPDX-License-Identifier: Apache-2.0 

interface ITRC20 {

    function allowance(address _owner, address _spender) external view returns (uint remaining);
    function transferFrom(address _from, address _to, uint _value) external returns (bool);
    function transfer(address direccion, uint cantidad) external returns (bool);
    function balanceOf(address who) external view returns (uint256);
    function decimals() external view returns(uint);
}

contract Ownable {
  address payable public owner;
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
  constructor(){
    owner = payable(msg.sender);
  }
  modifier onlyOwner() {
    if(msg.sender != owner)revert();
    _;
  }
  function transferOwnership(address payable newOwner) public onlyOwner {
    if(newOwner == address(0))revert();
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}

contract DinamicArray{
    
    function actualizarArray(address[] memory oldArray)public pure returns ( address[] memory) {

        //añade un espacio para un nuevo dato
        address[] memory newArray =   new address[](oldArray.length+1);
    
        for(uint i = 0; i < oldArray.length; i++){
            newArray[i] = oldArray[i];
        }
        
        return newArray;
    }

    function borrarArray(address[] memory oldArray)public pure returns ( address[] memory) {

        //borra los espacios que esten con address(0)
        address[] memory newArray;
        uint largo;

        for(uint i = 0; i < oldArray.length; i++){
            if(oldArray[i] != address(0)){
                newArray = actualizarArray(newArray);
                newArray[largo] = oldArray[i];
                largo++;
            }
        }
        
        return newArray;
    }

    function actualizarArrayNumber(uint256[] memory oldArray)public pure returns ( uint256[] memory) {

        //añade un espacio para un nuevo dato
        uint256[] memory newArray =   new uint256[](oldArray.length+1);
    
        for(uint i = 0; i < oldArray.length; i++){
            newArray[i] = oldArray[i];
        }
        
        return newArray;
    }

    function borrarArrayNumber(uint256[] memory oldArray)public pure returns ( uint256[] memory) {

        //borra los espacios que esten con 0
        uint256[] memory newArray;
        uint largo;

        for(uint i = 0; i < oldArray.length; i++){
            if(oldArray[i] != 0){
                newArray = actualizarArrayNumber(newArray);
                newArray[largo] = oldArray[i];
                largo++;
            }
        }
        
        return newArray;
    }
    

}

contract RandomNumber{

    uint randNonce = 0;

    function randMod(uint _modulus, uint _moreRandom) public view returns(uint){
       
       return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce, _moreRandom))) % _modulus;
    }

    function doneRandom() public {
      // increase nonce
       randNonce++; 

    }
}

contract Loteria is RandomNumber, DinamicArray, Ownable{

    address[] public bolsaPesonas;

    uint256 public precio = 25 * 10**6;

    uint256 public fin = 160002000;

    address public tokenTRC20;

    ITRC20 TRC20_Contract;

    function buyLoteria() public payable {

        bolsaPesonas.push(msg.sender);
        doneRandom();

    }

    function finalizarLoteria() public returns(uint256){
        uint256 myNumber = randMod(bolsaPesonas.length, precio);

    }

    function reclamarLoteria() public returns(uint256){
        for (uint256 index = 0; index < entregaNFT[msg.sender].length; index++) {
            TRC721_Contract.transferFrom(ownerNFTs, msg.sender, entregaNFT[msg.sender][index] );
        }
        
        return entregaNFT[msg.sender].length;
    }

  
    function update_tokenTRC20(address _tokenTRC20) public onlyOwner returns(bool){
        tokenTRC20 = _tokenTRC20;
        TRC20_Contract = ITRC20(_tokenTRC20);
        return true;
    }

    function update_precio(uint256 _precio) public onlyOwner returns(bool){
        precio = _precio;
        return true;
    }

    function retirar_TRC20_ALL()public onlyOwner returns(bool){
        return TRC20_Contract.transfer(msg.sender, TRC20_Contract.balanceOf(address(this)));
    }

    function retirar_TRC20(uint256 _cantidad)public onlyOwner returns(bool){
        return TRC20_Contract.transfer(msg.sender, _cantidad);
    }

}