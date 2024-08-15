import RGB from "./rgb.js"

class GFX {
    constructor(parent) {
        this.parent=parent;
        this.RGB=RGB;
        this.curColor=new this.RGB(0,0,0); this.scrnBuffer;
        this.offX; this.offY;
        this.width; this.height;
    }
}