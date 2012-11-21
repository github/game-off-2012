package tests.extendedsprite 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ExtendedSpriteTest6 extends FlxState
	{
		//	Common variables
		public static var title:String = "Balls MiniGame";
		public static var description:String = "Click all the sprites fast!";
		private var instructions:String = "Click all balls before times up!";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		private var clock:FlxDelay;
		private var timer:FlxText;
		private var balls:FlxGroup;
		
		public function ExtendedSpriteTest6() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	Enable the plugin - you only need do this once in your State (unless you destroy the plugin)
			if (FlxG.getPlugin(FlxMouseControl) == null)
			{
				FlxG.addPlugin(new FlxMouseControl);
			}
			
			balls = new FlxGroup(32);
			
			//	Creates 32 ball sprites that start with a random velocity and all rebound off each other
			//	They are clickable (pixel perfect only) and when clicked call the spriteClicked function
			for (var i:int = 0; i < 32; i++)
			{
				var tempBall:FlxExtendedSprite = new FlxExtendedSprite(160, 16);
				tempBall.loadGraphic(AssetsRegistry.ballsPNG, true, false, 17, 17);
				tempBall.frame = int(Math.random() * tempBall.frames);
				tempBall.velocity.x = -100 + Math.random() * 200;
				tempBall.velocity.y = Math.random() * 100;
				tempBall.elasticity = 1;
				tempBall.enableMouseClicks(true, true);
				tempBall.mousePressedCallback = spriteClicked;
				balls.add(tempBall);
			}
			
			//	Displays the amount of time we have left in the middle
			timer = new FlxText(0, 64, FlxG.width);
			timer.alignment = "center";
			timer.size = 100;
			timer.alpha = 0.3;
			timer.shadow = 0xff000000;
			
			//	Walls for the balls to rebound off, positioned just outside the screen edges
			add(FlxCollision.createCameraWall(FlxG.camera, FlxCollision.CAMERA_WALL_OUTSIDE, 16, true));
			
			//	A 30-second timer to beat
			clock = new FlxDelay(1000 * 30);
			timer.text = clock.secondsRemaining.toString();
			clock.start();
			
			add(timer);
			add(balls);
			
			//	Header overlay
			add(header.overlay);
		}
		
		/**
		 * This function is called when the sprite is clicked (mouse down)
		 * 
		 * @param	obj		The FlxExtendedSprite that was clicked (in the case of this test it's always atari)
		 * @param	x		The x coordinate WITHIN THE SPRITE that was clicked, calculated from its origin
		 * @param	y		The y coordinate WITHIN THE SPRITE that was clicked, calculated from its origin
		 */
		private function spriteClicked(obj:FlxExtendedSprite, x:int, y:int):void
		{
			obj.kill();
			
			if (balls.countLiving() == 0 && clock.hasExpired == false)
			{
				timer.text = "WON!";
				header.instructions.text = "Balls Left: " + balls.countLiving();
				clock.abort();
			}
			else
			{
				header.instructions.text = "Balls Left: " + balls.countLiving();
			}
		}
		
		override public function update():void
		{
			super.update();
			
			if (clock.hasExpired)
			{
				if (balls.countLiving() > 0)
				{
					timer.text = "LOST";
				}
				remove(balls);
			}
			else
			{
				timer.text = clock.secondsRemaining.toString();
				FlxG.collide();
			}
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin otherwise resources will get messed right up after a while
			FlxMouseControl.clear();
			
			super.destroy();
		}
		
	}

}