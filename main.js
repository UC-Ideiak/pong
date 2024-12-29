const zonaJuego = document.getElementById("zonaJuego");
const mensajeElement = document.getElementById("mensaje");
const instruccionesElement = document.getElementById("instrucciones");

let bola;
let estadoJuego = "PAUSA";

class Paleta {
  elemento;
  ordenada = 0;
  velocidad = 15;
  movPaleta;
  longitud = 200;
  anchoPaleta = 20;

  constructor() {
    this.elemento = document.createElement("div");
    this.elemento.classList = "paleta";
    zonaJuego.appendChild(this.elemento);
    this.resetPosicion();
  }

  bajar() {
    if (!this.movPaleta) {
      this.movPaleta = setInterval(() => {
        this.ordenada = this.ordenada + this.velocidad;
        if (this.ordenada > document.body.clientHeight - this.longitud) {
          this.ordenada = document.body.clientHeight - this.longitud;
          this.parar();
        }
        this.elemento.style.top = this.ordenada + "px";
      }, 20);
    }
  }

  subir() {
    if (!this.movPaleta) {
      this.movPaleta = setInterval(() => {
        this.ordenada = this.ordenada - this.velocidad;
        if (this.ordenada < 0) {
          this.ordenada = 0;
          this.parar();
        }

        this.elemento.style.top = this.ordenada + "px";
      }, 20);
    }
  }

  parar() {
    clearInterval(this.movPaleta);
    this.movPaleta = undefined;
  }

  resetPosicion() {
    this.ordenada = document.body.clientHeight / 2 - this.longitud / 2;
    this.elemento.style.top = this.ordenada + "px";
  }
}

class Bola {
  elemento;
  abscisaBola;
  ordenadaBola;
  radioBola = 15;
  velocidadX = -20 ;
  velocidadY = 0;
  movBola;

  constructor() {
    this.elemento = document.createElement("div");
    this.elemento.classList = "bola";
    zonaJuego.appendChild(this.elemento);
    this.resetPosicion();
    this.mover();
    mensajeElement.classList.toggle("oculta", true);
    instruccionesElement.classList.toggle("oculta", true);
    estadoJuego = "PLAY";
  }

  mover() {
    if (!this.movBola) {
      this.movBola = setInterval(() => {
        // Choque con paletas

        // Paleta JUgador 1
        if (
          this.abscisaBola < jugador1.anchoPaleta &&
          this.ordenadaBola + this.radioBola*2 > jugador1.ordenada &&
          this.ordenadaBola < jugador1.ordenada + jugador1.longitud
        ) {
          this.velocidadX = this.velocidadX * -1;
          this.velocidadY -= this.rebote(jugador1);
        }

        // Paleta Jugador 2
        if (
          this.abscisaBola + this.radioBola * 2 >
            document.body.clientWidth - jugador2.anchoPaleta &&
          this.ordenadaBola + this.radioBola*2 > jugador2.ordenada &&
          this.ordenadaBola  < jugador2.ordenada + jugador2.longitud
        ) {
          this.velocidadX = this.velocidadX * -1;
          this.velocidadY -= this.rebote(jugador2);
        }

        // Meter punto
        if (
          this.abscisaBola < 0 ||
          this.abscisaBola > document.body.clientWidth - this.radioBola * 2
        ) {
          marcador.sumarPunto(this.abscisaBola < 0 ? 2 : 1);
          bola.eliminarBola();
        }
        // Movimiento horizontal
        this.abscisaBola = this.abscisaBola + this.velocidadX;
        this.elemento.style.left = this.abscisaBola + "px";

        // Movimiento vertical
        if (
          this.ordenadaBola < 0 ||
          this.ordenadaBola > document.body.clientHeight - this.radioBola * 2
        ) {
          this.velocidadY = this.velocidadY * -1;
          
        } 
        this.ordenadaBola = this.ordenadaBola + this.velocidadY;
        this.elemento.style.top = this.ordenadaBola + "px";
      }, 19);
    }
  }

  resetPosicion() {
    this.abscisaBola = document.body.clientWidth / 2 - this.radioBola;
    this.elemento.style.left = this.abscisaBola + "px";
    this.ordenadaBola = document.body.clientHeight / 2 - this.radioBola;
    this.elemento.style.top = this.ordenadaBola + "px";
  }

  eliminarBola() {
    clearInterval(this.movBola);
    this.movBola = undefined;
    zonaJuego.removeChild(this.elemento);
    bola = undefined;
  }

  rebote(jugador) {
    const zonaRebote =
      jugador.ordenada +
      jugador.longitud / 2 -
      (this.ordenadaBola + this.radioBola);
    return zonaRebote / 10 ;
  }
}

class Marcador {
  puntosJugador1 = 0;
  puntosJugador2 = 0;
  puntuacionMaxima = 5;

  constructor() {
    this.elemento = document.createElement("p");
    this.elemento.id = "marcador";
    zonaJuego.appendChild(this.elemento);
    this.actualizarMarcador();
  }

  actualizarMarcador() {
    this.elemento.textContent =
      this.puntosJugador1 + " - " + this.puntosJugador2;
  }

  sumarPunto(jugador) {
    if (jugador === 1) this.puntosJugador1++;
    else this.puntosJugador2++;
    jugador1.resetPosicion();
    jugador2.resetPosicion();
    this.actualizarMarcador();
    mensajeElement.textContent = "Presiona espacio para continuar";
    mensajeElement.classList.toggle("oculta", false);

    if (this.puntosJugador1 >= this.puntuacionMaxima) {
      this.ganar(jugador);
    } else if (this.puntosJugador2 >= this.puntuacionMaxima) {
      this.ganar(jugador);
    }
  }
  ganar(jugador) {
    if (jugador == 2) mensajeElement.textContent = "LUCÍA es la GANADORA";
    else mensajeElement.textContent = "Jugador: " + jugador + " *** GANA ***";
    estadoJuego = "FIN";
  }

  reset() {
    this.puntosJugador1 = 0;
    this.puntosJugador2 = 0;
    this.actualizarMarcador();
  }
}
document.addEventListener("keydown", (evento) => {
  switch (evento.key) {
    case "w":
      jugador1.subir();
      break;
    case "s":
      jugador1.bajar();
      break;
    case "ArrowUp":
      jugador2.subir();
      break;
    case "ArrowDown":
      jugador2.bajar();
      break;
    case " ":
      if (estadoJuego === "FIN") marcador.reset();
      if (!bola) bola = new Bola();
      break;
  }
});
document.addEventListener("keyup", (evento) => {
  switch (evento.key) {
    case "w":
    case "s":
      jugador1.parar();
      break;
    case "ArrowUp":
    case "ArrowDown":
      jugador2.parar();
      break;
  }
});

const jugador1 = new Paleta();
const jugador2 = new Paleta();

// let  bola = new Bola();
const marcador = new Marcador();
