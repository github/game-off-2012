package  
{
	/**
	 * ...
	 * @author Wayne Denier II
	 */
	
	import org.flixel.*;
	 
	public class GitEnemy extends FlxSprite
	{
		[Embed(source = "GitEnemy.png")]
		private var ImgEnemy:Class;
		
		public function GitEnemy() 
		{
			super(0, 0, ImgEnemy);
			velocity.x = -50 + 100 * Math.random();
			velocity.y = -50 + 100 * Math.random();
		}
	}

}