package tests.weapon 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class WeaponTest3 extends FlxState
	{
		//	Common variables
		public static var title:String = "Weapon 3";
		public static var description:String = "Animated Bullets Example";
		private var instructions:String = "Left and Right to Move. Space to Fire.";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var controls:FlxControlHandler;
		private var player:FlxSprite;
		private var lazer:FlxWeapon;
		
		public function WeaponTest3() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			header.showDarkBackground();
			
			//	Our players space ship
			player = new FlxSprite(160, 200, AssetsRegistry.xenon2ShipPNG);
			
			//	Creates our weapon. We'll call it "lazer" and link it to the x/y coordinates of the player sprite
			lazer = new FlxWeapon("lazer", player, "x", "y");
			
			//	We're creating 20 animated bullets from the sprite sheet xenon2BombPNG. The frame width and height is 8x16.
			//	The animation goes through frames 1,2,3,4 and then loops at 30fps.
			//	The 12x6 at the end is the offset so the bullet appears from the middle of the ship, not the left-hand side.
			
			lazer.makeAnimatedBullet(20, AssetsRegistry.xenon2BombPNG, 8, 16, [1, 2, 3, 4], 30, true, 12, 6);
			
			//	Sets the direction and speed the bullets will be fired in. Slowed down on purpose so you can see the animation.
			lazer.setBulletDirection(FlxWeapon.BULLET_UP, 180);
			
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