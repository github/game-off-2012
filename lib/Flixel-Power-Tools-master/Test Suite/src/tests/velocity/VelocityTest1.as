package tests.velocity 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class VelocityTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "Velocity 1";
		public static var description:String = "Move an FlxObject towards another FlxObject";
		private var instructions:String = "Click with the mouse to position the green ball";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		private var red:FlxSprite;
		private var green:FlxSprite;
		private var blue:FlxSprite;
		
		public function VelocityTest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			red = new FlxSprite(160, 120, AssetsRegistry.redPNG);
			green = new FlxSprite(-32, 0, AssetsRegistry.greenPNG);
			blue = new FlxSprite(0, 0, AssetsRegistry.bluePNG);
			blue.visible = false;
			
			add(blue);
			add(red);
			add(green);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			if (FlxG.mouse.justReleased())
			{
				green.x = FlxG.mouse.screenX;
				green.y = FlxG.mouse.screenY;
				
				blue.x = red.x;
				blue.y = red.y;
				blue.visible = true;
				
				FlxVelocity.moveTowardsObject(blue, green, 180);
			}
		}
		
	}

}