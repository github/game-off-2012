package
{

	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.StarfieldFX;

	public class PlayState extends FlxState
	{
		/*var enemyCount = 0;
		var enemyMax = 50;*/
		private var stars:FlxSprite;
		private var starfield:StarfieldFX;
		
		override public function create():void
		{			
			FlxG.bgColor = 0xff333333;
			FlxG.debug = true;
			// Creates a 2D scrolling starfield with 200 stars in it, the full screen size
			if (FlxG.getPlugin(FlxSpecialFX) == null)
			{
				FlxG.addPlugin(new FlxSpecialFX);
			}
			starfield = FlxSpecialFX.starfield();
			stars = starfield.create(0, 0, FlxG.width, FlxG.height, 200, 1);
			starfield.setStarSpeed(0, 0.5);
			add(stars);
			
			super.create();
		}
		
		override public function update():void
		{
			/*if (enemyCount < enemyMax)
			{
				var enemy = new GitEnemy();
				enemy.x = (FlxG.width - enemy.width) * Math.random();
				enemy.y = (FlxG.height - enemy.height) * Math.random();
				add(enemy);
				enemyCount++;
			}*/
			
			super.update();
		}
	}
	
}

