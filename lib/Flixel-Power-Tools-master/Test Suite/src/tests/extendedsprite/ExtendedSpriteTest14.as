package tests.extendedsprite 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ExtendedSpriteTest14 extends FlxState
	{
		//	Common variables
		public static var title:String = "Springs 3";
		public static var description:String = "Multiple Things on Springs!";
		private var instructions:String = "Multiple Things on Springs!";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		private var ball1:FlxExtendedSprite;
		private var ball2:FlxExtendedSprite;
		private var ball3:FlxExtendedSprite;
		private var debug:FlxSprite;
		
		public function ExtendedSpriteTest14() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	Enable the plugin - you only need do this once in your State (unless you destroy the plugin)
			if (FlxG.getPlugin(FlxMouseControl) == null)
			{
				FlxG.addPlugin(new FlxMouseControl);
			}
			
			ball1 = new FlxExtendedSprite(160, 120, AssetsRegistry.redPNG);
			ball1.enableMouseSpring(false);
			ball1.springOffsetX = 8;
			ball1.springOffsetY = 8;
			
			ball2 = new FlxExtendedSprite(160, 120, AssetsRegistry.greenPNG);
			ball2.enableMouseSpring(false, false, 0.1, 0.95, -5);
			ball2.springOffsetX = 8;
			ball2.springOffsetY = 8;
			
			ball3 = new FlxExtendedSprite(160, 120, AssetsRegistry.bluePNG);
			ball3.enableMouseSpring(false, false, 0.1, 0.95, 5);
			ball3.springOffsetX = 8;
			ball3.springOffsetY = 8;
			
			debug = new FlxSprite(0, 0).makeGraphic(FlxG.width, FlxG.height, 0x0);
			debug.solid = false;
			
			//	There seems to be a bug in Flixel where if you get the mouse and/or sprite well outside the camera zone via a COLLISION, the world scrolls!
			//	If you swing these balls a lot near the bottom of the test suite you'll see what I mean. Very strange indeed.
			
			add(debug);
			add(ball1);
			add(ball2);
			add(ball3);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			//	Draw the spring
			
			debug.fill(0x0);
			
			debug.drawLine(ball1.springX, ball1.springY, FlxG.mouse.x, FlxG.mouse.y, 0xffFFFFFF, 1);
			debug.drawLine(ball2.springX, ball2.springY, FlxG.mouse.x, FlxG.mouse.y, 0xffFFFFFF, 1);
			debug.drawLine(ball3.springX, ball3.springY, FlxG.mouse.x, FlxG.mouse.y, 0xffFFFFFF, 1);
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin otherwise resources will get messed right up after a while
			FlxMouseControl.clear();
			
			super.destroy();
		}
		
	}

}