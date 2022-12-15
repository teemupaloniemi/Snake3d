let timer;
// kentta
const tiles = 10;
let alkiot = [];
let paikkaKentta = 0;
let paikkaMato = 0;


// ohjaus
let lastMove = 0;
let lastHorizontal = [-1, 0];
let lastVertical = -1;
let lastX = 0;
let lastY = 0;
let lastZ = 0;
let pisteet = 0;
let nopeus = 5;
let nopeusMuuttunut = false;

// animaatio
let visMato = [];
let vel = [1, 0, 0];
let omppu = [0, 0, 0];
let stars = [];



function luoKentta() {
	for (let kerros = -amount / 2; kerros < tiles / 2; kerros++) {
		for (let rivi = -amount / 2; rivi < tiles / 2; rivi++) {
			for (let sarake = -amount / 2; sarake < tiles / 2; sarake++) {
				alkiot[paikkaKentta] = [rivi, sarake, kerros, 0];
				paikkaKentta++;
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
function setLastXYZ(x, y, z) {
	lastX = x;
	lastY = y;
	lastZ = z;
}


/**
 * Lis�t��n matoon uusi palikka 
 * @param x uuden palikan x-koordinaatti
 * @param y uuden palikan y-koordinaatti
 * @param z uuden palikan z-koordinaatti
 */
function matoLisaaPalikka(x, y, z) {
	visMato[paikkaMato] = [x, y, z];
	paikkaMato++;
}


/**
 * Muutetaan noupeusvektoria joka ohjaa madon liiketta
 * @param x vektorin x-suuruus 
 * @param y vektorin y-suuruus 
 * @param z vektorin z-suuruus 
 */
function setVelocity(x, y, z) {
	vel = [x, y, z];
}


/**
 * Alustetaan mato ja kentta
 */
function alusta() {
	paikkaMato = 0;
	visMato = [];
	lastMove = 0;
	lastHorizontal = [-1, 0];
	lastVertical = -1;
	let puolivali = tiles / 2;
	setVelocity(1, 0, 0);
	matoLisaaPalikka(0, puolivali, puolivali);
	matoLisaaPalikka(1, puolivali, puolivali);
	matoLisaaPalikka(2, puolivali, puolivali);
	setLastXYZ(2, puolivali, puolivali);
}


/**
 * Piirret��n mato kentt��n 
 */
function piirraMato() {
	for (let i = 0; i < alkiot.length; i++) {
		alkiot[i][3] = 0;
	}
	for (let j = 0; j < visMato.length; j++) {
		for (let k = 0; k < alkiot.length; k++) {
			if (onMato(alkiot[k], visMato[j])) {
				alkiot[k] = [visMato[j][0], visMato[j][1], visMato[j][2], 1];
			} else if (onOmppu(alkiot[k])) {
				alkiot[k] = [omppu[0], omppu[1], omppu[2], 2];
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
function onMato(box, mato) {
	return box[0] == mato[0] && box[1] == mato[1] && box[2] == mato[2];
}


/**
 * Tarkistetaan vastaako annettu kent�n osa 
 * omenaa  
 * @param box kentan osa 
 * @return true jos ovat samat 
 */
function onOmppu(box) {
	return box[0] == omppu[0] && box[1] == omppu[1] && box[2] == omppu[2];
}


/**
 * Liikutetaan matoa velocity vektorin osoittamaan suuntaan 
 */
function liikutaMato() {
	lastX += vel[0];
	lastY += vel[1];
	lastZ += vel[2];
	if (onLaitonSiirto()) {
		pisteet = 0;
		nopeus = 5;
		nopeusMuuttunut = true;
		muutaNopeus();
		alusta();
		return;
	}
	if (syoOmpun(lastX, lastY, lastZ)) {
		pisteet += 1;
		updatePoints();
		if (pisteet > 0 && pisteet % 10 == 0) {
			if (nopeus < 10) {
				nopeus++;
				nopeusMuuttunut = true;
				muutaNopeus();
			}
		}
		luoOmppu();
	} else {
		visMato.splice(0, 1);
	}
	visMato.push([lastX, lastY, lastZ]);
	piirraMato();
}

document.addEventListener('keydown', (event) => { ohjaa(event.key) });
function ohjaa(key) {
	if (document.getElementById("ohjeet").innerHTML == "W-A-S-D-Q-E: Static") {
		// Vasen
		if (lastMove != "d" && key == "a") {
			lastMove = "a";
			setVelocity(-1, 0, 0);
		}
		// Oikee
		else if (lastMove != "a" && key == "d") {
			lastMove = "d";
			setVelocity(1, 0, 0);
		}
		// Ylos 
		else if (lastMove != "w" && key == "s") {
			lastMove = "s";
			setVelocity(0, -1, 0);
		}
		// Alas
		else if (lastMove != "s" && key == "w") {
			lastMove = "w";
			setVelocity(0, 1, 0);
		}
		else if (lastMove != "q" && key == "e") {
			lastMove = "e";
			setVelocity(0, 0, 1);
		}
		else if (lastMove != "e" && key == "q") {
			lastMove = "q";
			setVelocity(0, 0, -1);
		}
		liikutaMato();
		return;
	}
	//TODO: perspektiiviset ohjaukset

	// persp. vasen
	if (key == "a") {
		lastMove = "a";
		if (vel[2] == 0) {
			if (vel[0] == 1 && vel[1] == 0) {
				setVelocity(0, 1, 0);
			}
			else if (vel[0] == -1 && vel[1] == 0) {
				setVelocity(0, -1, 0);
			}
			else if (vel[0] == 0 && vel[1] == -1) {
				setVelocity(1, 0, 0);
			}
			else if (vel[0] == 0 && vel[1] == 1) {
				setVelocity(-1, 0, 0);
			}
		}
		else if (vel[2] == 1) {
			if (lastHorizontal[0] == 1 && lastHorizontal[1] == 0) {
				setVelocity(0, -1, 0);
			}
			else if (lastHorizontal[0] == -1 && lastHorizontal[1] == 0) {
				setVelocity(0, 1, 0);
			}
			else if (lastHorizontal[0] == 0 && lastHorizontal[1] == 1) {
				setVelocity(-1, 0, 0);
			}
			else if (lastHorizontal[0] == 0 && lastHorizontal[1] == -1) {
				setVelocity(1, 0, 0);
			}
		}
		else if (vel[2] == -1) {
			if (lastHorizontal[0] == 1 && lastHorizontal[1] == 0) {
				setVelocity(0, 1, 0);
			}
			else if (lastHorizontal[0] == -1 && lastHorizontal[1] == 0) {
				setVelocity(0, -1, 0);
			}
			else if (lastHorizontal[0] == 0 && lastHorizontal[1] == 1) {
				setVelocity(-1, 0, 0);
			}
			else if (lastHorizontal[0] == 0 && lastHorizontal[1] == -1) 7
			setVelocity(1, 0, 0);
		}
		liikutaMato();
		return;
	}

	//  persp.Oikee
	if (key == "d") {
		lastMove = "d";
		if (vel[2] == 0) {
			if (vel[0] == 1 && vel[1] == 0) {
				setVelocity(0, -1, 0);
			}
			else if (vel[0] == -1 && vel[1] == 0) {
				setVelocity(0, 1, 0);
			}
			else if (vel[0] == 0 && vel[1] == -1) {
				setVelocity(-1, 0, 0);
			}
			else if (vel[0] == 0 && vel[1] == 1) {
				setVelocity(1, 0, 0);
			}
		}
		else if (vel[2] == 1) {
			if (lastHorizontal[0] == 1 && lastHorizontal[1] == 0) {
				setVelocity(0, -1, 0);
			}
			else if (lastHorizontal[0] == -1 && lastHorizontal[1] == 0) {
				setVelocity(0, 1, 0);
			}
			else if (lastHorizontal[0] == 0 && lastHorizontal[1] == 1) {
				setVelocity(1, 0, 0);
			}
			else if (lastHorizontal[0] == 0 && lastHorizontal[1] == -1) {
				setVelocity(-1, 0, 0);
			}
		}
		else if (vel[2] == -1) {
			if (lastHorizontal[0] == 1 && lastHorizontal[1] == 0) {
				setVelocity(0, -1, 0);
			}
			else if (lastHorizontal[0] == -1 && lastHorizontal[1] == 0) {
				setVelocity(0, 1, 0);
			}
			else if (lastHorizontal[0] == 0 && lastHorizontal[1] == 1) {
				setVelocity(1, 0, 0);
			}
			else if (lastHorizontal[0] == 0 && lastHorizontal[1] == -1) {
				setVelocity(-1, 0, 0);
			}
		}
		lastHorizontal = [vel[0], vel[1]];
		liikutaMato();
		return;
	}

	//  persp. Ylos 
	if (key == "w") {
		lastMove == "w";
		if (vel[2] == 0) {
			if (lastVertical == 1) {
				setVelocity(0, 0, -1);
				lastVertical = -1;
			} else if (lastVertical == -1) {
				setVelocity(0, 0, 1);
				lastVertical = 1;
			}
		}
		else if (vel[2] == 1) {
			if (lastHorizontal[0] == 1 && lastHorizontal[1] == 0) {
				console.log(1)
				setVelocity(-1, 0, 0);
			}
			else if (lastHorizontal[0] == -1 && lastHorizontal[1] == 0) {
				console.log(2)
				setVelocity(1, 0, 0);
			}
			else if (lastHorizontal[0] == 0 && lastHorizontal[1] == 1) {
				console.log(3)
				setVelocity(0, -1, 0);
			}
			else if (lastHorizontal[0] == 0 && lastHorizontal[1] == -1) {
				console.log(4)
				setVelocity(0, 1, 0);
			}
		}
		else if (vel[2] == -1) {
			if (lastHorizontal[0] == 1 && lastHorizontal[1] == 0) {
				setVelocity(1, 0, 0);
			}
			else if (lastHorizontal[0] == -1 && lastHorizontal[1] == 0) {
				setVelocity(-1, 0, 0);
			}
			else if (lastHorizontal[0] == 0 && lastHorizontal[1] == 1) {
				setVelocity(0, 1, 0);
			}
			else if (lastHorizontal[0] == 0 && lastHorizontal[1] == -1) {
				setVelocity(0, -1, 0);
			}
		}
		liikutaMato();
		return;
	}

	//  persp. Alas
	if (key == "s") {
		lastMove = "s";
		if (vel[2] == 0) {
			if (lastVertical == 1) {
				setVelocity(0, 0, -1);
				lastVertical = -1;
			}
			else if (lastVertical == -1) {
				setVelocity(0, 0, 1);
				lastVertical = 1;
			}
		}
		else if (vel[2] == 1) {
			if (lastHorizontal[0] == 1 && lastHorizontal[1] == 0) {
				setVelocity(1, 0, 0);
			}
			else if (lastHorizontal[0] == -1 && lastHorizontal[1] == 0) {
				setVelocity(-1, 0, 0);
			}
			else if (lastHorizontal[0] == 0 && lastHorizontal[1] == 1) {
				setVelocity(0, 1, 0);
			}
			else if (lastHorizontal[0] == 0 && lastHorizontal[1] == -1) {
				setVelocity(0, -1, 0);
			}
		}
		else if (vel[2] == -1) {
			if (lastHorizontal[0] == 1 && lastHorizontal[1] == 0) {
				setVelocity(-1, 0, 0);
			}
			else if (lastHorizontal[0] == -1 && lastHorizontal[1] == 0) {
				setVelocity(1, 0, 0);
			}
			else if (lastHorizontal[0] == 0 && lastHorizontal[1] == 1) {
				setVelocity(0, 1, 0);
			}
			else if (lastHorizontal[0] == 0 && lastHorizontal[1] == -1) {
				setVelocity(0, -1, 0);
			}
		}
		liikutaMato();
		return;
	}
}


/**
 * Luodaan omena random xyz koordinaattiin kent�ll� 
 */
function luoOmppu() {
	let omppuX = Math.floor(Math.random() * tiles);
	let omppuY = Math.floor(Math.random() * tiles);
	let omppuZ = Math.floor(Math.random() * tiles);

	for (let i = 0; i < visMato.length; i++) {
		if (visMato[i][0] == omppuX && visMato[i][1] == omppuY && visMato[i][2] == omppuZ) {
			luoOmppu();
			return;
		}
	}
	omppu[0] = omppuX;
	omppu[1] = omppuY;
	omppu[2] = omppuZ;
}


/**
 * Tarkistetaan johtaako seuraava siirto omenan sy�ntiin 
 * @param x seuraava x-koordinaatti
 * @param y seuraava y-koordinaatti
 * @param z seuraava z-koordinaatti
 * @return true jos sy�d��n omppu 
 */
function syoOmpun(x, y, z) {
	return (x == omppu[0] && y == omppu[1] && z == omppu[2]);
}


/**
 * Tarkistetaan onko laiton siirto 
 * @return true jos on laiton siirto 
 */
function onLaitonSiirto() {
	if (lastY >= tiles || lastY < 0 || lastX >= tiles || lastX < 0 || lastZ >= tiles || lastZ < 0) {
		console.log("Osuit seinaan!");
		return true;
	}
	for (let i = 0; i < visMato.length; i++) {
		if (lastX == visMato[i][0] && lastY == visMato[i][1] && lastZ == visMato[i][2]) {
			console.log("Osuit itseesi!");
			return true;
		}
	}
	return false;

}


function pelaa() {
	alusta();
	luoKentta();
	muutaNopeus();
}


function muutaNopeus() {
	if (nopeusMuuttunut) {
		clearInterval(timer);
		nopeusMuuttunut = false;
	}
	timer = setInterval(() => {
		liikutaMato();
	}, (11 - nopeus) * 100);
}

//========================================================
// GUI

import * as THREE from './node_modules/three/build/three.module';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls'
const scene = new THREE.Scene();
const container = document.getElementById("game-frame");
const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const materialMato = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const materialOmppu = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const amount = 10; // map size amount*amount*amount

let renderer, camera;
let guiKentta = [];
let guiSeinat = [];
let colorWall = 0x000033;
let colorShadow = 0x552200;
let cameraReady = false;

init();

function init() {
	container.innerWidth = window.innerWidth
	container.innerHeight = window.innerHeight - 200;

	camera = new THREE.PerspectiveCamera(
		70,
		container.innerWidth / container.innerHeight,
		0.1,
		1000);
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 32 * amount;
	camera.lookAt(lastX, lastY, lastZ);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(container.innerWidth, container.innerHeight);
	container.appendChild(renderer.domElement);

	//new OrbitControls(camera, renderer.domElement);

	window.addEventListener('resize', onWindowResize);
	const aButton = document.getElementById("a");
	const sButton = document.getElementById("s");
	const dButton = document.getElementById("d");
	const wButton = document.getElementById("w");
	const qButton = document.getElementById("q");
	const eButton = document.getElementById("e");
	aButton.onclick = function () { ohjaa("a"); }
	sButton.onclick = function () { ohjaa("s"); }
	dButton.onclick = function () { ohjaa("d"); }
	wButton.onclick = function () { ohjaa("w"); }
	qButton.onclick = function () { ohjaa("q"); }
	eButton.onclick = function () { ohjaa("e"); }

	makeWalls();
	animate();
	createStars();
	pelaa();
}


function animate() {
	requestAnimationFrame(animate);
	moveStars();
	if (!cameraReady) {
		if (camera.position.z >= 1.6 * amount) {
			camera.position.z -= 0.8;
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

	for (let i = 0; i < visMato.length; i++) {
		let meshMato = new THREE.Mesh(geometry, materialMato);
		meshMato.position.x = visMato[i][0] - amount / 2;
		meshMato.position.y = visMato[i][1] - amount / 2;
		meshMato.position.z = visMato[i][2] - amount / 2;
		guiKentta[i] = meshMato;
	}

	let meshOmppu = new THREE.Mesh(geometry, materialOmppu);
	meshOmppu.position.x = omppu[0] - amount / 2;
	meshOmppu.position.y = omppu[1] - amount / 2;
	meshOmppu.position.z = omppu[2] - amount / 2;
	guiKentta[visMato.length] = meshOmppu;

	for (let j = 0; j < guiKentta.length; j++) {
		scene.add(guiKentta[j]);
	}
	lisaaApuviivat();
	renderer.render(scene, camera);
}


function updatePoints() {
	document.getElementById("points").innerHTML = pisteet;
}


function lisaaApuviivat() {
	if (pisteet == 128) {
		colorWall = 0x111111;
		colorShadow = 0x222222;
	}
	if (pisteet == 64) {
		colorWall = 0x200202;
		colorShadow = 0x010101;
	}
	if (pisteet == 32) {
		colorWall = 0x220022;
		colorShadow = 0x223000;
	}
	if (pisteet == 16) {
		colorWall = 0x000033;
		colorShadow = 0x552200;
	}
	if (pisteet == 8) {
		colorWall = 0x050505;
		colorShadow = 0x0202ff;
	}
	if (pisteet < 8) {
		colorWall = 0x000099;
		colorShadow = 0x000033;
	}

	for (let i = 0; i < guiSeinat.length; i++) {
		if (lastX == guiSeinat[i].position.x + amount / 2 || lastY == guiSeinat[i].position.y + amount / 2 || lastZ == guiSeinat[i].position.z + amount / 2) {
			guiSeinat[i].material.color.setHex(colorShadow);
		} else {
			guiSeinat[i].material.color.setHex(colorWall);
		}
	}
}


function onWindowResize() {
	container.innerWidth = window.innerWidth
	container.innerHeight = window.innerHeight - 200;
	camera.aspect = container.innerWidth / container.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(container.innerWidth, container.innerHeight);
}


function createStars() {
	for (let i = 0; i < 2048; i++) {
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
	let speed = nopeus;
	for (let i = 0; i < stars.length; i++) {
		stars[i].position.z += speed / 64 * speed;
		if (stars[i].position.z >= 256) stars[i].position.z = -256;
	}
}