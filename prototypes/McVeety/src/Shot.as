package  
{
	import org.flixel.FlxSprite;
	/**
	 * ...
	 * @author Wayne Denier II
	 */
	public class Shot extends FlxSprite
	{
		var pixelsPerSecond = -200;
		
		[Embed(source = "shot.png")]
		private var ImgBullet:Class;
		
		public function Shot()
		{
			super(0, 0, ImgBullet);
			velocity.y = pixelsPerSecond;
		}
	}

}