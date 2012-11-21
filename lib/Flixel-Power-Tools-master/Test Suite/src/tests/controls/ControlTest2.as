package tests.controls 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ControlTest2 extends FlxState
	{
		//	Common variables
		public static var title:String = "Controls 2";
		public static var description:String = "Platformer controls with jump";
		private var instructions:String = "LEFT/RIGHT to run, SPACE to jump";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var player:FlxSprite;
		private var scene:ControlTestScene2;
		
		public function ControlTest2() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific

			player = new FlxSprite(64, 150);
			player.loadGraphic(AssetsRegistry.chickPNG, true, true, 16, 18, true);
			
			//	The sprite is 16x18 in size, but that includes a little feather of hair on its head which we don't want to include in collision checks.
			//	We also shave 2 pixels off each side to make it slip through gaps easier. Changing the width/height does NOT change the visual sprite, just the bounding box used for physics.
			player.width = 12;
			player.height = 16;
			
			//	Because we've shaved a few pixels off, we need to offset the sprite to compensate
			player.offset.x = 2;
			player.offset.y = 2;
			
			//	The animation our sprite has
			player.addAnimation("idle", [0], 0, false);
			player.addAnimation("walk", [0, 1, 0, 2], 10, true);
			player.addAnimation("jump", [1], 0, false);
			
			//	Enable the plugin - you only need do this once (unless you destroy the plugin)
			if (FlxG.getPlugin(FlxControl) == null)
			{
				FlxG.addPlugin(new FlxControl);
			}
			
			//	Control the sprite
			FlxControl.create(player, FlxControlHandler.MOVEMENT_ACCELERATES, FlxControlHandler.STOPPING_DECELERATES, 1, true, false);
			FlxControl.player1.setCursorControl(false, false, true, true);
			FlxControl.player1.setJumpButton("SPACE", FlxControlHandler.KEYMODE_PRESSED, 200, FlxObject.FLOOR, 250, 200);
			
			//	Because we are using the MOVEMENT_ACCELERATES type the first value is the acceleration speed of the sprite
			//	Think of it as the time it takes to reach maximum velocity. A value of 100 means it would take 1 second. A value of 400 means it would take 0.25 of a second.
			FlxControl.player1.setMovementSpeed(400, 0, 100, 200, 400, 0);
			
			//	Set a downward gravity of 400px/sec
			FlxControl.player1.setGravity(0, 400);
			
			//	A basic scene for our chick to jump around
			scene = new ControlTestScene2;
			
			add(scene);
			add(player);
			
			//	Bring up the Flixel debugger if you'd like to watch these values in real-time
			FlxG.watch(player.acceleration, "x", "ax");
			FlxG.watch(player.acceleration, "y", "ay");
			FlxG.watch(player.velocity, "x", "vx");
			FlxG.watch(player.velocity, "y", "vy");
			FlxG.watch(player.maxVelocity, "x", "mx");
			FlxG.watch(player.maxVelocity, "y", "my");
			FlxG.watch(player.drag, "x", "dx");
			FlxG.watch(player.drag, "y", "dy");
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			FlxG.collide(player, scene.map);
			
			if (player.touching == FlxObject.FLOOR)
			{
				if (player.velocity.x != 0)
				{
					player.play("walk");
				}
				else
				{
					player.play("idle");
				}
			}
			else if (player.velocity.y < 0)
			{
				player.play("jump");
			}
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin otherwise resources will get messed right up after a while
			FlxControl.clear();
			
			super.destroy();
		}
		
		
	}

}