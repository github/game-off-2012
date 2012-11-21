package tests.weapon 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class WeaponTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "Weapon 1";
		public static var description:String = "Space Invaders Example";
		private var instructions:String = "LEFT / RIGHT to Move. Space to Fire.";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var player:FlxSprite;
		private var lazer:FlxWeapon;
		
		public function WeaponTest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	Our players space ship
			player = new FlxSprite(160, 200, AssetsRegistry.invaderPNG);
			
			//	Creates our weapon. We'll call it "lazer" and link it to the x/y coordinates of the player sprite
			lazer = new FlxWeapon("lazer", player, "x", "y");
			
			//	Tell the weapon to create 50 bullets using the bulletPNG image.
			//	The 5 value is the x offset, which makes the bullet fire from the tip of the players ship.
			lazer.makeImageBullet(50, AssetsRegistry.bulletPNG, 5);
			
			//	Sets the direction and speed the bullets will be fired in
			lazer.setBulletDirection(FlxWeapon.BULLET_UP, 200);
			
			
			//	The following are controls for the player, note that the "setFireButton" controls the speed at which bullets are fired, not the Weapon class itself
			
			//	Enable the plugin - you only need do this once (unless you destroy the plugin)
			if (FlxG.getPlugin(FlxControl) == null)
			{
				FlxG.addPlugin(new FlxControl);
			}
			
			FlxControl.create(player, FlxControlHandler.MOVEMENT_INSTANT, FlxControlHandler.STOPPING_INSTANT, 1, false, false);
			FlxControl.player1.setMovementSpeed(200, 0, 200, 0);
			FlxControl.player1.setCursorControl(false, false, true, true);
			FlxControl.player1.setBounds(16, 200, 280, 16);
			
			//	This is what fires the actual bullets (pressing SPACE) at a rate of 1 bullet per 250 ms, hooked to the lazer.fire method
			FlxControl.player1.setFireButton("SPACE", FlxControlHandler.KEYMODE_PRESSED, 250, lazer.fire);
			
			//	The group which contains all of the bullets should be added so it is displayed
			add(lazer.group);
			
			add(player);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
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