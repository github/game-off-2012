package games.missilecommand 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.FlxWeapon;

	public class PlayState extends FlxState
	{
		[Embed(source = '../../../assets/games/missile-command/cursor.png')] private var cursorPNG:Class;
		[Embed(source = '../../../assets/games/missile-command/land1.png')] private var landPNG:Class;
		
		private var land:FlxSprite;
		
		private var city1:City;
		private var city2:City;
		private var city3:City;
		private var city4:City;
		private var city5:City;
		private var city6:City;
		
		private var flak:FlxWeapon;
		
		public function PlayState() 
		{
		}
		
		override public function create():void
		{
			FlxG.mouse.load(cursorPNG, 2, -5, -5);
			
			land = new FlxSprite(0, 200, landPNG);
			
			city1 = new City(4, land.y);
			city2 = new City(84, land.y);
			city3 = new City(123, land.y);
			city4 = new City(162, land.y);
			city5 = new City(201, land.y);
			city6 = new City(284, land.y);
			
			flak = new FlxWeapon("flak");
			flak.setBulletSpeed(100);
			flak.setFireRate(100);
			flak.makePixelBullet(50);
			
			FlxG.mouse.show();
			
			add(land);
			add(city1);
			add(city2);
			add(city3);
			add(city4);
			add(city5);
			add(city6);
			
			add(flak.group);
		}
		
		override public function update():void
		{
			super.update();
			
			if (FlxG.mouse.pressed())
			{
				if (FlxG.mouse.screenX < 160)
				{
					flak.setFiringPosition(59, land.y);
				}
				else
				{
					flak.setFiringPosition(259, land.y);
				}
					
				flak.fireAtMouse();
			}
		}
		
	}

}