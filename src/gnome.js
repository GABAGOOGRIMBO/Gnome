import RGB from "./rgb.js";
import * as luainjs from "lua-in-js";

const luaEnv = luainjs.createEnv();
const luaScript = luaEnv.parseFile("main.lua");
//const update, draw = luaScript.exec();
const canvas=document.createElement("canvas");
const context=canvas.getContext("2d");

var width=240;
var height=180;
var gfxScale=3; //Multiplier for window resolution
var fps=60;

canvas.width=width*gfxScale
canvas.height=height*gfxScale

var curColor=rgb(0,0,0)
var offsetX=0 //Camera x offset
var offsetY=0 //Camera y offset

var scrnBuffer=[] //2d array of the rgb values of the screen
for (let y=0;y<height;y++) {
	scrnBuffer[y]= [];
	for (let x=0;x<width;x++) {
		scrnBuffer[y][x]= rgb(0,0,0);
	}
}

window.onload = ()=>{
	console.log("Hello World");
	document.body.insertBefore(canvas,document.body.childNodes[0]);
	setInterval(tick(),1000/fps);
	console.log("interval set");
}

function tick() {
	update();
	context.clearRect(0, 0, canvas.width, canvas.height); //clears the canvas of the previous screen but does not reset the buffer
	draw();
	for (let y=0;y<height;y++) { //Draw the buffer to the screen
		for (let x=0;x<width;x++) {
			context.fillStyle=scrnBuffer[y][x].toString(); //weird css conversion
			context.fillRect(x*gfxScale,y*gfxScale,gfxScale,gfxScale);
		}
	}
}

// Drawing methods
function cls(c=RGB(0,0,0)) { //Resets the buffer
	cam(0,0);
	color(c);
	for (let y=0;y<height;y++) {
		for (let x=0;x<width;x++) {
			pset(x,y,c);
		}
	}
}

function rectFill(x,y,w,h) {
	for (let ry=0;ry<h;ry++) {
		for (let rx=0;rx<w;rx++) {
			pset(rx+x,ry+y);
		}
	}
}

function rectStrk(x,y,w,h) {
	for (let ry=0;ry<h;ry++) {
		for (let rx=0;rx<w;rx++) {
			if (rx==0 || ry==0 || rx==w-1 || ry==h-1) {
				pset(rx+x,ry+y);
			}
		}
	}
}

function pset(x,y) { //Sets a pixel to a color
	x-=offsetX;
	y-=offsetY;

	if (x>=0 && x<width && y>=0 && y<height) {
		scrnBuffer[y][x]=curColor;
	}
}

function rgb(r,g,b) { //Shorthand for RGB
	return new RGB(r,g,b);
}

function color(c) { //Sets the current color
	curColor=c;
}

function cam(x,y) { //Offsets the cursor
	offsetX=x;
	offsetY=y;
}

// Call backs
function update() {}
function draw() {}