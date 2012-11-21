package tests.weapon 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class WeaponTest6 extends FlxState
	{
		//	Common variables
		public static var title:String = "Weapon 6";
		public static var description:String = "Bullets shot at an angle";
		private var instructions:String = "Left and Right to Rotate. Control to Fire.";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var controls:FlxControlHandler;
		private var player:FlxSprite;
		private var lazer:FlxWeapon;
		
		public function WeaponTest6() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			header.showDarkBackground();
			
			//	Our players space ship
			player = new FlxSprite(160, 140);
			player.loadRotatedGraphic(AssetsRegistry.asteroidsShipPNG, 180, -1, true, true);
			
			//	Creates our weapon. We'll call it "lazer" and link it to the x/y coordinates of the player sprite
			lazer = new FlxWeapon("lazer", player, "x", "y");
			
			lazer.makePixelBullet(40, 2, 2, 0xff00e700, 5, 6);
			
			lazer.setBulletSpeed(200);
			
			//	The following are controls for the player, note that the "setFireButton" controls the speed at which bullets are fired, not the Weapon class itself
			
			//	Enable the plugin - you only need do this once (unless you destroy the plugin)
			if (FlxG.getPlugin(FlxControl) == null)
			{
				FlxG.addPlugin(new FlxControl);
			}
			
			//	Works
			//FlxControl.create(player, FlxControlHandler.MOVEMENT_INSTANT, FlxControlHandler.STOPPING_INSTANT, 1, false, false);
			
			//	Asteroids style movement
			FlxControl.create(player, FlxControlHandler.MOVEMENT_ACCELERATES, FlxControlHandler.STOPPING_DECELERATES, 1, false, false);
			//FlxControl.player1.setRotationType(FlxControlHandler.ROTATION_INSTANT, FlxControlHandler.ROTATION_STOPPING_INSTANT);
			FlxControl.player1.setDeceleration(100, 100);
			
			
			//	If you have ROTATION_STOPPING_DECELERATES then you need to give a Deceleration value equal to the rotation speed
			FlxControl.player1.setRotationSpeed(400, 400, 200, 400);
			FlxControl.player1.setRotationType(FlxControlHandler.ROTATION_ACCELERATES, FlxControlHandler.ROTATION_STOPPING_DECELERATES);
			FlxControl.player1.setRotationKeys();
			FlxControl.player1.setThrust("UP", 100, "DOWN", 50);
			
			//	This is what fires the actual bullets (pressing SPACE) at a rate of 1 bullet per 50 ms, hooked to the lazer.fire method
			FlxControl.player1.setFireButton("CONTROL", FlxControlHandler.KEYMODE_PRESSED, 50, lazer.fireFromParentAngle);
			
			//	The group which contains all of the bullets should be added so it is displayed
			add(lazer.group);
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