package tests.controls 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ControlTest5 extends FlxState
	{
		//	Common variables
		public static var title:String = "Controls 5";
		public static var description:String = "Acceleration and Deceleration Example";
		private var instructions:String = "Move with the cursor / arrow keys";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var player:FlxSprite;
		private var scene:ControlTestScene1;
		
		public function ControlTest5() 
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

			player = new FlxSprite(64, 64);
			player.loadGraphic(AssetsRegistry.humstarPNG, true, false, 32, 32, true);
			player.elasticity = 0.8;
			player.addAnimation("boing", [0,1,2,3,4,5,6], 10, true);
			player.play("boing");
			
			//	Control the player
			
			FlxControl.create(player, FlxControlHandler.MOVEMENT_ACCELERATES, FlxControlHandler.STOPPING_DECELERATES);
			FlxControl.player1.setMovementSpeed(200, 200, 200, 200, 100, 100);
			
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