package  
{
	/**
	 * ...
	 * @author Wayne Denier II
	 */
	
	
	import org.flixel.*;
	import org.flixel.plugin.DebugPathDisplay;
	import org.flixel.system.debug.WatchEntry;
	import org.flixel.system.FlxDebugger;
	import com.greensock.*;
	import com.greensock.easing.*;
	 
	public class GitEnemy extends FlxSprite
	{
		//private var mngr:DebugPathDisplay;
		[Embed(source = "GitEnemy.png")]
		private var ImgEnemy:Class;
		private var tween:TweenMax;
		private var enteredScreen:Boolean = false;
		
		public function GitEnemy(choice:int = 0) 
		{
			//mngr = new DebugPathDisplay();
			//pathToFollow = new FlxPath();
			//mngr.add(pathToFollow);
			var spawnCoords:FlxPoint = CreateTween.GetStartCoords(choice);
			super(spawnCoords.x, spawnCoords.y, ImgEnemy);
			tween = CreateTween.GenerateTween(this,choice);
		}
		
		override public function update():void {
			if (tween.currentProgress == 1) 
			{
				this.kill();
			}
			if (this.onScreen() && !enteredScreen) 
			{
				enteredScreen = true;
			}
			else if (!this.onScreen() && enteredScreen) 
			{
				this.kill();
			}
			//FlxG.log(this.angle);
			/*if (x > 200) {
				tween.kill();
				//this.kill();
			}*/
			//if (FlxG.mouse.justPressed()) {
				//pathToFollow.add(FlxG.mouse.screenX, FlxG.mouse.screenY);
				//
			//}
			//if (FlxG.keys.ENTER) {
				//followPath(pathToFollow,100,PATH_LOOP_FORWARD,false);
			//}
			//if (FlxG.keys.DELETE) {
				//delete pathToFollow;
				//pathToFollow = new FlxPath();
			//}
		}
	}

}