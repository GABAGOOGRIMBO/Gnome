import GFX from "./GFX.js";

class game {
    constructor(canvas) {
        this.fps;
        this.luaScript;
        this.gfx = new GFX(this);
    }
}