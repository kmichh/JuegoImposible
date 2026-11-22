var tam;
var tablero;

var nombre;
var timer;
var segundos;

var columnaBlanca;
var filaBlanca;

var movimientos=0;

var terminado=false; 

function mezclarArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); 
	[array[i], array[j]] = [array[j], array[i]];
	}
}

function inicio()
{
	clearInterval(timer); 
	terminado=false;   

	nombre = prompt("Escribe tu nombre:");

	do {
	    tam = prompt("Cuantas casillas quieres por lado?\nEl valor tiene que ser mayor o igual a 3");

	    if (isNaN(tam) || tam < 3) {
	        alert("Por favor, ingresa un numero valido mayor o igual a 3.");
	    }
	} while (isNaN(tam) || tam < 3);

	tam = parseInt(tam); 


	tablero = new Array(tam);

	for(var i=0; i<tam; i++)
		tablero[i] = new Array(tam);
	var valor=0;

	
	let valores = Array.from({ length: tam*tam }, (_, i) => i); 
	mezclarArray(valores);
	console.log(valores);

	var cont=0;

	let tableroDiv = document.getElementById("tablero");
	const elemento = document.getElementById('tablero');

  tableroDiv.innerHTML = ""; 
  tableroDiv.style.gridTemplateColumns = `repeat(${tam}, 1fr)`; 


	for(var i=0; i<tam; i++){
		for(var j=0; j<tam; j++){
			tablero[i][j]=valores[cont];

			let casilla = document.createElement("div");
			casilla.id = `${i}${j}`;
			casilla.innerHTML= valores[cont];
			casilla.onclick= (function(x,y){
				return function() { moverCasilla(x,y);};
			})(i,j);


			if(valores[cont]==0){
				columnaBlanca=j;
				filaBlanca=i;
				casilla.style.backgroundColor = "white";
        casilla.style.color = "white";
			}
			tableroDiv.appendChild(casilla);
      cont++;	
		}
	}

	console.log(tablero);

	document.getElementsByClassName("nombre")[0].innerHTML = nombre;
	segundos=0;
	movimientos=0;
	document.getElementsByClassName("movimientos")[0].innerHTML = movimientos;

	document.getElementsByClassName("Tiempo")[0].innerHTML=segundos;
	timer = setInterval(
		function()
		{
			segundos++;
			document.getElementsByClassName("Tiempo")[0].innerHTML=segundos;
		},1000
	)
	
}

function moverCasilla(posI,posJ)
{
	if(terminado){
		return;
	}
	if((Math.abs(posI-filaBlanca)==1 && Math.abs(posJ-columnaBlanca)==0 )||(Math.abs(posI-filaBlanca)==0 && Math.abs(posJ-columnaBlanca)==1 )){
		intercambiarContenidoYEstilo(posI.toString()+posJ.toString(),filaBlanca.toString()+columnaBlanca.toString());
		var temp=tablero[posI][posJ];
		tablero[posI][posJ]=tablero[filaBlanca][columnaBlanca];
		tablero[filaBlanca][columnaBlanca]=temp;
		filaBlanca=parseInt(posI);
		columnaBlanca=parseInt(posJ);
		yaGano();
		console.log(tablero);
	}
}


function intercambiarContenidoYEstilo(id1, id2) {
  const div1 = document.getElementById(id1);
  const div2 = document.getElementById(id2);

  if (div1 && div2) {
    // Intercambiar contenido
    const tempContenido = div1.innerHTML;
    div1.innerHTML = div2.innerHTML;
    div2.innerHTML = tempContenido;

    const tempEstilo = div1.style.cssText;
    div1.style.cssText = div2.style.cssText;
    div2.style.cssText = tempEstilo;
    movimientos++;
    document.getElementsByClassName("movimientos")[0].innerHTML = movimientos;
  } else {
    console.error("Uno o ambos elementos no existen.");
  }
}

function ganoNormal()
{	
	let valorEsperado = 1;
	for (let i = 0; i < tam; i++) {
	    for (let j = 0; j < tam; j++) {
	      if (i === tam-1 && j === tam-1) {
	        if (tablero[i][j] !== 0) {
	          return false;
	        }
	      } else {
	        if (tablero[i][j] !== valorEsperado) {
	          return false;
	        }
	        valorEsperado++;
	      }
    	}
  }
  return true;
}

// caracol
function generarCaracol(n) {
	const m = Array.from({ length: n }, () => new Array(n).fill(0));
	let val = 1;
	let arriba = 0, abajo = n - 1, izq = 0, der = n - 1;

	while (arriba <= abajo && izq <= der) {
		for (let j = izq; j <= der; j++) m[arriba][j] = val++;
		arriba++;

		for (let i = arriba; i <= abajo; i++) m[i][der] = val++;
		der--;

		if (arriba <= abajo) {
			for (let j = der; j >= izq; j--) m[abajo][j] = val++;
			abajo--;
		}

		if (izq <= der) {
			for (let i = abajo; i >= arriba; i--) m[i][izq] = val++;
			izq++;
		}
	}

	// la última casilla del recorrido es el hueco (0)
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (m[i][j] === n * n) m[i][j] = 0;
		}
	}
	return m;
}

function ganoCaracol() {
	const objetivo = generarCaracol(tam);
	for (let i = 0; i < tam; i++) {
		for (let j = 0; j < tam; j++) {
			if (tablero[i][j] !== objetivo[i][j]) return false;
		}
	}
	return true;
}


function yaGano()
{
  const normal = ganoNormal();
  const caracol = ganoCaracol();

  if(normal || caracol){ 
  	terminado=true; 
  	clearInterval(timer);
  	const tipo = normal ? "en orden normal" : "en forma de caracol";
  	setTimeout(function() {
  		alert("Ganaste " + tipo + " en " + segundos + " segundos con " + movimientos + " movimientos");
  	}, 50);
  }
}