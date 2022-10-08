//title = "No Stars!!!";

description = 
`click
change direction
hold  
use force field to get pt
`;

// Define pixel arts of characters.
// Each letter represents a pixel color.
// (l: black, r: red, g: green, b: blue
//  y: yellow, p: purple, c: cyan
//  L: light_black, R: light_red, G: light_green, B: light_blue
//  Y: light_yellow, P: light_purple, C: light_cyan)
// Characters are assigned from 'a'.
// 'char("a", 0, 0);' draws the character
// defined by the first element of the array.


characters = [
	` 
  r
 yry
yyryy
  r 
`,`
c
c
c
c
c
`,



];




const GameCanvas = {
	WIDTH: 100,
	HEIGHT: 150
};

const var_Player = {
	PLAYER_BOUNDARY_X: 15,
	PLAYER_BOUNDARY_Y: 40,
	PLAYER_FIRE_RATE: 10,

};

const var_Bullet = {
	BULLET_SPEED: 5,
	BULLET_RADIUS: 20,
	Energy_cap: 40,
	Energy_use: 0.1,
}

const var_Star = {
	STAR_SPEED_MIN: 0.3,
	STAR_SPEED_MAX: 0.8
}

const var_enemy = {
	ENEMY_MIN_BASE_SPEED: 1.0,
    ENEMY_MAX_BASE_SPEED: 2.0
}


options = {
	viewSize: { x: GameCanvas.WIDTH, y: GameCanvas.HEIGHT },
    seed: 10,
    isPlayingBgm: true,
	theme: "dark"
};


// declare player
/**
 * @typedef { object } player
 * @property { Vector } pos
 * @property { number } firingCooldown
 * @property { boolean } isFiringLeft
 */
let player;


// declare Bullet
/**
 * @typedef { object } Bullet
 * @property { Vector } pos
 * @property { number } angle
 * @property { number } rotation
 */
let Bullet;

// declare enemy

/**
 * @typedef { object } enemies
 * @property { Vector } pos
 */
 let enemies;
 
 //declare energy
/**
 * @typedef { object } energy
 * @property { Vector } pos
 * @property { Vector } current_energy
 */
 let energy;

/**
 * @type { number }
 */
 let currentSpeed;

 /**
  * @type { number }
  */
 let game_score;

  /**
  * @type { number }
  */
let rotationSpeed;

  /**
  * @type { boolean }
  */
let firstClick;
     /**
  * @type { boolean }
  */
let secondClick;

     /**
  * @type { number }
  */
let twoClicksDuration;

     /**
  * @type { number }
  */
let holdDuration;


     /**
  * @type { boolean }
  */
	  let shield_trigger;

	  

// declare star
/**
* @typedef { object } Star - A decorative floating object in the background
* @property { Vector } pos - The current position of the object
* @property { number } speed - The downwards floating speed of this object
*/
let stars;
let player_x;
let player_speed;
let rotation_speed;
let HP;
let energy_change;




function update() {

	// init
	if (!ticks) {

		//stars init
		stars = times(20, () => {
			// Random number generator function
			// rnd( min, max )
			const posX = rnd(0, GameCanvas.WIDTH);
			const posY = rnd(0, GameCanvas.HEIGHT);
			// An object of type Star with appropriate properties
			return {
				// Creates a Vector
				pos: vec(posX, posY),
				// More RNG
				speed: rnd(var_Star.STAR_SPEED_MIN, var_Star.STAR_SPEED_MAX)
			};
		});

		//player init
		player = {
			pos: vec(GameCanvas.WIDTH * 0.5, GameCanvas.HEIGHT * 0.7),
			firingCooldown: var_Player.PLAYER_FIRE_RATE,
			isFiringLeft: true,
		};

		//bullet init
		 Bullet = [];

		//enemies init
		enemies = [];
		currentSpeed = 0;
		game_score = 0;
		rotationSpeed = 1;
		firstClick = false;
		secondClick = false;
		twoClicksDuration = 0;
		holdDuration = 0;
		shield_trigger = false;

		player_x = 50;
		player_speed = 0.5;
		rotation_speed = 0.2;
		HP = 10;
		energy_change = false;
		energy = {
			pos:  vec(5, 145),
			current_energy: var_Bullet.Energy_cap,
		};

	}// init end


	// Update for Star
	stars.forEach((s) => {
		// Move the star downwards
		s.pos.y += s.speed;

		// Bring the star back to top once it's past the bottom of the screen
		if (s.pos.y > GameCanvas.HEIGHT) {
			s.pos.y = -5;
		}
		//s.pos.wrap(0, GameCanvas.WIDTH, 0, GameCanvas.HEIGHT);
		// Choose a color to draw
		color("light_black");
		//https://abagames.github.io/crisp-game-lib-games/?ref_drawing
		text("*", s.pos);
	});

	/*
	Feature: general interaction of single-click, double-click, holding
			(leave comment if u want me to code more)

	variable use:
		firstClick - bool :used to check if you single click the mouse
		secondClick - bool : used to check if you click the mouse again after the firstClick
		holdDuration - num : used to determine how long u hold the mouse
		twoClicksDuration - num: duration between single click and second click
	*/

	if(input.isJustPressed){
		//first click = true means it's single click
		if(!firstClick){
			firstClick = true;
		}else{
		//second click = true means it's double click
 			secondClick = true;
			firstClick = false; 
		}
	}
	if(input.isPressed){
		holdDuration++;
		//if u hold, it will run hold code instead of single/double click
		if(holdDuration >= 15){
			//=====================================
			//put your code for holding here
			console.log("holding");

			if(energy.current_energy > 0){
				energy.current_energy -= var_Bullet.Energy_use;
				if(Bullet.length <= 2){
					Bullet.push({
						pos: vec(player.pos),
						rotation: 0,
					});
					Bullet.push({
						pos: vec(player.pos),
						rotation: PI/2,
					});
				}
	
				shield_trigger = true;
	
				Bullet.forEach((b) => {
					b.pos =  player.pos;
					b.rotation += rotation_speed;
					color("green");
					bar(b.pos, 30, 3, b.rotation, 0.5);
						// @ts-ignore
						play("jump"); 
				});
			}else if (energy.current_energy <= 0){
				end();
			}
			//=====================================
			secondClick = false;
			firstClick = false; 
		}
	}else{
		if(firstClick && twoClicksDuration < 7){
			twoClicksDuration++;
		}else{
			if(firstClick && holdDuration < 15){
			//=====================================
			//put your code for single click here
				console.log("just a click");
				player_speed = -player_speed;
			//=====================================
			}
			if(secondClick && holdDuration < 15){
			//=====================================
			//put your code for double click here
				console.log("double click");
			//=====================================
				secondClick = false;
			}
			holdDuration = 0;
			twoClicksDuration = 0;
			firstClick = false;


			remove(Bullet, (fb) => {
				return shield_trigger;
			});





		} 
	}
	

	if(player_x <= var_Player.PLAYER_BOUNDARY_X){
		player_speed = -player_speed;

	}else if(player_x >= GameCanvas.WIDTH - var_Player.PLAYER_BOUNDARY_X){
		player_speed = -player_speed;

	}
		player_x += player_speed; 

		player.pos = vec(player_x, 100);
		player.pos.clamp(var_Player.PLAYER_BOUNDARY_X,
			GameCanvas.WIDTH - var_Player.PLAYER_BOUNDARY_X,
			var_Player.PLAYER_BOUNDARY_Y,
			GameCanvas.HEIGHT - var_Player.PLAYER_BOUNDARY_Y); 

	color("black");
	char("a",  player.pos);


	

	if (enemies.length === 0) {

        currentSpeed =
            rnd(var_enemy.ENEMY_MIN_BASE_SPEED, var_enemy.ENEMY_MAX_BASE_SPEED) * difficulty;

			for (let i = 0; i < 10; i++) {
            const posX = rnd(var_Player.PLAYER_BOUNDARY_X, GameCanvas.WIDTH - var_Player.PLAYER_BOUNDARY_X);
            const posY = -rnd(0, GameCanvas.HEIGHT * 0.1 * i);

			//console.log(enemies[0].posX);

            enemies.push({ pos: vec(posX, posY)})
        }
    }

	

	// Another update loop
	// This time, with remove()
	remove(enemies, (e) => {
		e.pos.y += currentSpeed;
		color("black");
		const isCollidingWithFBullets = char("b", e.pos).isColliding.rect.green;
        if (isCollidingWithFBullets) {
			play("explosion"); 
            color("cyan");
            particle(e.pos,
				100, // The number of particles
				1, // The speed of the particles
				-PI/2, // The emitting angle
				PI  // The emitting width
				);
				game_score += 10;
				addScore(game_score, e.pos);
        }
		const isCollidingWithPlayer = char("b", e.pos).isColliding.char.a;
		if(isCollidingWithPlayer){
			HP -= 1;

			color("yellow");
            particle(e.pos,
				30, // The number of particles
				1, // The speed of the particles
				-PI, // The emitting angle
				PI  // The emitting width
				
				);
				play("explosion");
			if(HP <= 0){
				end();
				play("powerUp");
			}
		}


		return (isCollidingWithFBullets  || e.pos.y > GameCanvas.HEIGHT);
    });


	//display energy
	

	color("green");
	text("energy", 15, 140);
	bar(energy.pos,  energy.current_energy, 8, -PI/2, 0);




	//======================================
	//UI
	//======================================
	//display difficulty
	color("black");
	text("level", 70, 130);
	text(difficulty.toFixed(2).toString(), 75, 140);

	//display Player HP
	color("red");
		text("HP", 3, 10);
		text(HP.toString(), 17, 10);
	//======================================




}
