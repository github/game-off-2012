package tests.controls 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ControlTest4 extends FlxState
	{
		//	Common variables
		public static var title:String = "Controls 4";
		public static var description:String = "Invaders sample";
		private var instructions:String = "LEFT / RIGHT to Move. Space to Fire.";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var controls:FlxControlHandler;
		private var player:FlxSprite;
		private var bullets:FlxGroup;
		
		public function ControlTest4() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	Enable the plugin - you only need do this once (unless you destroy the plugin)
			if (FlxG.getPlugin(FlxControl) == null)
			{
				FlxG.addPlugin(new FlxControl);
			}

			player = new FlxSprite(160, 200, AssetsRegistry.invaderPNG);
			
			//	Control the player
			FlxControl.create(player, FlxControlHandler.MOVEMENT_INSTANT, FlxControlHandler.STOPPING_INSTANT, 1, false, false);
			
			//	200 px/sec horizontal movement, no vertical movement
			FlxControl.player1.setMovementSpeed(200, 0, 200, 0);
			
			//	Arrow keys will move the player, but only left and right
			FlxControl.player1.setCursorControl(false, false, true, true);
			
			//	Enable the SPACE BAR as a fire button. They can keep fire held down (KEYMODE_PRESSED) and fire at a rate of 1 bullet per 200ms
			FlxControl.player1.setFireButton("SPACE", FlxControlHandler.KEYMODE_PRESSED, 200, fire);
			
			//	Restrict the player to this rectangular area
			FlxControl.player1.setBounds(16, 200, 280, 16);
			
			//	Bring up the Flixel debugger if you'd like to watch these values in real-time
			FlxG.watch(player.velocity, "x", "vx");
			FlxG.watch(player.velocity, "y", "vy");
			
			//	The following just makes some bullets to shoot
			bullets = new FlxGroup(10);
			
			for (var i:int = 0; i < 10; i++)
			{
				bullets.add(new FlxSprite(0, 0, AssetsRegistry.bulletPNG));
			}
			
			bullets.setAll("exists", false, false);
			
			add(bullets);
			add(player);
			
			//	Header overlay
			add(header.overlay);
		}
		
		private function fire():void
		{
			var bullet:FlxSprite = FlxSprite(bullets.getFirstAvailable());
			
			bullet.x = player.x + 5;
			bullet.y = player.y;
			bullet.velocity.y = -300;
			bullet.exists = true;
		}
		
		override public function update():void
		{
			super.update();
			
			for each (var bullet:FlxSprite in bullets.members)
			{
				if (bullet.exists && bullet.y < 0)
				{
					bullet.exists = false;
				}
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