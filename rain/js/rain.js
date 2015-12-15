/*

code source: http://codepen.io/Sheepeuh/pen/cFazd
sound effects source: http://www.freesound.org/people/mlaramie/sounds/193875/
*/

requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
	window.setTimeout(callback, 1000/60);
};
})();

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var width = 0;
var height = 0;

window.onresize = function onresize() {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;
}

window.onresize();

var mouse = {
	X : 0,
	Y : 0
}

var particules = [];
var gouttes = [];
var nombrebase = 5;
var nombreb = 2;

var controls = {
	rain : 2,
	Object : "Nothing",
	alpha : 1,
	color : 250,
	auto : false,
	opacity : 1,
	saturation : 100,
	lightness : 100,
	back : 100,
	red : 0,
	green : 0,
	blue : 0,
	multi : false, // false
	speed : 1
};

if( Dolby.checkDDPlus() === true ) {
	controls.multi = true;
	controls.lightness = 75;
}

function Rain(X, Y, nombre) {
	if (!nombre) {
		nombre = nombreb;
	}
	while (nombre--) {
		particules.push( 
		{
			vitesseX : (Math.random() * 0.25),
			vitesseY : (Math.random() * 9) + 1,
			X : X,
			Y : Y,
			alpha : 1,
			couleur : "hsla(" + controls.color + "," + controls.saturation + "%, " + controls.lightness + "%," + controls.opacity + ")",
		})
	}
}

function explosion(X, Y, couleur, nombre) {
	if (!nombre) {
		nombre = nombrebase;
	}
	while (nombre--) {
		gouttes.push( 
		{
			vitesseX : (Math.random() * 4-2	),
			vitesseY : (Math.random() * -4 ),
			X : X,
			Y : Y,
			radius : 0.65 + Math.floor(Math.random() *1.6),
			alpha : 1,
			couleur : couleur
		})
	}
}

function rendu(ctx) {

	if (controls.multi == true) {
		controls.color = Math.random()*360;
	}

	ctx.save();
	ctx.fillStyle = 'rgba('+controls.red+','+controls.green+','+controls.blue+',' + controls.alpha + ')';
	ctx.fillRect(0, 0, width, height);
	
	var particuleslocales = particules;
	var goutteslocales = gouttes;
	var tau = Math.PI * 2;

	for (var i = 0, particulesactives; particulesactives = particuleslocales[i]; i++) {
			
		ctx.globalAlpha = particulesactives.alpha;
		ctx.fillStyle = particulesactives.couleur;
		ctx.fillRect(particulesactives.X, particulesactives.Y, particulesactives.vitesseY/4, particulesactives.vitesseY);
	}

	for (var i = 0, gouttesactives; gouttesactives = goutteslocales[i]; i++) {
			
		ctx.globalAlpha = gouttesactives.alpha;
		ctx.fillStyle = gouttesactives.couleur;
		
		ctx.beginPath();
		ctx.arc(gouttesactives.X, gouttesactives.Y, gouttesactives.radius, 0, tau);
		ctx.fill();
	}
		ctx.strokeStyle = "white";
		ctx.lineWidth   = 2;

	ctx.restore();
	
}

function update() {

	var particuleslocales = particules;
	var goutteslocales = gouttes;
	
	for (var i = 0, particulesactives; particulesactives = particuleslocales[i]; i++) {
		particulesactives.X += particulesactives.vitesseX;
		particulesactives.Y += particulesactives.vitesseY+5;
		if (particulesactives.Y > height-15) {
			particuleslocales.splice(i--, 1);
			explosion(particulesactives.X, particulesactives.Y, particulesactives.couleur);
		}
	}

	for (var i = 0, gouttesactives; gouttesactives = goutteslocales[i]; i++) {
		gouttesactives.X += gouttesactives.vitesseX;
		gouttesactives.Y += gouttesactives.vitesseY;
		gouttesactives.radius -= 0.075;
		if (gouttesactives.alpha > 0) {
			gouttesactives.alpha -= 0.005;
		} else {
			gouttesactives.alpha = 0;
		}
		if (gouttesactives.radius < 0) {
			goutteslocales.splice(i--, 1);
		}
	}

	var i = controls.rain;
	while (i--) {
		Rain(Math.floor((Math.random()*width)), -15);
	}
}


(function boucle() {
	'use strict'

	requestAnimFrame(boucle);
	update();
	rendu(ctx);
})();