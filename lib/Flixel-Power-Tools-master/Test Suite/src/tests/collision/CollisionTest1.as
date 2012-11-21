package tests.collision 
{
	import flash.display.BitmapData;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class CollisionTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "Collision 1";
		public static var description:String = "Pixel Perfect collision detection";
		private var instructions:String = "Move the mouse";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var ilkke:FlxSprite;
		private var green:FlxSprite;
		private var debug:FlxSprite;
		
		private var movingBall:Boolean;
		
		public function CollisionTest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			movingBall = true;
			
			ilkke = new FlxSprite(0, 0, AssetsRegistry.ilkkePNG);
			FlxDisplay.screenCenter(ilkke, true, true);
			
			green = new FlxSprite(160, 120, AssetsRegistry.greenPNG);
			debug = new FlxSprite(32, 32).makeGraphic(32, 32);
			
			add(ilkke);
			add(green);
			add(debug);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			//	This is just to show the debug collision area, you don't need this in a normal game!
			var temp:BitmapData = debug.pixels;
			temp = FlxCollision.debug;
			debug.pixels = temp;
			
			if (movingBall)
			{
				green.x = FlxG.mouse.screenX;
				green.y = FlxG.mouse.screenY;
			}
			else
			{
				ilkke.x = FlxG.mouse.screenX;
				ilkke.y = FlxG.mouse.screenY;
			}
			
			if (FlxG.mouse.justReleased())
			{
				//	Swap to move ilkke instead
				if (movingBall)
				{
					FlxDisplay.screenCenter(green, true, true);
					movingBall = false;
				}
				else
				{
					FlxDisplay.screenCenter(ilkke, true, true);
					movingBall = true;
				}
			}
			
			header.instructions.text = "Colliding: " + FlxCollision.pixelPerfectCheck(ilkke, green) + " - Click to change sprite";
		}
		
	}

}