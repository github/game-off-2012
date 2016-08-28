package tests.controls 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ControlTest6 extends FlxState
	{
		//	Common variables
		public static var title:String = "Controls 6";
		public static var description:String = "Rotation and Thrust Example";
		private var instructions:String = "Left/Right to Rotate. Up/Down to Thrust/Reverse";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var player:FlxSprite;
		private var scene:ControlTestScene1;
		
		public function ControlTest6() 
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

			player = new FlxSprite(160, 120);
			player.loadRotatedGraphic(AssetsRegistry.thrustShipPNG, 180, -1, true, true);
			player.elasticity = 0.8;
			
			//	Control the player
			
			FlxControl.create(player, FlxControlHandler.MOVEMENT_ACCELERATES, FlxControlHandler.STOPPING_DECELERATES, 1, false, false);
			FlxControl.player1.setRotationSpeed(200, 200, 200, 300);
			FlxControl.player1.setRotationType(FlxControlHandler.ROTATION_INSTANT, FlxControlHandler.ROTATION_STOPPING_DECELERATES);
			FlxControl.player1.setRotationKeys();
			FlxControl.player1.setThrust("UP", 100, "DOWN", 100);
			FlxControl.player1.setMovementSpeed(0, 0, 200, 200, 100, 100);
			
			//	A basic scene for our ship to fly around
			scene = new ControlTestScene1;
			
			add(scene);
			add(player);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			FlxG.collide(player, scene.map);
			
			super.update();
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin otherwise resources will get messed right up after a while
			FlxControl.clear();
			
			super.destroy();
		}
		
	}

}