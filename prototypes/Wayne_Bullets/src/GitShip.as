package  
{
	/**
	 * ...
	 * @author Wayne Denier II
	 */
	
	import org.flixel.*;
	 
	public class GitShip extends FlxSprite
	{
		[Embed(source = "GitShip.png")]
		private var ImgShip:Class;
		
		public function GitShip() {
			super(150, 100, ImgShip);
		}
		
		override public function update():void {
			velocity.x = 0;
			velocity.y = 0;

			if(FlxG.keys.LEFT)
			{
				velocity.x = -150;
			}
			else if(FlxG.keys.RIGHT)
			{
				velocity.x = 150;
			}

			if(FlxG.keys.UP)
			{
				velocity.y = -150;
			}
			else if(FlxG.keys.DOWN)
			{
				velocity.y = 150;
			}
		}
	}

}