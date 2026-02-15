

// START ENGINE
class SnakeEngine {
  constructor() {
    // kentta
    this.tiles = 10;
    this.alkiot = [];
    this.paikkaKentta = 0;
    this.paikkaMato = 0;

    // ohjaus
    this.lastMove = 0;
    this.lastHorizontal = [-1, 0];
    this.lastVertical = -1;
    this.lastX = 0;
    this.lastY = 0;
    this.lastZ = 0;
    this.pisteet = 0;
    this.nopeus = 5;
    this.timer;
    this.nopeusMuuttunut = false;

    // Muisti
    this.uusintaMenossa = false;
    this.mutkat = [];
    this.omput = [];

    // animaatio
    this.visMato = [];
    this.vel = [1, 0, 0];
    this.omppu = [];
  }

  /*
  * Luodaan kentta
  */
  luoKentta() {
    for (let kerros = -this.tiles / 2; kerros < this.tiles / 2; kerros++) {
      for (let rivi = -this.tiles / 2; rivi < this.tiles / 2; rivi++) {
        for (let sarake = -this.tiles / 2; sarake < this.tiles / 2; sarake++) {
          this.alkiot[this.paikkaKentta] = [rivi, sarake, kerros, 0];
          this.paikkaKentta++;
        }
      }
    }
  }


  /**
   * Asetetaan madon viimeisimm�n paikan xyz koorinaatit
   * @param x madon viimeisin x
   * @param y madon viimeisin y
   * @param z madon viimeisin z
   */
  setLastXYZ(x, y, z) {
    this.lastX = x;
    this.lastY = y;
    this.lastZ = z;
  }


  /**
   * Lis�t��n matoon uusi palikka
   * @param x uuden palikan x-koordinaatti
   * @param y uuden palikan y-koordinaatti
   * @param z uuden palikan z-koordinaatti
   */
  matoLisaaPalikka(x, y, z) {
    this.visMato[this.paikkaMato] = [x, y, z];
    this.paikkaMato++;
  }


  /**
   * Muutetaan noupeusvektoria joka ohjaa madon liiketta
   * @param x vektorin x-suuruus
   * @param y vektorin y-suuruus
   * @param z vektorin z-suuruus
   */
  setVelocity(x, y, z) {
    this.vel = [x, y, z];
  }

  /**
   * Alustetaan mato ja kentta
   */
  alusta() {
    this.pisteet = 0;
    this.nopeus = 5;
    this.nopeusMuuttunut = true;
    this.paikkaMato = 0;
    this.visMato = [];
    this.mutkat = [];
    this.omput = [];
    this.omppu = [0,1,3];
    this.lastMove = 0;
    this.lastHorizontal = [-1, 0];
    this.lastVertical = -1;
    const puolivali = this.tiles / 2;
    this.setVelocity(1, 0, 0);
    this.matoLisaaPalikka(0, puolivali, puolivali);
    this.matoLisaaPalikka(1, puolivali, puolivali);
    this.matoLisaaPalikka(2, puolivali, puolivali);
    this.setLastXYZ(2, puolivali, puolivali);
  }


  /**
   * Piirret��n mato kentt��n
   */
  piirraMato() {
    for (let i = 0; i < this.alkiot.length; i++) {
      this.alkiot[i][3] = 0;
    }
    for (let j = 0; j < this.visMato.length; j++) {
      for (let k = 0; k < this.alkiot.length; k++) {
        if (this.onMato(this.alkiot[k], this.visMato[j])) {
          this.alkiot[k] = [this.visMato[j][0], this.visMato[j][1], this.visMato[j][2], 1];
        } else if (this.onOmppu(this.alkiot[k])) {
          this.alkiot[k] = [this.omppu[0], this.omppu[1], this.omppu[2], 2];
        }
      }
    }
    draw();
  }


  /**
   * Tarkistetaan vastaako annettu kent�n osa
   * madon osaa
   * @param box kentan osa
   * @param mato madon osa
   * @return true jos ovat samat
   */
  onMato(box, mato) {
    return box[0] == mato[0] && box[1] == mato[1] && box[2] == mato[2];
  }


  /**
   * Tarkistetaan vastaako annettu kent�n osa
   * omenaa
   * @param box kentan osa
   * @return true jos ovat samat
   */
  onOmppu(box) {
    return box[0] == this.omppu[0] && box[1] == this.omppu[1] && box[2] == this.omppu[2];
  }


  /**
   * Liikutetaan matoa velocity vektorin osoittamaan suuntaan
   */
  liikutaMato() {
    if (this.uusintaMenossa) {
      console.log(this.visMato[this.paikkaMato-1], this.mutkat[0], this.mutkat[1], this.mutkat);
      if (this.visMato[this.paikkaMato-1][0] === this.mutkat[0][0]
          && this.visMato[this.paikkaMato-1][1] === this.mutkat[0][1]
          && this.visMato[this.paikkaMato-1][2] === this.mutkat[0][2]
          && this.mutkat.length > 1) {
        const diffx = this.mutkat[1][0] - this.mutkat[0][0];
        const diffy = this.mutkat[1][1] - this.mutkat[0][1];
        const diffz = this.mutkat[1][2] - this.mutkat[0][2];
        this.vel[0] = diffx === 0 ? 0 : (diffx > 0 ? 1 : -1);
        this.vel[1] = diffy === 0 ? 0 : (diffy > 0 ? 1 : -1);
        this.vel[2] = diffz === 0 ? 0 : (diffz > 0 ? 1 : -1);
        console.log(this.vel);
        this.mutkat.shift();
      }
    }
    this.lastX += this.vel[0];
    this.lastY += this.vel[1];
    this.lastZ += this.vel[2];
    if (this.onLaitonSiirto()) {

      /// Lopeta uusinta jos sellainen on menossa.
      if (this.uusintaMenossa) {
        this.mutkat = [];
        this.omput = [];
        this.uusintaMenossa = false;
      }

      /// Päivitä viimeisimmät pisteet.
      updatePoints()

      /// Näytä uusinta.
      this.uusinta(this.mutkat, this.omput);

      /// Päivitä UI.
      /// document.getElementById("submit").click();

      /// Alusta uutta peliä varten.
      /// this.alusta();
      /// this.muutaNopeus();
      return;
    }
    if (this.syoOmpun(this.lastX, this.lastY, this.lastZ)) {
      this.pisteet += 1;
      updatePoints(); //update in GUI
      if (this.pisteet > 0 && this.pisteet % 8 == 0) {
        if (this.nopeus < 10) {
          this.nopeus++;
          this.nopeusMuuttunut = true;
          this.muutaNopeus();
        }
      }
      this.luoOmppu();
    } else {
      this.visMato.splice(0, 1);
    }
    this.visMato.push([this.lastX, this.lastY, this.lastZ]);
    if (!this.uusintaMenossa) {
      this.mutkat.push([this.lastX, this.lastY, this.lastZ]);
    }
    this.piirraMato();
  }


  //connect eventListener to this
  //document.addEventListener('keydown', (event) => { this.ohjaa(event.key) });
  ohjaa(key) {
    // Vasen
    if (this.lastMove != "d" && key == "a") {
      this.lastMove = "a";
      this.setVelocity(-1, 0, 0);
    }
    // Oikee
    else if (this.lastMove != "a" && key == "d") {
      this.lastMove = "d";
      this.setVelocity(1, 0, 0);
    }
    // Ylos
    else if (this.lastMove != "w" && key == "s") {
      this.lastMove = "s";
      this.setVelocity(0, -1, 0);
    }
    // Alas
    else if (this.lastMove != "s" && key == "w") {
      this.lastMove = "w";
      this.setVelocity(0, 1, 0);
    }
    else if (this.lastMove != "q" && key == "e") {
      this.lastMove = "e";
      this.setVelocity(0, 0, 1);
    }
    else if (this.lastMove != "e" && key == "q") {
      this.lastMove = "q";
      this.setVelocity(0, 0, -1);
    }
    this.liikutaMato();
  }


  /**
   * Luodaan omena random xyz koordinaattiin kent�ll�
   */
  luoOmppu() {
    if (this.uusintaMenossa) {
      this.omppu = this.omput[0];
      this.omput.shift();
    } else {
      let omppuX = Math.floor(Math.random() * this.tiles);
      let omppuY = Math.floor(Math.random() * this.tiles);
      let omppuZ = Math.floor(Math.random() * this.tiles);

      for (let i = 0; i < this.visMato.length; i++) {
        if (this.visMato[i][0] == omppuX && this.visMato[i][1] == omppuY && this.visMato[i][2] == omppuZ) {
          this.luoOmppu();
          return;
        }
      }

      this.omppu[0] = omppuX;
      this.omppu[1] = omppuY;
      this.omppu[2] = omppuZ;

      this.omput.push(this.omppu);
    }
  }


  /**
   * Tarkistetaan johtaako seuraava siirto omenan sy�ntiin
   * @param x seuraava x-koordinaatti
   * @param y seuraava y-koordinaatti
   * @param z seuraava z-koordinaatti
   * @return true jos sy�d��n omppu
   */
  syoOmpun(x, y, z) {
    return (x == this.omppu[0] && y == this.omppu[1] && z == this.omppu[2]);
  }


  /**
   * Tarkistetaan onko laiton siirto
   * @return true jos on laiton siirto
   */
  onLaitonSiirto() {
    if (this.lastY >= this.tiles || this.lastY < 0 || this.lastX >= this.tiles || this.lastX < 0 || this.lastZ >= this.tiles || this.lastZ < 0) {
      console.log("Osuit seinaan!");
      return true;
    }
    for (let i = 0; i < this.visMato.length; i++) {
      if (this.lastX == this.visMato[i][0] && this.lastY == this.visMato[i][1] && this.lastZ == this.visMato[i][2]) {
        console.log("Osuit itseesi!");
        return true;
      }
    }
    return false;
  }


  /*
   * Changing the speed of the worm
   */
  muutaNopeus() {
    if (this.nopeusMuuttunut) {
      clearInterval(this.timer);
      this.nopeusMuuttunut = false;
    }
    this.timer = setInterval(() => {
      this.liikutaMato();
    }, (11 - this.nopeus) * 100);
  }


  /*
   * Aja tallennettu peli.
   */
  uusinta(mutkat, omput) {
    alert("Aloitetaan uusinta!");
    this.alusta();
    this.uusintaMenossa = true;
    this.omput = omput;
    this.mutkat = mutkat;
    this.muutaNopeus();
  }


  pelaa() {
    this.alusta();
    this.luoKentta();
    this.muutaNopeus();
  }
};

// END ENGINE
//========================================================
// START GUI

import * as THREE from './node_modules/three/build/three.module';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls'
const scene = new THREE.Scene();
const container = document.getElementById("game-frame");
const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const materialMato = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const materialOmppu = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const gameEngine = new SnakeEngine();
const amount = gameEngine.tiles; // map size amount*amount*amount

let renderer, camera;
let guiKentta = [];
let guiSeinat = [];
let colorWall = 0x000033;
let colorShadow = 0x552200;
let cameraReady = false;
let stars = [];
let name = "unknown";

function initialize3D() {
  container.innerWidth = window.innerWidth;
  container.innerHeight = window.innerHeight;
  camera = new THREE.PerspectiveCamera(
    70,
    container.innerWidth / container.innerHeight,
    0.1,
    1000);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 8 * amount;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.innerWidth, container.innerHeight);
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);

  document.addEventListener('keydown', (event) => {
    for (const letter of ["Q", "W", "E", "A", "S", "D"]) {
      if (event.key.toUpperCase() === letter)
        document.getElementById(letter).style.color = "rgb(255,0,0)";
      else
        document.getElementById(letter).style.color = "rgb(0,255,0)";
    }
    gameEngine.ohjaa(event.key);
  });

  makeWalls();
  animate();
  createStars();
  gameEngine.pelaa();
  getName();
}

// Taken from https://stackoverflow.com/questions/9628879/javascript-regex-username-validation
function isUserNameValid(username) {
  /*
    Usernames can only have:
    - Letters (A-Za-z)
    - Numbers (0-9)
    - Dots (.)
    - Underscores (_)
  */
  const res = /^[A-Za-z0-9_\.]+$/.exec(username);
  const valid = !!res;
  return valid;
}

function getName() {
  let tmp = localStorage.getItem("username");
  if (tmp === null) {
    tmp = prompt("Username", "unknown");
    if (tmp != null && isUserNameValid(tmp)) {
      name = tmp;
      document.getElementById("name").innerHTML = tmp;
      document.getElementById("name-post").value = tmp;
      localStorage.setItem("username", tmp);
    } else {
      alert("Käyttäjänimi ei sallittu! Säännöt:\n\n  - Kirjaimet (a-zA-z)\n  - Numerot (0-9)\n  - Piste (.)\n  - Alaviiva (_)");
    }
  } else {
      name = tmp;
      document.getElementById("name").innerHTML = tmp;
      document.getElementById("name-post").value = tmp;
  }
}


function animate() {
  requestAnimationFrame(animate);
  moveStars();
  if (!cameraReady) {
    if (camera.position.z >= 1.6 * amount) {
      camera.position.z -= 0.5;
    } else {
      new OrbitControls(camera, renderer.domElement);
      cameraReady = true;
    }
  }

  renderer.render(scene, camera);
}


function makeWalls() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  let listIndex = 0;
  for (let i = -amount / 2; i < amount - amount / 2; i++) {
    for (let j = -amount / 2; j < amount - amount / 2; j++) {
      let materialSeinayla = new THREE.MeshBasicMaterial({ color: 0x000099, wireframe: true });
      let meshWallyla = new THREE.Mesh(geometry, materialSeinayla);
      meshWallyla.position.x = j;
      meshWallyla.position.y = -1 - amount / 2;
      meshWallyla.position.z = i;
      scene.add(meshWallyla);

      let materialSeinaala = new THREE.MeshBasicMaterial({ color: 0x000099, wireframe: true });
      let meshWallala = new THREE.Mesh(geometry, materialSeinaala);
      meshWallala.position.x = j;
      meshWallala.position.y = amount - amount / 2;
      meshWallala.position.z = i;
      scene.add(meshWallala);

      let materialSeinavas = new THREE.MeshBasicMaterial({ color: 0x000099, wireframe: true });
      let meshWallvas = new THREE.Mesh(geometry, materialSeinavas);
      meshWallvas.position.x = -1 - amount / 2;
      meshWallvas.position.y = j;
      meshWallvas.position.z = i;
      scene.add(meshWallvas);

      let materialSeinaoik = new THREE.MeshBasicMaterial({ color: 0x000099, wireframe: true });
      let meshWalloik = new THREE.Mesh(geometry, materialSeinaoik);
      meshWalloik.position.x = amount / 2;
      meshWalloik.position.y = j;
      meshWalloik.position.z = i;
      scene.add(meshWalloik);

      let materialSeinabot = new THREE.MeshBasicMaterial({ color: 0x000099, wireframe: true });
      let meshWallbot = new THREE.Mesh(geometry, materialSeinabot);
      meshWallbot.position.x = j;
      meshWallbot.position.y = i;
      meshWallbot.position.z = -1 - amount / 2;
      scene.add(meshWallbot);

      guiSeinat[listIndex] = meshWallyla;
      listIndex++;
      guiSeinat[listIndex] = meshWallala;
      listIndex++;
      guiSeinat[listIndex] = meshWallvas;
      listIndex++;
      guiSeinat[listIndex] = meshWalloik;
      listIndex++;
      guiSeinat[listIndex] = meshWallbot;
      listIndex++;
    }
  }
}

function draw() {
  for (let k = 0; k < guiKentta.length; k++) {
    scene.remove(guiKentta[k]);
  }

  guiKentta = [];

  for (let i = 0; i < gameEngine.visMato.length; i++) {
    let meshMato = new THREE.Mesh(geometry, materialMato);
    meshMato.position.x = gameEngine.visMato[i][0] - amount / 2;
    meshMato.position.y = gameEngine.visMato[i][1] - amount / 2;
    meshMato.position.z = gameEngine.visMato[i][2] - amount / 2;
    guiKentta[i] = meshMato;
  }

  let meshOmppu = new THREE.Mesh(geometry, materialOmppu);
  meshOmppu.position.x = gameEngine.omppu[0] - amount / 2;
  meshOmppu.position.y = gameEngine.omppu[1] - amount / 2;
  meshOmppu.position.z = gameEngine.omppu[2] - amount / 2;
  guiKentta[gameEngine.visMato.length] = meshOmppu;

  for (let j = 0; j < guiKentta.length; j++) {
    scene.add(guiKentta[j]);
  }
  lisaaApuviivat();
  renderer.render(scene, camera);
}


function updatePoints() {
  document.getElementById("points").value = gameEngine.pisteet;
}


function lisaaApuviivat() {
  if (gameEngine.pisteet == 128) {
    colorWall = 0x111111;
    colorShadow = 0x222222;
  }
  if (gameEngine.pisteet == 64) {
    colorWall = 0x200202;
    colorShadow = 0x010101;
  }
  if (gameEngine.pisteet == 32) {
    colorWall = 0x220022;
    colorShadow = 0x223000;
  }
  if (gameEngine.pisteet == 16) {
    colorWall = 0x000033;
    colorShadow = 0x552200;
  }
  if (gameEngine.pisteet == 8) {
    colorWall = 0x050505;
    colorShadow = 0x0202ff;
  }
  if (gameEngine.pisteet < 8) {
    colorWall = 0x000099;
    colorShadow = 0x000033;
  }

  for (let i = 0; i < guiSeinat.length; i++) {
    if (gameEngine.lastX == guiSeinat[i].position.x + amount / 2 || gameEngine.lastY == guiSeinat[i].position.y + amount / 2 || gameEngine.lastZ == guiSeinat[i].position.z + amount / 2) {
      guiSeinat[i].material.color.setHex(colorShadow);
    } else {
      guiSeinat[i].material.color.setHex(colorWall);
    }
  }
}


function onWindowResize() {
  container.innerWidth = window.innerWidth;
  container.innerHeight = window.innerHeight;
  camera.aspect = container.innerWidth / container.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.innerWidth, container.innerHeight);
}


function createStars() {
  for (let i = 0; i < 1024; i++) {
    let x = Math.random() * 512 - 256;
    let y = Math.random() * 512 - 256;
    let z = Math.random() * 512 - 256;
    let star = new THREE.Mesh(new THREE.SphereGeometry(.2), new THREE.MeshBasicMaterial());
    star.position.x = x;
    star.position.y = y;
    star.position.z = z;
    stars[i] = star;
    scene.add(star);
  }
}

function moveStars() {
  let speed = gameEngine.nopeus;
  for (let i = 0; i < stars.length; i++) {
    stars[i].position.z += speed / 64 * speed;
    if (stars[i].position.z >= 256) stars[i].position.z = -256;
  }
}

function displayLeaderboard() {
    fetch("tulokset.txt")
        .then(response => response.text())
        .then(fileContent => {
            const lines = fileContent.split("\n");
            const tbody = document.getElementById("leaderboard-table");
            tbody.innerHTML = '';
            tbody.innerHTML += "<caption>Top 10</caption>"

            lines.sort((a, b) => {
                const scoreA = parseInt(a.split(" | ")[1]);
                const scoreB = parseInt(b.split(" | ")[1]);
                return scoreB - scoreA;
            });

            lines.filter((a) => { return a.length > 0 }).slice(0,11).forEach(line => {
                const [name, score] = line.split(" | ").map(s => s.trim());
                if (name && score) {
                    tbody.innerHTML += `<tr><td>${name}</td><td>${score}</td></tr>`;
                }
            });
        })
        .catch(error => console.error("Error fetching file:", error));
}

function updateUsername() {
  localStorage.removeItem("username");
  getName();
}

function initializePage() {

  // Initialize the 3D graphics.
  initialize3D();

  // Bind username update to button.
  document.getElementById("change-username-btn").onclick = updateUsername;

  // Bind update method to form.
  let form = document.getElementById("points-form");
  function handleForm(event) {
    event.preventDefault();
    let formData = new FormData(form);
    if (formData.get("points") !== "0") {
      fetch('submit.php', {
          method: 'POST',
          body: formData,
      });
    }
  }
  form.addEventListener('submit', handleForm);

  // Read and update latest leaderboard.
  displayLeaderboard();
};


window.onload = initializePage();
