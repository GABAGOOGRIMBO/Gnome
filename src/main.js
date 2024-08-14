import * as luainjs from "lua-in-js";
import Gnome from "/src/gnome.js";

const luaEnv = luainjs.createEnv()
luaEnv.parse("print('hallloooooo')").exec()

class Main extends Gnome {
    constructor() {
        super();
    }

    update() {

    }

    draw() {
        this.cls(this.RGB(0,0,0))
        this.cam(0,0)
        this.color(this.RGB(255,0,0))
        this.rectFill(0,0,16,16)
        this.color(this.RGB(0,255,0))
        this.rectStrk(0,0,16,16)
    }
}

new Main()