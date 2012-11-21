package tests.weapon 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class WeaponTest10 extends FlxState
	{
		//	Common variables
		public static var title:String = "Weapon 10";
		public static var description:String = "Bullets with fixed life spans";
		private var instructions:String = "Left click to Fire. Bullets live for 2 seconds.";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var walls:FlxGroup;
		private var ufo:FlxSprite;
		private var lazer:FlxWeapon;
		
		public function WeaponTest10() 
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
			
			//	As we use the mouse to fire we need to limit how many bullets are shot at once (1 every 200ms)
			lazer.setFireRate(200);
			
			//	Bullets will move at 200px/sec
			lazer.setBulletSpeed(200);
			
			//	And have a fixed lifespan of 2 seconds
			lazer.setBulletLifeSpan(2000);
			
			//	You can also set a variance in the lifespan using this function:
			//	The below will set the lifespan to be +- 1 second
			//lazer.setBulletRandomFactor(0, 0, null, 1000);
			
			//	Just makes the bullets bounce (Rubber bullets)
			lazer.setBulletElasticity(0.5);
			
			//	Some eye-candy, to make it look like a ufo is shooting :)
			ufo = new FlxSprite(160, 140, AssetsRegistry.ufoPNG);
			
			walls = FlxCollision.createCameraWall(FlxG.camera, FlxCollision.CAMERA_WALL_INSIDE, 32, false);
			
			//	The group which contains all of the bullets
			add(lazer.group);
			add(ufo);
			add(walls);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			FlxG.collide(lazer.group, walls);
			
			if (FlxG.mouse.pressed())
			{
				lazer.fireAtMouse();
			}
		}
		
	}

}