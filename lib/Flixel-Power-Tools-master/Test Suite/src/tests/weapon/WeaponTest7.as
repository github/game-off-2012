package tests.weapon 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class WeaponTest7 extends FlxState
	{
		//	Common variables
		public static var title:String = "Weapon 7";
		public static var description:String = "Random Bullet Speed";
		private var instructions:String = "Left click to Fire at mouse";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var ufo:FlxSprite;
		private var lazer:FlxWeapon;
		
		public function WeaponTest7() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			header.showDarkBackground();
			
			//	Creates our weapon. We'll call it "lazer"
			lazer = new FlxWeapon("lazer");
			
			//	Tell the weapon to create 50 bullets using the chunkPNG image.
			lazer.makeImageBullet(50, AssetsRegistry.chunkPNG);
			
			//	This weapon will fire from a fixed (stationary) position
			lazer.setFiringPosition(160, 140, 12, 12);
			
			//	As we use the mouse to fire we need to limit how many bullets are shot at once (1 every 100ms)
			lazer.setFireRate(100);
			
			//	Bullets will move at 300px/sec
			lazer.setBulletSpeed(300);
			
			//	This gives the fired bullets a random speed adjustment of +- 100px/sec and offsets their launch x/y by +- 8px
			lazer.setBulletRandomFactor(0, 100, new FlxPoint(8, 8));
			
			//	This is a random speed of +- 200px/sec
			//lazer.setBulletRandomFactor(0, 200);
			
			//	Just some eye-candy, to make it look like a ufo is shooting :)
			ufo = new FlxSprite(160, 140, AssetsRegistry.ufoPNG);
			
			//	The group which contains all of the bullets
			add(lazer.group);
			
			add(ufo);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			if (FlxG.mouse.pressed())
			{
				lazer.fireAtMouse();
			}
		}
		
	}

}