import RGB from "./rgb.js"

class GFX {
    constructor(canvas) {
        this.canvas=canvas;
        this.context=this.canvas.getContext("2d");
        this.RGB=RGB;
        this.curColor=new this.RGB(0,0,0); 
        this.fps=60;
        this.offX=0; this.offY=0;
        this.width; this.height; this.scale;
        this.canvas.width;
	    this.canvas.height;
        this.scrnBuffer=[];
        this.setRes(240,180,3);
    }

    setRes(w,h,s) {
        this.width=w;
        this.height=h;
        this.scale=s
        this.canvas.width=this.width*this.scale;
	    this.canvas.height=this.height*this.scale;
        for (let y=0;y<this.height;y++) {
            this.scrnBuffer[y]=[];
            for (let x=0;x<this.width;x++) {
                this.scrnBuffer[y][x]=this.rgb(0,0,0);
            }
        }
    }

    tick() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); //clears the canvas of the previous screen but does not reset the buffer
        for (let y=0;y<this.height;y++) { //Draw the buffer to the screen
            for (let x=0;x<this.width;x++) {
                this.context.fillStyle=this.scrnBuffer[y][x].toString(); //weird css conversion
                this.context.fillRect(x*this.scale,y*this.scale,this.scale,this.scale);
            }
        }
    }

    cls() { //Resets the buffer
        this.cam(0,0);
        this.color(this.rgb(0,0,0));
        for (let y=0;y<this.height;y++) {
            for (let x=0;x<this.width;x++) {
                this.pset(x,y);
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
    
    rgb(r,g,b) {
        return new RGB(r,g,b);
    }

    color(c) { //Sets the current color
        this.curColor=c;
    }
    
    cam(x,y) { //Offsets the cursor
        this.offsetX=x;
        this.offsetY=y;
    }
}

export default GFX;