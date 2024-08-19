import Game from "./game.js";

window.onload=()=>{
	const canvas=document.getElementById("output");

	var script="main.lua"

	var game=new Game(canvas,script);
}
