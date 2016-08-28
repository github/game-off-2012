package tests.controls 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.StarfieldFX;
	import tests.TestsHeader;

	public class ControlTest7 extends FlxState
	{
		//	Common variables
		public static var title:String = "Controls 7";
		public static var description:String = "Classic Asteroids movement";
		private var instructions:String = "Left/Right to Rotate. Up to Thrust";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var player:FlxSprite;
		
		public function ControlTest7() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//header.showBlackBackground();
			
			//	Enable the plugin - you only need do this once (unless you destroy the plugin)
			if (FlxG.getPlugin(FlxControl) == null)
			{
				FlxG.addPlugin(new FlxControl);
			}

			player = new FlxSprite(160, 140);
			player.loadRotatedGraphic(AssetsRegistry.asteroidsShipPNG, 180, -1, true, true);
			
			//	We want the motion of the ship to accelerate and decelerate smoothly ...
			FlxControl.create(player, FlxControlHandler.MOVEMENT_ACCELERATES, FlxControlHandler.STOPPING_DECELERATES, 1, false, false);
			
			//	The UP key will thrust the ship at a speed of 100px/sec/2
			FlxControl.player1.setThrust("UP", 100);
			
			//	And when it's not thrusting, this is the speed at which the ship decelerates back to a stand-still
			FlxControl.player1.setDeceleration(100, 100);
			
			//	They can also rotate it - rotation will accelerate and decelerate (giving it a smoothing off effect)
			FlxControl.player1.setRotationType(FlxControlHandler.ROTATION_ACCELERATES, FlxControlHandler.ROTATION_STOPPING_DECELERATES);
			
			//	The rotation speeds - 400 for CCW and CW rotation, 200 as the max rotation speed and 400 for deceleration
			FlxControl.player1.setRotationSpeed(400, 400, 200, 400);
			
			//	Set the rotation keys - the default is to use LEFT/RIGHT arrows, so we don't actually need to pass anything here! but they can be whatever you need
			FlxControl.player1.setRotationKeys();
			
			add(player);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			FlxDisplay.screenWrap(player);
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin otherwise resources will get messed right up after a while
			FlxControl.clear();
			
			super.destroy();
		}
		
	}

}