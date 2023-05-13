

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

		// animaatio
		this.visMato = [];
		this.vel = [1, 0, 0];
		this.omppu = [0, 0, 0];
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
		this.paikkaMato = 0;
		this.visMato = [];
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
		this.lastX += this.vel[0];
		this.lastY += this.vel[1];
		this.lastZ += this.vel[2];
		if (this.onLaitonSiirto()) {
			updateLeaderboard();
			this.pisteet = 0;
			this.nopeus = 5;
			this.nopeusMuuttunut = true;
			this.muutaNopeus();
			this.alusta();
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
		this.piirraMato();
	}



	//connect eventListener to this
	//document.addEventListener('keydown', (event) => { this.ohjaa(event.key) });
	ohjaa(key) {
		if (document.getElementById("ohjeet").innerHTML == "W-A-S-D-Q-E: Static") {
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
			return;
		}

		// persp. vasen
		if (key == "a") {
			this.lastMove = "a";
			if (this.vel[2] == 0) {
				if (this.vel[0] == 1 && this.vel[1] == 0) {
					this.setVelocity(0, 1, 0);
				}
				else if (this.vel[0] == -1 && this.vel[1] == 0) {
					this.setVelocity(0, -1, 0);
				}
				else if (this.vel[0] == 0 && this.vel[1] == -1) {
					this.setVelocity(1, 0, 0);
				}
				else if (this.vel[0] == 0 && this.vel[1] == 1) {
					this.setVelocity(-1, 0, 0);
				}
			}
			else if (this.vel[2] == 1) {
				if (this.lastHorizontal[0] == 1 && this.lastHorizontal[1] == 0) {
					this.setVelocity(0, -1, 0);
				}
				else if (this.lastHorizontal[0] == -1 && this.lastHorizontal[1] == 0) {
					this.setVelocity(0, 1, 0);
				}
				else if (this.lastHorizontal[0] == 0 && this.lastHorizontal[1] == 1) {
					this.setVelocity(-1, 0, 0);
				}
				else if (this.lastHorizontal[0] == 0 && this.lastHorizontal[1] == -1) {
					this.setVelocity(1, 0, 0);
				}
			}
			else if (this.vel[2] == -1) {
				if (this.lastHorizontal[0] == 1 && this.lastHorizontal[1] == 0) {
					this.setVelocity(0, 1, 0);
				}
				else if (this.lastHorizontal[0] == -1 && this.lastHorizontal[1] == 0) {
					this.setVelocity(0, -1, 0);
				}
				else if (this.lastHorizontal[0] == 0 && this.lastHorizontal[1] == 1) {
					this.setVelocity(-1, 0, 0);
				}
				else if (this.lastHorizontal[0] == 0 && this.lastHorizontal[1] == -1) 7
				this.setVelocity(1, 0, 0);
			}
			this.liikutaMato();
			return;
		}

		//  persp.Oikee
		if (key == "d") {
			this.lastMove = "d";
			if (this.vel[2] == 0) {
				if (this.vel[0] == 1 && this.vel[1] == 0) {
					this.setVelocity(0, -1, 0);
				}
				else if (this.vel[0] == -1 && this.vel[1] == 0) {
					this.setVelocity(0, 1, 0);
				}
				else if (this.vel[0] == 0 && this.vel[1] == -1) {
					this.setVelocity(-1, 0, 0);
				}
				else if (this.vel[0] == 0 && this.vel[1] == 1) {
					this.setVelocity(1, 0, 0);
				}
			}
			else if (this.vel[2] == 1) {
				if (this.lastHorizontal[0] == 1 && this.lastHorizontal[1] == 0) {
					this.setVelocity(0, -1, 0);
				}
				else if (this.lastHorizontal[0] == -1 && this.lastHorizontal[1] == 0) {
					this.setVelocity(0, 1, 0);
				}
				else if (this.lastHorizontal[0] == 0 && this.lastHorizontal[1] == 1) {
					this.setVelocity(1, 0, 0);
				}
				else if (this.lastHorizontal[0] == 0 && this.lastHorizontal[1] == -1) {
					this.setVelocity(-1, 0, 0);
				}
			}
			else if (this.vel[2] == -1) {
				if (this.lastHorizontal[0] == 1 && this.lastHorizontal[1] == 0) {
					this.setVelocity(0, -1, 0);
				}
				else if (this.lastHorizontal[0] == -1 && this.lastHorizontal[1] == 0) {
					this.setVelocity(0, 1, 0);
				}
				else if (this.lastHorizontal[0] == 0 && this.lastHorizontal[1] == 1) {
					this.setVelocity(1, 0, 0);
				}
				else if (this.lastHorizontal[0] == 0 && this.lastHorizontal[1] == -1) {
					this.setVelocity(-1, 0, 0);
				}
			}
			this.lastHorizontal = [this.vel[0], this.vel[1]];
			this.liikutaMato();
			return;
		}

		//  persp. Ylos 
		if (key == "w") {
			this.lastMove == "w";
			if (this.vel[2] == 0) {
				if (this.lastVertical == 1) {
					this.setVelocity(0, 0, -1);
					this.lastVertical = -1;
				} else if (this.lastVertical == -1) {
					this.setVelocity(0, 0, 1);
					this.lastVertical = 1;
				}
			}
			else if (this.vel[2] == 1) {
				if (this.lastHorizontal[0] == 1 && this.lastHorizontal[1] == 0) {
					console.log(1)
					this.setVelocity(-1, 0, 0);
				}
				else if (this.lastHorizontal[0] == -1 && this.lastHorizontal[1] == 0) {
					console.log(2)
					this.setVelocity(1, 0, 0);
				}
				else if (this.lastHorizontal[0] == 0 && this.lastHorizontal[1] == 1) {
					console.log(3)
					this.setVelocity(0, -1, 0);
				}
				else if (this.lastHorizontal[0] == 0 && this.lastHorizontal[1] == -1) {
					console.log(4)
					this.setVelocity(0, 1, 0);
				}
			}
			else if (this.vel[2] == -1) {
				if (this.lastHorizontal[0] == 1 && this.lastHorizontal[1] == 0) {
					this.setVelocity(1, 0, 0);
				}
				else if (this.lastHorizontal[0] == -1 && this.lastHorizontal[1] == 0) {
					this.setVelocity(-1, 0, 0);
				}
				else if (this.lastHorizontal[0] == 0 && this.lastHorizontal[1] == 1) {
					this.setVelocity(0, 1, 0);
				}
				else if (this.lastHorizontal[0] == 0 && this.lastHorizontal[1] == -1) {
					this.setVelocity(0, -1, 0);
				}
			}
			this.liikutaMato();
			return;
		}

		//  persp. Alas
		if (key == "s") {
			this.lastMove = "s";
			if (this.vel[2] == 0) {
				if (this.lastVertical == 1) {
					this.setVelocity(0, 0, -1);
					this.lastVertical = -1;
				}
				else if (this.lastVertical == -1) {
					this.setVelocity(0, 0, 1);
					this.lastVertical = 1;
				}
			}
			else if (this.vel[2] == 1) {
				if (this.lastHorizontal[0] == 1 && this.lastHorizontal[1] == 0) {
					this.setVelocity(1, 0, 0);
				}
				else if (this.lastHorizontal[0] == -1 && this.lastHorizontal[1] == 0) {
					this.setVelocity(-1, 0, 0);
				}
				else if (this.lastHorizontal[0] == 0 && this.lastHorizontal[1] == 1) {
					this.setVelocity(0, 1, 0);
				}
				else if (this.lastHorizontal[0] == 0 && this.lastHorizontal[1] == -1) {
					this.setVelocity(0, -1, 0);
				}
			}
			else if (this.vel[2] == -1) {
				if (this.lastHorizontal[0] == 1 && this.lastHorizontal[1] == 0) {
					this.setVelocity(-1, 0, 0);
				}
				else if (this.lastHorizontal[0] == -1 && this.lastHorizontal[1] == 0) {
					this.setVelocity(1, 0, 0);
				}
				else if (this.lastHorizontal[0] == 0 && this.lastHorizontal[1] == 1) {
					this.setVelocity(0, 1, 0);
				}
				else if (this.lastHorizontal[0] == 0 && this.lastHorizontal[1] == -1) {
					this.setVelocity(0, -1, 0);
				}
			}
			this.liikutaMato();
			return;
		}
	}


	/**
	 * Luodaan omena random xyz koordinaattiin kent�ll� 
	 */
	luoOmppu() {
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
	* Changiing the speed of the worm
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

init();

function init() {
	container.innerWidth = window.innerWidth
	container.innerHeight = window.innerHeight
	if (document.getElementById("a").style.visibility == "vivible") container.innerHeight = window.innerHeight - 200;

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

	//new OrbitControls(camera, renderer.domElement);

	window.addEventListener('resize', onWindowResize);

	document.getElementById("a").onclick = function () { gameEngine.ohjaa("a"); }
	document.getElementById("s").onclick = function () { gameEngine.ohjaa("s"); }
	document.getElementById("d").onclick = function () { gameEngine.ohjaa("d"); }
	document.getElementById("w").onclick = function () { gameEngine.ohjaa("w"); }
	document.getElementById("q").onclick = function () { gameEngine.ohjaa("q"); }
	document.getElementById("e").onclick = function () { gameEngine.ohjaa("e"); }

	document.addEventListener('keydown', (event) => { gameEngine.ohjaa(event.key) });
	document.getElementById("btn").onclick = function () { changeControls(); onWindowResize(); }
	makeWalls();
	animate();
	createStars();
	gameEngine.pelaa();
	getName();
}
function getName() {
	let person = prompt("Please enter your name", "unknown");
	if (person != null) {
		name = person.substring(0, 10);
	}
}

let count = 0;
function changeControls() {
	if (count % 2 == 0) {
		document.getElementById("a").style.visibility = "visible";
		document.getElementById("s").style.visibility = "visible";
		document.getElementById("d").style.visibility = "visible";
		document.getElementById("w").style.visibility = "visible";
		document.getElementById("q").style.visibility = "visible";
		document.getElementById("e").style.visibility = "visible";
		count++;
		return;
	}
	document.getElementById("a").style.visibility = "hidden";
	document.getElementById("s").style.visibility = "hidden";
	document.getElementById("d").style.visibility = "hidden";
	document.getElementById("w").style.visibility = "hidden";
	document.getElementById("q").style.visibility = "hidden";
	document.getElementById("e").style.visibility = "hidden";
	count++;
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
	document.getElementById("points").innerHTML = gameEngine.pisteet;
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
	container.innerWidth = window.innerWidth
	container.innerHeight = window.innerHeight
	if (document.getElementById("a").style.visibility == "visible") container.innerHeight = window.innerHeight - 200;
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

function updateLeaderboard() {
	let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
	leaderboard.push({ name: name, score: gameEngine.pisteet });
	leaderboard.sort((a, b) => b.score - a.score);
	localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
	displayLeaderboard();
}

function displayLeaderboard() {
	let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
	let table = document.getElementById("leaderboard-table");
	table.innerHTML = "";
	for (let i = 0; i < Math.min(3, leaderboard.length); i++) {
		let row = table.insertRow(i);
		let nameCell = row.insertCell(0);
		let scoreCell = row.insertCell(1);
		nameCell.innerHTML = leaderboard[i].name;
		scoreCell.innerHTML = leaderboard[i].score;
	}
}

window.onload = function () {
	displayLeaderboard();
	updateLeaderboard();
};

