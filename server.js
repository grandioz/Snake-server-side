
const WebSocket = require('ws');
const WebSocketServer = require('ws').Server;

const express = require('express');
const { Console } = require('console');
const { POINT_CONVERSION_COMPRESSED } = require('constants');
const { join } = require('path');

const server = express().listen(8021);

const wss = new WebSocketServer({server });

let clients = new Map();

let foods = new Map([]);
let poisons = new Map([]);

console.log('started server');

class LeavePacket{

  constructor(user){
      this.user = user;
      this.type = 'leave';
  }

}


class EatPacket{

  constructor(food , poison , removeId) {
    this.food = food;
    this.removeId = removeId;
    this.poison = poison;
    this.type = 'food';
  }

}

class WelcomePacket{

  constructor(foods , poisons){
    this.foods = foods,
    this.poisons = poisons,
    this.type = 'welcome';

  }

}

class AllUsersPacket{
  constructor(users){
    this.users = users,
    this.type = 'allusers';
  }

}



wss.on('connection' , (vs)  => {
console.log('new client connected ');


if(wss.clients.size == 1){
  foods = new Map([]);
  //generate foods
  console.log('creating new shit');
for(var i =0; i<= 100 ; i++){
  let food = {
    xpos: Math.round(randomInteger(-2000/20-2,2480/20-2))*20,
    ypos : Math.round(randomInteger(-2000/20-2,2480/20-2))*20,
    id: randomInteger(1, 3000)
  }
  foods.set(food.id , food);


}  

}

console.log('daodj,azjfdaz');

let joinPacket = new WelcomePacket(Object.fromEntries(foods) , Object.fromEntries(poisons));
vs.send(JSON.stringify(joinPacket));






vs.on('close' , ()=>{ 
  
  console.log('Client disconnected');
  
  if(clients.has(vs)){

  wss.clients.forEach(client => {
    if(clients.has(client)){
      client.send(JSON.stringify(new LeavePacket(clients.get(vs))));
    }
  });

  clients.delete(vs); 

}
});

vs.on('message' , (message)=>{

 
  let packet = JSON.parse(message); 
  console.log(packet.type);
  
  if(packet.type === 'join'){
 
    console.log(getUsersArray(clients));
    console.log(clients);
    let apacket = new AllUsersPacket(getUsersArray(clients));
    vs.send(JSON.stringify(apacket));



    clients.set(vs , packet.user);
    console.log(packet.user.id + ' has joined the game');

    vs.send(JSON.stringify(new EatPacket(foods, poisons)));
   wss.clients.forEach(client => {
    if(clients.has(client)){
      client.send(JSON.stringify(message));
    }
  });

    } 

    if(packet.type === 'leave'){
 
      console.log('Client disconnected');
      
      if(clients.has(vs)){

    
      wss.clients.forEach(client => {
        if(clients.has(client)){
          client.send(JSON.stringify(new LeavePacket(clients.get(vs))));
        }
      });
      clients.delete(vs);  
      } 
    }


    if(packet.type === 'update'){
     
      
      clients.set(vs , packet.user);
        wss.clients.forEach(client => {
          if(clients.has(client) && client !== vs ){
            client.send(JSON.stringify(packet));
          }
        });

    }

    if(packet.type === 'food'){
      console.log('got food '+packet);
      console.log(message);
      console.log(packet.foods.id);
    foods.delete(packet.foods.id);
    let food = {
      xpos: Math.round(randomInteger(-2000/20-2,2480/20-2))*20,
      ypos : Math.round(randomInteger(-2000/20-2,2480/20-2))*20,
      id: randomInteger(1, 3000),
    }

    foods.set(food.id , food);

    let poison = {    
      xpos: Math.round(randomInteger(-2000/20-2,2480/20-2))*20,
      ypos : Math.round(randomInteger(-2000/20-2,2480/20-2))*20,
      id: randomInteger(1, 3000)
    }
  
    let fpacket = new EatPacket(food , poison , packet.foods.id);
      wss.clients.forEach(client => {
       
          client.send(JSON.stringify(fpacket));
       
      });

  }


  });
});


function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function getUsersArray(){

    let array =[];

  clients.forEach(key =>{
    
    array.push(key);

  })
return array;


}