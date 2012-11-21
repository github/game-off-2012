package tests.bitmapfont 
{
	import flash.display.BitmapData;
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class BitmapFontTest1 extends FlxState
	{
		//	Common variables
		private var header:TestsHeader;
		public static var title:String = "Bitmap Font 1";
		public static var description:String = "Using Bitmap Fonts in your games";
		private var instructions:String = "Using Bitmap Fonts in your games";
		
		//	Test specific variables
		private var canvas:FlxSprite;
		private var font:FlxBitmapFont;
		private var font2:FlxBitmapFont;
		
		public function BitmapFontTest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);

			//	Test specific
			
			canvas = new FlxSprite(14, 32).makeGraphic(256+36, 176, 0xff000000, true);
			canvas.drawLine(0, 0, canvas.width, 0, 0xffffffff);
			canvas.drawLine(0, canvas.height - 1, canvas.width, canvas.height - 1, 0xffffffff);
			
			//	This is a nice little 16x16 sized golden font (from the Atari ST game Wings of Death by Thalion)
			
			font = new FlxBitmapFont(AssetsRegistry.goldFontPNG, 16, 16, "!     :() ,?." + FlxBitmapFont.TEXT_SET10, 20, 0, 0);
			font.setText("using bitmap fonts\nin flixel is", true, 0, 8, FlxBitmapFont.ALIGN_CENTER, false);
			FlxDisplay.screenCenter(font);
			font.y = 64;
			
			//	This is a great 32x32 chunky font
			
			font2 = new FlxBitmapFont(AssetsRegistry.bluepinkFontPNG, 32, 32, FlxBitmapFont.TEXT_SET2, 10);
			font2.setText("easy :)", true, 0, 8, FlxBitmapFont.ALIGN_CENTER);
			FlxDisplay.screenCenter(font2);
			font2.y = 128;
			
			add(canvas);
			add(font);
			add(font2);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
		}
		
	}

}