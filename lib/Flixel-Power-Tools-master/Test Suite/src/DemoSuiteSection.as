package  
{
	import org.flixel.*;

	public class DemoSuiteSection extends FlxGroup
	{
		
		public function DemoSuiteSection(demos:Array, pic:Class = null, picX:int = 0, picY:int = 0) 
		{
			//	+1 incase there is a picture taking up an array slot
			super(demos.length + 1);
			
			//	If there's a picture we right-align it and put it behind the buttons
			if (pic)
			{
				var picture:FlxSprite = new FlxSprite(picX, picY, pic);
				
				if (picX == 0 && picY == 0)
				{
					picture.x = 640 - picture.width;
					picture.y = 256 - picture.height;
				}
				
				add(picture);
			}
			
			//	And now the buttons
			
			var bx:int = 336;
			var by:int = 64;
			var i:int = 0;
			
			for each (var demo:Class in demos)
			{
				add(new DemoButton(bx, by, demo));
				
				i++;
				
				if (i == 7)
				{
					bx += 100;
					by = 64;
					i = 0;
				}
				else
				{
					by += 24;
				}
			}
		}
		
	}

}