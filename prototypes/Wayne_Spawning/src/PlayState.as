package
{

	import org.flixel.*;

	public class PlayState extends FlxState
	{
		var enemyCount = 0;
		var enemyMax = 50;
		
		override public function create():void
		{			
			FlxG.bgColor = 0xff333333;
			
			var player = new GitShip();
			add(player);
		}
		
		override public function update():void
		{
			if (enemyCount < enemyMax)
			{
				var enemy = new GitEnemy();
				enemy.x = (FlxG.width - enemy.width) * Math.random();
				enemy.y = (FlxG.height - enemy.height) * Math.random();
				add(enemy);
				enemyCount++;
			}
			
			super.update();
		}
	}
	
}

