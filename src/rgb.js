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

export default RGB;