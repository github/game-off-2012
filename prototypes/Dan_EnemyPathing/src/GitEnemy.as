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
		
		public function GitEnemy() 
		{
			//mngr = new DebugPathDisplay();
			//pathToFollow = new FlxPath();
			//mngr.add(pathToFollow);
			
			super(0, 0, ImgEnemy);
			tween = new TweenMax(this, 5, {bezier:[{x:0, y:240}, {x:320, y:240}], orientToBezier:[["x", "y", "angle", 0, 0.01]], ease:Linear.easeNone } );
		}
		
		override public function update():void {
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