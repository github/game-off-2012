package  
{
	/**
	 * ...
	 * @author Wayne Denier II
	 */
	
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	 
	public class GitShip extends FlxSprite
	{
		private const SPDVAR:Number = 2;
		private const LEFT_BOUNDS:Number = 15;
		private const RIGHT_BOUNDS:Number = 305 - 16;
		
		[Embed(source = "GitShip.png")]
		private var ImgShip:Class;
		[Embed(source = "shot.png")]
		private var ImgBullet:Class;
		
		public var gun:FlxWeapon;
		
		public function GitShip() {
			super(160, 200);
			this.loadGraphic(ImgShip, false, false, 16, 16 );
			
			this.width = 14;
			this.height = 14;
			this.offset.x = 1;
			this.offset.y = 1;
			FlxControl.create(this, FlxControlHandler.MOVEMENT_INSTANT, FlxControlHandler.STOPPING_INSTANT );
			//FlxControl.player1.setBounds(15, 120, 274, 120);
			//FlxControl.player1.setCursorControl(false, false);
			//FlxControl.player1.setMovementSpeed(200, 0, 200, 0, 200, 0);
			FlxControl.player1.setMovementSpeed(200, 0, 200, 0);
			FlxControl.player1.setCursorControl(false, false, true, true);
			FlxControl.player1.setBounds(16, 200, 280, 16);
			gun = new FlxWeapon("gun", this);
			//gun.setFireRate(100);
			//gun.setBulletSpeed(200);
			gun.makeImageBullet(100, ImgBullet);
			gun.setBulletDirection(FlxWeapon.BULLET_UP, 200);
			gun.setBulletBounds(new FlxRect(0, 0, 320, 240));
			FlxControl.player1.setFireButton("SPACE", FlxControlHandler.KEYMODE_PRESSED, 200, this.gun.fire);
			
			//maxVelocity = new FlxPoint(200, 200);
			//drag.x = maxVelocity.x * SPDVAR;
			//drag.y = maxVelocity.y * SPDVAR;
			
			
		}
		
		override public function update():void {
			//acceleration.x = 0;
			//acceleration.y = 0;

			//handleInput();
		}
		
		private function handleInput():void
		{
			if(FlxG.keys.LEFT && this.x > LEFT_BOUNDS)
			{
				acceleration.x = -SPDVAR * maxVelocity.x;
			}
			else if(FlxG.keys.RIGHT && this.x < RIGHT_BOUNDS)
			{
				acceleration.x = SPDVAR * maxVelocity.x;
				
			}
			//else if (this.x == 15 || this.x == 325) {
				//
			//}
			else if (this.x < LEFT_BOUNDS) {
				acceleration.x = 0;
				this.x = LEFT_BOUNDS;
			}
			else if (this.x > RIGHT_BOUNDS) {
				acceleration.x = 0;
				this.x = RIGHT_BOUNDS;
			}
			
			if (FlxG.keys.justPressed("SPACE")) {
				trace("X: ", this.x, " Y: ", this.y);
				
			}

			/*if(FlxG.keys.UP)
			{
				acceleration.y = -SPDVAR * maxVelocity.y;
			}
			else if(FlxG.keys.DOWN)
			{
				acceleration.y = SPDVAR * maxVelocity.y;
			}*/
		}
	}

}