//Variables:

var webgl;
var cam;
var campos = {
  x: 0,
  y: 0,
  z: -50
};
var scene;
var server;
var egar = "lobby";
var canvas;
var images = {};
var blocks = [[[]]];
var players = [];
var map;
var socket = io('https://evolgar-server.glitch.me');

//Disable friendly errors:

p5.disableFriendlyErrors = true;


function preload() {  //Preload
  //Load images:
  images = {
    logo: loadImage(
      "https://cdn.glitch.com/fe6dcd2a-d73f-4931-8c94-255bc9341228%2F5346c842-543f-4134-adf8-e0859ee2b7d2.image.png"
    )
  };
  //Load map: Todo: Make the map come from a egar.
  map = loadModel(
    "https://cdn.glitch.com/fe6dcd2a-d73f-4931-8c94-255bc9341228%2FCastle%20OBJ.obj"
  );
}  //Preload


function setup() {  //Setup
  //Create the canvas:
  createCanvas(window.innerWidth, window.innerHeight);
  //Create a 3d canvas im memory:
  webgl = createGraphics(width, height, "webgl");
  map.normalize();
  cam = webgl.createCamera();
  webgl.setCamera(cam);
  cam.setPosition(0, 0, 0);
  
  //Set Scene to game:
  scene = "game";
  server = "lobby";
}  //Setup


function draw() {  //Draw
  //Scenes
  if (scene == "game" && server == "lobby") {
    lobby();
    //No cursor;
    requestPointerLock();
    cursor();
  } else if (scene == "game" && server == "custom_egar") {
    custom_egar();
    //No cursor:
    requestPointerLock();
    cursor();
  } else {
    //Background:
    background(0, 122, 255);
    //Logo:
    image(
      images.logo,
      window.innerWidth / 2 - 300,
      window.innerHeight / 2 - 300,
      600,
      600
    );
    //Custom cursor:
    exitPointerLock();
    noCursor();
    stroke(255);
    line(mouseX - 10, mouseY, mouseX + 10, mouseY);
    line(mouseX, mouseY - 10, mouseX, mouseY + 10);
  }
}  //Draw


function game() {  //Game
  // Set the background of the canvas to black:
  background(0, 0);
  // Show the webgl canvas:
  image(webgl, 0, 0);
  // Set background of the webgl canvas to blue:
  webgl.background(70, 150, 200);
  // Make a map in webgl:
  webgl.push();
  webgl.noStroke();
  webgl.fill(1, 200, 70);
  webgl.translate(0, 55, 0);
  webgl.box(1000, 10, 1000);
  webgl.pop();
  webgl.push();
  webgl.fill(130);
  webgl.rotateZ(3.15);
  webgl.model(map);
  webgl.pop();
  //Multiplayer:
  webgl.push();
  for (let i = 0; i < players.length; i++) {
    if (players[i].id != socket.id) {
//       let targetX = players[i].xt;
//       let dx = targetX - players[i].x;
//       players[i].x += dx * 0.5;

//       let targetY = players[i].yt;
//       let dy = targetY - players[i].y;
//       players[i].y += dy * 0.5;

//       let targetZ = players[i].zt;
//       let dz = targetZ - players[i].z;
//       players[i].z += dz * 0.5;

      webgl.translate(players[i].x, players[i].y, players[i].z);
      webgl.box(5);
    }
  }
  webgl.pop();
  // Player script
  cam.pan(-movedX * (0.0015 * (deltaTime / 40)));
  cam.tilt(movedY * (0.0015 * (deltaTime / 40)));
  if (keyIsDown(65)) cam.move(-1.5 * (deltaTime / 10), 0, 0);
  if (keyIsDown(68)) cam.move(1.5 * (deltaTime / 10), 0, 0);
  if (keyIsDown(87)) cam.move(0, 0, -1.5 * (deltaTime / 10));
  if (keyIsDown(83)) cam.move(0, 0, 1.5 * (deltaTime / 10));
  if (keyIsPressed) {
    socket.emit("move", { x: cam.eyeX, y: cam.eyeY, z: cam.eyeZ });
  }
}  //Game


function custom_egar() { //Custom egar
  game();
}  //Custom Egar


function lobby() {  //Lobby
  game();
}  //Lobby


function start_menu() {  //Start menu
  //Button functionality:
  let lobby = function() {
    server = "lobby";
    scene = "menu";
    lobbyg.remove();
    custom_egarg.remove();
    menu();
  };
  let custom_egar = function() {
    server = "custom_egar";
    scene = "server_input";
    lobbyg.remove();
    custom_egarg.remove();
    server_input();
  };
  //Gui:
  let lobbyg = createButton("Lobby");
  let custom_egarg = createButton("Custom Egar");
  lobbyg.size(100, 50);
  lobbyg.position(width / 5, height / 6);
  lobbyg.mousePressed(lobby);
  lobbyg.style("background-color", color(0, 0));
  lobbyg.style("borderColor", color(0, 0));
  lobbyg.style("color", color(255));
  lobbyg.style("fontSize", "large");
  custom_egarg.size(100, 50);
  custom_egarg.position(width / 5, height / 2);
  custom_egarg.mousePressed(custom_egar);
  custom_egarg.style("background-color", color(0, 0));
  custom_egarg.style("borderColor", color(0, 0));
  custom_egarg.style("color", color(255));
  custom_egarg.style("fontSize", "large");
  background(0, 122, 255);
}  //Start menu


function menu() {  //Menu
  //Button functionality:
  let game = function() {
    scene = "game";
    continueg.remove();
    quitg.remove();
  };
  let quit = function() {
    scene = "select_server";
    continueg.remove();
    quitg.remove();
    start_menu();
  };
  //Gui:
  let continueg = createButton("Continue");
  let quitg = createButton("Quit");
  continueg.size(100, 50);
  continueg.position(width / 5, height / 6);
  continueg.mousePressed(game);
  continueg.style("background-color", color(0, 0));
  continueg.style("borderColor", color(0, 0));
  continueg.style("color", color(255));
  continueg.style("fontSize", "large");
  quitg.size(100, 50);
  quitg.position(width / 5, height / 2);
  quitg.mousePressed(quit);
  quitg.style("background-color", color(0, 0));
  quitg.style("borderColor", color(0, 0));
  quitg.style("color", color(255));
  quitg.style("fontSize", "large");
  background(0, 122, 255);
}  //Menu


function server_input() {  //Server input
  //Button functionality:
  let start = function() {
    egar = egar_inputg.value();
    egar_inputg.remove();
    startg.remove();
    scene = "menu";
    server = "custom_egar";
    menu();
  };
  //Make the input and button early:
  let egar_inputg = createInput(egar);
  let startg = createButton("Button");
  //Reset canvas so the button and input are above:
  createCanvas(width, height);
  //Gui:
  egar_inputg.size(width, 25);
  startg.mousePressed(start);
  startg.position(width / 2 - 22, 30);
}  //Server input


function keyPressed() {  //keyPressed
  if (scene == "game" && keyCode == 9) {
    scene = "menu";
    menu();
  }
  socket.emit("move", { x: cam.eyeX, y: cam.eyeY, z: cam.eyeZ });
}  //keyPressed


function Block(texture, script) {  //Block constructer
  this.texture = texture;
  this.script = script;
  this.show = function() {
    webgl.texture(this.texture);
    webgl.translate();
    webgl.box(50);
  };
}  //Block constructer

//Multiplayer:

socket.on("update", function(data) {
  players = data;
});
