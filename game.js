class Game {
    constructor(){
        this.introButton = createButton("Go to Air Hockey");
        this.introButton.hide();
    }
  
    getState(){
      var gameStateRef  = database.ref('gameState');
      gameStateRef.on("value",function(data){
         gameState = data.val();
      })
    }
  
    updateState(state){
      database.ref('/').update({
        gameState: state
      })
    }

    async start(){
        if(gameState === "form"){
          player = new Player();
          var playerCountRef = await database.ref('playerCount').once("value");
          if(playerCountRef.exists()){
            playerCount = playerCountRef.val();
            player.getCount();
          }
          form = new Form();
          form.display();
        }
    }

    intro() {
        background(introImage);
        this.introButton.show();
        this.introButton.style('width', '200px');
        this.introButton.style('height', '20px');
        this.introButton.style('background', 'pink');
        this.introButton.position(600, 600);
        this.introButton.mousePressed(()=>{
            this.introButton.hide();
            this.updateState("hockey");
            puck.velocityX = -10;
            puck.velocityY = -4;
            
        });
    }

    hockey() {
      background(hockeyTable);
      game.introButton.hide();
      form.greeting.hide();
      form.title.hide();
      Player.getPlayerInfo();

      textFont("georgia");
      fill(0);
      textSize(50);
      text(name1 +"'s Score: "+score1,10,50);
      text(name2 +"'s Score: "+score2,900,50);
      text("The first to 7 points wins!",10,750);

      bluePuck.visible = true;
      redPuck.visible = true;
      if(player.index === 1) {
          if(keyDown("up")) {
            player.distanceY +=20
            player.updateName();
          }
          if(keyDown("down") ) {
            player.distanceY -=20
            player.updateName();
          }
          if(keyDown("left")) {
              player.distanceX -=20;
              player.updateName();
          }
          if(keyDown("right")) {
              player.distanceX +=20;
              player.updateName();
          }
       
      } else if(player.index === 2) {
            if(keyDown("up")) {
              player.distanceY +=20
              player.updateName();
            }
            if(keyDown("down") ) {
              player.distanceY -=20
              player.updateName();
            }
            if(keyDown("left")) {
                player.distanceX -=20;
                player.updateName();
            }
            if(keyDown("right")) {
                player.distanceX +=20;
                player.updateName();
            }
      }
      
      if(puck.isTouching(edges[0]) && puck.y > 215 && puck.y < 600) {
        score2++;
        database.ref("players/player2").update({
          score: score2
        })
        database.ref("puck").update({
          x: 700,
          y: 400
        })
        puck.velocityX = 0;
        puck.velocityY = 0;
        puckState = "serve";
      
      }
      if(puck.isTouching(edges[1]) && puck.y > 215 && puck.y < 600) {
        score1++;
        database.ref("players/player1").update({
          score: score1
        })
        database.ref("puck").update({
          x: 700,
          y: 400
        })
        puck.velocityX = 0;
        puck.velocityY = 0;
        puckState = "serve";
      }

      if(puckState === "serve") {
        
        text("Press space to begin",750,750)
            if(keyDown("space")) {
              puck.velocityX = -10;
              puck.velocityY = -4;
              puckState = "play";
            }
      }

      var x = -200;
      var y;
      var x2;
      var index = 0;
      for(var plr in allPlayers) {
        index = index + 1;
        x = x + 600;
        y = 400 - allPlayers[plr].distanceY;
        x2 = x + allPlayers[plr].distanceX;
        players[index-1].x = x2;
        players[index-1].y = y;
      }
      
      database.ref("puck").update({
        x: puck.x,
        y: puck.y
      })
      puck.visible = true;
      puck.bounceOff(redPuck);
      puck.bounceOff(bluePuck);
      if(puck.isTouching(topLeft)||puck.isTouching(bottomLeft)){
        puck.x = puck.x+50;
        puck.velocityY = puck.velocityY*(-1)
        puck.velocityX = puck.velocityX*(-1)
      }
      if(puck.isTouching(topRight)||puck.isTouching(bottomRight)){
        puck.x = puck.x-50;
        puck.velocityY = puck.velocityY*(-1)
        puck.velocityX = puck.velocityX*(-1)
      }
      if(puck.isTouching(edges[2])) {
        puck.y = puck.y+50
        puck.velocityY = puck.velocityY*(-1)
        puck.velocityX = puck.velocityX*(-1)
      }
      if(puck.isTouching(edges[3])) {
        puck.y = puck.y-50
        puck.velocityY = puck.velocityY*(-1)
        puck.velocityX = puck.velocityX*(-1)
      }
      if(player.index===1 && redPuck.isTouching(edges[0])) {
        player.distanceX = player.distanceX+20;
      }
      if(player.index===1 && redPuck.isTouching(edges[1])) {
        player.distanceX = player.distanceX-20;
      }
      if(player.index===1 && redPuck.isTouching(edges[2])) {
        player.distanceY = player.distanceY-20;
      }
      if(player.index===1 && redPuck.isTouching(edges[3])) {
        player.distanceY = player.distanceY+20;
      }
      if(player.index===2 && bluePuck.isTouching(edges[0])) {
        player.distanceX = player.distanceX+20;
      }
      if(player.index===2 && bluePuck.isTouching(edges[1])) {
        player.distanceX = player.distanceX-20;
      }
      if(player.index===2 && bluePuck.isTouching(edges[2])) {
        player.distanceY = player.distanceY-20;
      }
      if(player.index===2 && bluePuck.isTouching(edges[3])) {
        player.distanceY = player.distanceY+20;
      }
      if(player.index===1 && redPuck.isTouching(line)) {
        player.distanceX = player.distanceX-20;
      }
      if(player.index===2 && bluePuck.isTouching(line)) {
        player.distanceX = player.distanceX+20;
      }

      if(score1 === 7 || score2 === 7) {
        gameState = "hockeyEnd"
        game.updateState("hockeyEnd");
      }

      if(gameState === "hockeyEnd") {
        background("aqua");
        redPuck.visible = false;
        bluePuck.visible = false;
        puck.visible = false;
        puck.velocityY = 0;
        puck.velocityX = 0;
        textFont("georgia");
        fill(0);
        textSize(50);
        text("Press the right arrow key to proceed to the race.",20,425);
        if(score1 === 7) {
          text(name1 + " has won!!!",20,375);
        } else if(score2 === 7) {
          text(name2 + " has won!!!",20,375);
        } 
        if(player.index === 1) {
            if(player1Ready === 1){
              text("Wait for the other player...",20,375);
            }
        } else if(player.index === 2) {
            if(player1Ready === 2){
              text("Wait for the other player...",20,375);
            }
        }
        if(keyDown("right")) {
          if(player.index === 1) {
              database.ref('players/player1').update({
                ready: 1,
                distanceX: 0,
                distanceY: 0,
                //score: 0
              });
          }
          if(player.index === 2) {
              database.ref('players/player2').update({
                ready: 1,
                distanceX: 0,
                distanceY: 0,
                //score: 0
              });
          }
        }
      }

      if(player1Ready === 1 && player2Ready === 1) {
        game.updateState("race");
      }

      right = createSprite(1300, 500, 30, 10000);
      right.visible = false;
      left = createSprite(100, 500, 30, 10000);
      left.visible = false;
      person1 = createSprite(100,200);
      person1.addImage(boyImage);
      person1.visible = false;
      person2 = createSprite(100,200);
      person2.addImage(girlImage);
      person2.visible = false;
      persons = [person1, person2];
    }

    race() {

    if(gameState === "race") {
      background("green");
      image(trackImage,0,-3700,1400,4500);
      this.introButton.hide();
      person1.visible = true;
      person2.visible = true;
      edges[2].visible = false;
      edges[3].visible = false;

      if(allPlayers !== undefined){
        var index = 0;
        var x = 190;
        var y;
        var x2;
        
        for(var plr in allPlayers){
          index = index + 1;
          x = x + 320;
          y = displayHeight - allPlayers[plr].distanceY;
          x2 = x + allPlayers[plr].distanceX;
          persons[index-1].x = x2;
          persons[index-1].y = y;
  
          if(persons[index-1].isTouching(left)) {
            persons.distanceX += 10;
          }
          if(persons[index-1].isTouching(right)) {
            player.distanceX -= 10;
          }
  
          if(index === player.index){
            fill("red");
            ellipse(x2, y, 60, 60);
            camera.position.x = 700;
            camera.position.y = persons[index-1].y
          }
  
          fill("white")
          textSize(15);
          textFont("georgia");
          textAlign(CENTER);
          text(allPlayers[plr].name, x2, y+150);
        }
      
  
      if(player.index !== null){
        if(keyIsDown(UP_ARROW) ) {
          player.distanceY +=10
          player.updateName();
        }
        if(keyIsDown(LEFT_ARROW)) {
            player.distanceX -=10;
            player.updateName();
        }
        if(keyIsDown(RIGHT_ARROW)) {
            player.distanceX +=10;
            player.updateName();
        }
      }
    }
      
      if(player.distanceY >= 4250) {
        camera.position.x = -700;
        camera.position.y = -400;
        gameState="raceEnd";
        game.updateState("raceEnd");
        player.score++;
        player.updateName();
      }
      person1.bounceOff(person2);
    }

      if(gameState === "raceEnd") {
        background("aqua");
        camera.position.x = -700;
        camera.position.y = -400;
        person1.visible = false;
        person2.visible = false;
        left.visible = false;
        right.visible = false;
        textFont("georgia");
        fill(0);
        textSize(50);
        text("Press the right arrow key to proceed to the swimming race.",camera.position.x-650,camera.position.y-250);
        if(score1 === 1) {
          text(name1 + " has won!!!",camera.position.x-650,camera.position.y-300);
        } else if(score2 === 1) {
          text(name2 + " has won!!!",camera.position.x-650,camera.position.y-300);
        }

        if(keyWentDown("right")) {
          if(player.index === 1) {
              player.distanceY = 0;
              database.ref('players/player1').update({
                ready: 2,
                distanceX: 0,
                distanceY: 0,
                score: 0
              });
              text("Wait for the other player...",camera.position.x-650,camera.position.y-250);
          }
          if(player.index === 2) {
              player.distanceY = 0;
              database.ref('players/player2').update({
                ready: 2,
                distanceX: 0,
                distanceY: 0,
                score: 0
              });
              text("Wait for the other player...",camera.position.x-650,camera.position.y-250);
          }
        }
        right2 = createSprite(1300, 500, 30, 10000);
        right2.visible = false;
        left2 = createSprite(100, 500, 30, 10000);
        left2.visible = false;
        swimmer1 = createSprite(100,200);
        swimmer1.addImage(swimmer1Image);
        swimmer1.scale = 1.5;
        swimmer1.visible = false;
        swimmer2 = createSprite(100,200);
        swimmer2.addImage(swimmer2Image);
        swimmer2.scale = 1.5;
        swimmer2.visible = false;
        swimmers = [swimmer1, swimmer2];

      if(player1Ready === 2 && player2Ready === 2) {
        
        game.updateState("swim");
        gameState = "swim";
      }

    }
  }

  swim() {
    if(gameState === "swim") {
      background("blue");
      image(swimTrackImage,0,-3700,1400,4500);

      swimmer2.visible = true;
      swimmer1.visible = true;
      edges[2].visible = false;
      edges[3].visible = false;

      if(allPlayers !== undefined){
        var index = 0;
        var x = 190;
        var y;
        var x2;
        
        for(var plr in allPlayers){
          index = index + 1;
          x = x + 320;
          y = displayHeight - allPlayers[plr].distanceY;
          x2 = x + allPlayers[plr].distanceX;
          swimmers[index-1].x = x2;
          swimmers[index-1].y = y;
  
          if(swimmers[index-1].isTouching(left)) {
            persons.distanceX += 10;
          }
          if(swimmers[index-1].isTouching(right)) {
            player.distanceX -= 10;
          }
  
          if(index === player.index){
            fill("red");
            ellipse(x2, y, 60, 60);
            camera.position.x = 700;
            camera.position.y = swimmers[index-1].y
          }
  
          fill("white")
          textSize(15);
          textFont("georgia");
          textAlign(CENTER);
          text(allPlayers[plr].name, x2, y+150);
        }
      
  
      if(player.index !== null){
        if(keyIsDown(UP_ARROW) ) {
          player.distanceY +=10
          player.updateName();
        }
        if(keyIsDown(LEFT_ARROW)) {
            player.distanceX -=10;
            player.updateName();
        }
        if(keyIsDown(RIGHT_ARROW)) {
            player.distanceX +=10;
            player.updateName();
        }
      }
    }
      
      if(player.distanceY >= 4250) {
        camera.position.x = -700;
        camera.position.y = -400;
        gameState="swimEnd";
        game.updateState("swimEnd");
        player.score++;
        player.updateName();
      }
      swimmer1.bounceOff(swimmer2);
    }
  
    if(gameState === "swimEnd") {
      camera.position.x = -700;
      camera.position.y = -400;
      background("aqua");
      swimmer1.visible = false;
      swimmer2.visible = false;
      textFont("georgia");
      fill(0);
      textSize(50);
      text("Press the right arrow key to proceed to the final results.",camera.position.x-650,camera.position.y-250);
      if(score1 === 1) {
        text(name1 + " has won!!!",camera.position.x-650,camera.position.y-300);
      } else if(score2 === 1) {
        text(name2 + " has won!!!",camera.position.x-650,camera.position.y-300);
      }

      if(keyWentDown("right")) {
        if(player.index === 1) {
            database.ref('players/player1').update({
              ready: 3,
              distanceX: 0,
              distanceY: 0,
              score: 0
            });
            text("Wait for the other player...",camera.position.x-650,camera.position.y-250);
        }
        if(player.index === 2) {
            database.ref('players/player2').update({
              ready: 3,
              distanceX: 0,
              distanceY: 0,
              score: 0
            });
            text("Wait for the other player...",camera.position.x-650,camera.position.y-250);
        }
      }
    

    if(player1Ready === 3 && player2Ready === 3) {
      game.updateState("end");
      gameState = "end";
    }
  }
}

  end() {
    camera.position.x = 700;
    camera.position.y = 400;
  }
}