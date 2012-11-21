package tests.weapon 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class WeaponTest8 extends FlxState
	{
		//	Common variables
		public static var title:String = "Weapon 8";
		public static var description:String = "Random Bullet Angles";
		private var instructions:String = "Left click to Fire. Random angle +20";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var tank:FlxSprite;
		private var land:FlxSprite;
		private var canon:FlxWeapon;
		
		public function WeaponTest8() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Our players tank
			tank = new FlxSprite(32, 200, AssetsRegistry.advWarsTankPNG);
			
			//	Creates our weapon. We'll call it "canon" and link it to the x/y coordinates of the tank sprite
			canon = new FlxWeapon("canon", tank, "x", "y");
			
			//	Tell the weapon to create 100 bullets using a 2x2 white pixel bullet
			canon.makePixelBullet(100, 2, 2, 0xffffffff, 13, 2);
			
			//	Bullets will move at 120px/sec
			canon.setBulletSpeed(200);
			
			//	But bullets will have gravity pulling them down to earth at a rate of 60px/sec
			canon.setBulletGravity(0, 120);
			
			//	As we use the mouse to fire we need to limit how many bullets are shot at once (1 every 50ms)
			canon.setFireRate(50);
			
			//	This allows bullets to live within the bounds rect (stops them visually falling lower than the road)
			canon.setBulletBounds(new FlxRect(0, 0, 320, 210));
			
			//	The bullets are fired at a fixed angle (-45 degrees) - this adds a +- 20 degree variance to each one
			canon.setBulletRandomFactor(20);
			
			//	Same land to drive over, yes, all stolen from Advanced Wars on the Gameboy
			land = new FlxSprite(0, 184, AssetsRegistry.advWarsLandPNG);
			
			add(land);
			
			//	The group which contains all of the bullets should be added, so it is displayed
			add(canon.group);
			
			add(tank);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			if (FlxG.mouse.pressed())
			{
				canon.fireFromAngle(-45);
			}
		}
		
	}

}