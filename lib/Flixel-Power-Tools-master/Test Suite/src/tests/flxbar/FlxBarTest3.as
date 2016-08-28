package tests.flxbar 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class FlxBarTest3 extends FlxState
	{
		//	Common variables
		public static var title:String = "FlxBar 3";
		public static var description:String = "Mini-game example";
		private var instructions:String = "Mouse to shoot. Kill them all!";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var baddies:FlxGroup;
		private var baddieHealth:FlxGroup;
		private var lazer:FlxWeapon;
		
		public function FlxBarTest3() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			header.showDarkBackground();
			
			//	Let's make some baddies
			
			baddies = new FlxGroup(20);
			baddieHealth = new FlxGroup(20);
			
			for (var b:int = 0; b < 20; b++)
			{
				var baddie:FlxSprite = new FlxSprite(FlxMath.rand(24, FlxG.width - 24), FlxMath.rand(32, FlxG.height - 60), AssetsRegistry.ufoPNG);
				baddie.health = 100;
				baddie.immovable = true;
				
				if (FlxMath.chanceRoll())
				{
					baddie.velocity.x = FlxMath.rand( -30, -60);
				}
				else
				{
					baddie.velocity.x = FlxMath.rand( 30, 60);
				}
				
				var badHealth:FlxBar = new FlxBar(0, 0, FlxBar.FILL_LEFT_TO_RIGHT, 32, 4, baddie, "health");
				badHealth.trackParent(0, -6);
				badHealth.killOnEmpty = true;
				
				baddies.add(baddie);
				baddieHealth.add(badHealth);
			}
			
			//	Creates our weapon. We'll call it "lazer"
			lazer = new FlxWeapon("lazer");
			
			//	Tell the weapon to create 50 bullets using the chunkPNG image.
			lazer.makeImageBullet(50, AssetsRegistry.chunkPNG);
			
			//	This weapon will fire from a fixed (stationary) position
			lazer.setFiringPosition(160, 250);
			
			//	As we use the mouse to fire we need to limit how many bullets are shot at once (1 every 100ms)
			lazer.setFireRate(100);
			
			//	Bullets will move at 300px/sec
			lazer.setBulletSpeed(300);
			
			add(baddieHealth);
			add(baddies);
			add(lazer.group);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			FlxG.collide(lazer.group, baddies, blasted);
			
			if (FlxG.mouse.pressed())
			{
				lazer.fireAtMouse();
			}
			
			//	Keep the ships on-screen :)
			
			for each (var baddie:FlxSprite in baddies.members)
			{
				if (baddie.exists)
				{
					FlxDisplay.screenWrap(baddie);
				}
			}
		}
		
		private function blasted(bullet:FlxSprite, baddie:FlxSprite):void
		{
			bullet.kill();
			
			baddie.hurt(10);
		}
		
	}

}