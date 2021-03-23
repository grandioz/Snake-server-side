

class ChangeDirectionPacket{

    constructor(id , direction , oldx , oldy , newx , newy , client){
        this.client = client;
        this.direction = direction;
        this.id = id;
        this.oldx = oldx;
        this.oldy = oldy;
        this.newx = newx;
        this.newy = newy;

    }

    perform(){
    
    }


}