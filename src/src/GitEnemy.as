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
		[Embed(source = "GitEnemy.png")]
		private var ImgEnemy:Class;
		private var tween:TweenMax;
		
		public function GitEnemy() 
		{			
			super(0, 0, ImgEnemy);
			//tween = new TweenMax(this, 5, {bezier:[{x:0, y:240}, {x:320, y:240}], orientToBezier:[["x", "y", "angle", 0, 0.01]], ease:Linear.easeNone } );
			velocity.y = 100 * Math.random();
		}
	}

}