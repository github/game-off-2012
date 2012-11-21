package tests.controls 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ControlTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "Controls 1";
		public static var description:String = "Basic cursor key movement";
		private var instructions:String = "Move with the cursor / arrow keys";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var player:FlxSprite;
		private var scene:ControlTestScene1;
		
		public function ControlTest1() 
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

			player = new FlxSprite(64, 64, AssetsRegistry.ufoPNG);
			
			//	Control the player
			FlxControl.create(player, FlxControlHandler.MOVEMENT_INSTANT, FlxControlHandler.STOPPING_INSTANT);
			FlxControl.player1.setStandardSpeed(100, false);
			
			//	setStandardSpeed is a special short-cut function, you can get more control (and the same result) by calling this instead:
			//FlxControl.player1.setMovementSpeed(100, 100, 100, 100);
			
			//	A basic scene for our ufo to fly around
			scene = new ControlTestScene1;
			
			//	Bring up the Flixel debugger if you'd like to watch these values in real-time
			FlxG.watch(player.velocity, "x", "vx");
			FlxG.watch(player.velocity, "y", "vy");
			
			add(scene);
			add(player);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			FlxG.collide(player, scene.map);
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin otherwise resources will get messed right up after a while
			FlxControl.clear();
			
			super.destroy();
		}
		
	}

}