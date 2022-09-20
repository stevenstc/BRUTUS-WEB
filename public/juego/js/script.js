document.getElementById('player').addEventListener("mouseover",sumarPuntos);

puntos = 0;
tiempo = 60;
lastTiempo = 60;
necesarios = 30;
function sumarPuntos(){
   puntos++;
   document.getElementById("puntos").innerHTML = "Encuentra Brutus | Puntos: <b>" + puntos + "  </b>";
   randNum =  Math.round(Math.random()*500);
   randNum2 =  Math.round(Math.random()*500);
   document.getElementById("player").style.marginTop =randNum + "px";
   document.getElementById("player").style.marginLeft =randNum2 + "px";
   if (tiempo == lastTiempo) {
      lastTiempo = tiempo;
   	puntos++;
   }else{
      lastTiempo = tiempo;
   }

}


function restarTiempo() {
	tiempo--;
	document.getElementById("tiempo").innerHTML = "&nbsp;&nbsp;&nbsp;Tiempo: "+tiempo; 
	if (tiempo == 0) {
		alert("Se acabo el tiempo hiciste "+puntos+" Pts");
		tiempo = 60;
		puntos = 0;
	}
}

setInterval(restarTiempo,1000);