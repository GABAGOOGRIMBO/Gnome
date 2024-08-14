import RGB from "./rgb.js";

class Gnome {
	constructor(){
		this.width=240;
		this.height=180;
		this.gfxScale=4; //Multiplier for window resolution
		this.fps=60;

		this.canvas=document.createElement("canvas");
		this.context=this.canvas.getContext("2d");
		this.canvas.width=this.width*this.gfxScale
		this.canvas.height=this.height*this.gfxScale
		
		this.curColor=this.RGB(0,0,0)
		this.offsetX=0 //Camera x offset
		this.offsetY=0 //Camera y offset

		this.scrnBuffer=[] //2d array of the rgb values of the screen
		for (let y=0;y<this.height;y++) {
			this.scrnBuffer[y]= [];
            for (let x=0;x<this.width;x++) {
				this.scrnBuffer[y][x]= this.RGB(0,0,0);
            }
        }
		console.log("Hello World");
		document.body.insertBefore(this.canvas,document.body.childNodes[0]);
		setInterval(this.tick(),1000/this.fps);
		console.log("interval set");
		
	}

	tick() {
		this.update();
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); //clears the canvas of the previous screen but does not reset the buffer
		this.draw();
		for (let y=0;y<this.height;y++) { //Draw the buffer to the screen
        	for (let x=0;x<this.width;x++) {
				this.context.fillStyle=this.scrnBuffer[y][x].toString(); //weird css conversion
				this.context.fillRect(x*this.gfxScale,y*this.gfxScale,this.gfxScale,this.gfxScale);
            }
        }
	}

	// Drawing methods
	cls(c=this.RGB(0,0,0)) { //Resets the buffer
		this.cam(0,0);
		this.color(c);
		for (let y=0;y<this.height;y++) {
            for (let x=0;x<this.width;x++) {
				this.pset(x,y,c);
            }
        }
	}

	rectFill(x,y,w,h) {
		for (let ry=0;ry<h;ry++) {
			for (let rx=0;rx<w;rx++) {
				this.pset(rx+x,ry+y);
			}
		}
	}

	rectStrk(x,y,w,h) {
		for (let ry=0;ry<h;ry++) {
			for (let rx=0;rx<w;rx++) {
				if (rx==0 || ry==0 || rx==w-1 || ry==h-1) {
					this.pset(rx+x,ry+y);
				}
			}
		}
	}

	pset(x,y) { //Sets a pixel to a color
		x-=this.offsetX;
		y-=this.offsetY;

		if (x>=0 && x<this.width && y>=0 && y<this.height) {
			this.scrnBuffer[y][x]=this.curColor;
		}
	}

	RGB(r,g,b) { //Shorthand for RGB
		return new RGB(r,g,b);
	}

	color(c) { //Sets the current color
		this.curColor=c;
	}

	cam(x,y) { //Offsets the cursor
		this.offsetX=x;
		this.offsetY=y;
	}

	// Call backs
	update() {}
	draw() {}
}

export default Gnome