package tests.extendedsprite 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ExtendedSpriteTest12 extends FlxState
	{
		//	Common variables
		public static var title:String = "Springs 1";
		public static var description:String = "Thing on a Spring!";
		private var instructions:String = "A sprite on the end of a Spring";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		private var ball:FlxExtendedSprite;
		private var debug:FlxSprite;
		
		public function ExtendedSpriteTest12() 
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
			
			ball = new FlxExtendedSprite(160, 120, AssetsRegistry.redPNG);
			
			//	Adds a Mouse Spring to this sprite. The first parameter (false) means the spring is always active.
			ball.enableMouseSpring(false);
			
			//	As the sprite is 16x16 and we want the spring to attach to the middle of it, we need an 8x8 offset
			ball.springOffsetX = 8;
			ball.springOffsetY = 8;
			
			//	This is just to draw the spring on, to make it visible
			debug = new FlxSprite(0, 0).makeGraphic(FlxG.width, FlxG.height, 0x0);
			
			add(debug);
			add(ball);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			//	Draw the spring line to the debug sprite
			debug.fill(0x0);
			debug.drawLine(ball.springX, ball.springY, FlxG.mouse.x, FlxG.mouse.y, 0xffFFFFFF, 1);
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin otherwise resources will get messed right up after a while
			FlxMouseControl.clear();
			
			super.destroy();
		}
		
	}

}