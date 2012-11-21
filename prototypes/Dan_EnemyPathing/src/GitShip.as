package  
{
	/**
	 * ...
	 * @author Wayne Denier II
	 */
	
	import org.flixel.*;
	 
	public class GitShip extends FlxSprite
	{
		private const SPDVAR:Number = 2;
		
		[Embed(source = "GitShip.png")]
		private var ImgShip:Class;
		
		public function GitShip() {
			super(150, 100, ImgShip);
			
			maxVelocity = new FlxPoint(200, 200);
			
			drag.x = maxVelocity.x * SPDVAR;
			drag.y = maxVelocity.y * SPDVAR;
		}
		
		override public function update():void {
			acceleration.x = 0;
			acceleration.y = 0;

			handleInput();
		}
		
		private function handleInput():void
		{
			if(FlxG.keys.LEFT)
			{
				acceleration.x = -SPDVAR * maxVelocity.x;
			}
			else if(FlxG.keys.RIGHT)
			{
				acceleration.x = SPDVAR * maxVelocity.x;
				
			}

			if(FlxG.keys.UP)
			{
				acceleration.y = -SPDVAR * maxVelocity.y;
			}
			else if(FlxG.keys.DOWN)
			{
				acceleration.y = SPDVAR * maxVelocity.y;
			}
		}
	}

}