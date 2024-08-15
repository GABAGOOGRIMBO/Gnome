class RGB {
    constructor(r,g,b){
        this.r=r;
        this.g=g;
        this.b=b;
    }
    
    toString(){
        return "rgb("+this.r.toString()+" "+this.g.toString()+" "+this.b.toString()+")";
    }
}

function rgb(r,g,b) {
    return new RGB(r,g,b);
}

export default rgb;