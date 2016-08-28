package
{

	import mx.core.FlexSprite;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.BaseTypes.Bullet;
	import org.flixel.plugin.photonstorm.FX.StarfieldFX;

	public class PlayState extends FlxState
	{
		/*var enemyCount = 0;
		var enemyMax = 50;*/
		private var stars:FlxSprite;
		private var starfield:StarfieldFX;
		public var counter:int = 0;
		public var choice:int = 0;
		public var numDead:int;
		public var numAlive:int;
		private var groupArray:Array;
		private var player:GitShip;
		private var enemyGroup:FlxGroup;
		private var enemyPerSecond:Number = .5;
		private var timeSinceLastSpawn:Number = 0;
		
		override public function create():void
		{			
			FlxG.bgColor = 0xff333333;
			FlxG.debug = true;
			FlxG.worldBounds = new FlxRect(0, 0, 320, 240);
			
			// Creates a 2D scrolling starfield with 200 stars in it, the full screen size
			if (FlxG.getPlugin(FlxControl) == null)
			{
				FlxG.addPlugin(new FlxControl);
			}
			if (FlxG.getPlugin(FlxSpecialFX) == null)
			{
				FlxG.addPlugin(new FlxSpecialFX);
			}
			starfield = FlxSpecialFX.starfield();
			stars = starfield.create(0, 0, FlxG.width, FlxG.height, 200, 1);
			starfield.setStarSpeed(0, 0.5);
			add(stars);
			
			player = new GitShip();
			add(player.gun.group);
			add(player);
			enemyGroup = new FlxGroup(10);
			add(enemyGroup);
			//add(new GitEnemy());
			FlxG.watch(this, "counter");
			FlxG.watch(this, "choice");
			FlxG.watch(this, "numDead");
			FlxG.watch(this, "numAlive");
			
			
			
			super.create();
		}
		
		override public function update():void
		{
			if (counter >= 2 ) 
			{
				counter = 0;
				choice = (choice + 1) % CreateTween.numChoices;
			}
			
			numDead = enemyGroup.countDead();
			numAlive = enemyGroup.countLiving();
			// this is probably gonna be inefficent because its going to remove and new 
			for (var i:int = 0; i < numDead; i++) 
			{
				enemyGroup.remove(enemyGroup.getFirstDead(),true);
			}
			if (timeSinceLastSpawn >= enemyPerSecond &&  (enemyGroup.length < enemyGroup.maxSize))
			{
				//group.add(new GitEnemy());
				enemyGroup.add(new GitEnemy(choice));
				//trace("Length: ", group.length, " Max: ", group.maxSize);
				//trace("Alive: ", group.countLiving(), " Dead: ", group.countDead());
				timeSinceLastSpawn = 0;
				counter++;
			}
			player.gun.group.members
			timeSinceLastSpawn += FlxG.elapsed;
			if (FlxG.mouse.justPressed()) {
				FlxG.log(FlxG.mouse.screenX);
				FlxG.log(FlxG.mouse.screenY);
				
			}
			super.update();
			
			for each (var ship:FlxSprite in enemyGroup.members) 
			{
				
				for each (var bullet:FlxSprite in player.gun.group.members) 
				{
					if (FlxCollision.pixelPerfectCheck(ship, bullet)) 
					{
						bullet.kill();
						ship.kill();
					}
				}
			}
			
			
			
			
		}
		
		
	}
	
}

