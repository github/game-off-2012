package tests.weapon 
{
	import flash.display.BitmapData;
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class WeaponTest9 extends FlxState
	{
		//	Common variables
		public static var title:String = "Weapon 9";
		public static var description:String = "Destructable Terrain";
		private var instructions:String = "Mouse to aim and fire. 1-3 change damage size.";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var tank:FlxSprite;
		private var land:FlxSprite;
		private var canon:FlxWeapon;
		private var damageSize:int = 2;
		
		public function WeaponTest9() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	Our players tank
			tank = new FlxSprite(16, 132, AssetsRegistry.advWarsTankPNG);
			
			//	Creates our weapon. We'll call it "canon" and link it to the x/y coordinates of the tank sprite
			canon = new FlxWeapon("canon", tank, "x", "y");
			
			//	Tell the weapon to create 100 bullets using a 2x2 white pixel bullet
			canon.makePixelBullet(100, 2, 2, 0xffffffff, 13, 2);
			
			//	Bullets will move at 120px/sec
			canon.setBulletSpeed(120);
			
			//	But bullets will have gravity pulling them down to earth at a rate of 60px/sec
			canon.setBulletGravity(0, 60);
			
			//	As we use the mouse to fire we need to limit how many bullets are shot at once (1 every 50ms)
			canon.setFireRate(50);
			
			//	The picture we'll slowly blow to pieces
			land = new FlxSprite(120, 48, AssetsRegistry.overdoseEyePNG);
			
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
				canon.fireAtMouse();
			}
			
			if (FlxG.keys.ONE)
			{
				damageSize = 2;
			}
			else if (FlxG.keys.TWO)
			{
				damageSize = 4;
			}
			else if (FlxG.keys.THREE)
			{
				damageSize = 8;
			}
			
			FlxG.overlap(canon.group, land, erasePartOfLand);
		}
		
		private function erasePartOfLand(bullet:FlxObject, theLand:FlxObject):void
		{
			if (FlxCollision.pixelPerfectCheck(bullet as FlxSprite, land))
			{
				//	Work out where into the image the bullet has landed
				var offsetX:int = bullet.x - land.x;
				var offsetY:int = bullet.y - land.y;
				
				//	Grab the BitmapData from the image, so we can modify it
				var temp:BitmapData = land.pixels;
				
				//	This erases a rect area of the image - but you could also draw a circle into it, or anything really
				temp.fillRect(new Rectangle(offsetX, offsetY, damageSize, damageSize), 0x0);
				
				//	Write it back again
				land.pixels = temp;
				
				//	And remove the bullet - you don't have to do this, it can make some interest effects if you don't!
				bullet.kill();
			}
		}
		
		override public function destroy():void
		{
			super.destroy();
		}
		
		
	}

}