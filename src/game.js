import * as luainjs from "lua-in-js";
import GFX from "./gfx.js";
import fileSystem from "./fileSystem.js";
import * as path from "path-browserify";

class Game {
    constructor(canvas,script) {
        this.gfx=new GFX(canvas);
        this.luaEnv=luainjs.createEnv({
            fileExists: p => fileSystem.exists(path.join("./game/",p)),
            loadFile: p => fileSystem.read(path.join("./game/",p)),
        });
        //this.luaEnv.loadLib("gnome",new luainjs.Table(this.generateLib()));
        this.luaScript=this.luaEnv.parseFile(script).exec();
        this.init = this.luaScript.strValues.init;
	    this.update = this.luaScript.strValues.update;
	    this.draw = this.luaScript.strValues.draw;
        this.init();
        setInterval(()=>{this.tick()},1000/this.gfx.fps);
    }

    tick() {
        //this.update();
        //this.draw();
        this.gfx.tick();
    }

    generateLib() {
        let lib = {
            cls:function() {
                this.gfx.cls()
            },

            rectFill:function(x,y,w,h) {
                let X=luainjs.utils.coerceArgToNumber(x,"rectFill",1)
                let Y=luainjs.utils.coerceArgToNumber(y,"rectFill",2)
                let W=luainjs.utils.coerceArgToNumber(w,"rectFill",3)
                let H=luainjs.utils.coerceArgToNumber(h,"rectFill",4)
                this.gfx.rectFill(X,Y,W,H);
            },

            rectStrk:function(x,y,w,h) {
                let X=luainjs.utils.coerceArgToNumber(x,"rectStrk",1);
                let Y=luainjs.utils.coerceArgToNumber(y,"rectStrk",2);
                let W=luainjs.utils.coerceArgToNumber(w,"rectStrk",3);
                let H=luainjs.utils.coerceArgToNumber(h,"rectStrk",4);
                this.gfx.rectStrk(X,Y,W,H);
            },

            pset:function(x,y) {
                let X=luainjs.utils.coerceArgToNumber(x,"pset",1);
                let Y=luainjs.utils.coerceArgToNumber(y,"pset",2);
                this.gfx.pset(X,Y);
            },

            setColor:function(r,g,b) {
                let R=luainjs.utils.coerceArgToNumber(r,"color",1);
                let G=luainjs.utils.coerceArgToNumber(g,"color",2);
                let B=luainjs.utils.coerceArgToNumber(b,"color",3);

                this.gfx.curColor= new this.gfx.RGB(R,G,B);
            }
        }

        return lib
    }
}

export default Game;