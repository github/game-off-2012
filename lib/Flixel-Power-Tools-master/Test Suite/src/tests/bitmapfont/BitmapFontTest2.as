package tests.bitmapfont 
{
	import flash.display.BitmapData;
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class BitmapFontTest2 extends FlxState
	{
		//	Common variables
		private var header:TestsHeader;
		public static var title:String = "Bitmap Font 2";
		public static var description:String = "Bitmap Fonts are fast enough to use in real-time";
		private var instructions:String = "Move your mouse";
		
		//	Test specific variables
		[Embed(source = '../../../assets/fonts/knighthawks_font.png')] private var knighthawksFontPNG:Class;
		
		private var canvas:FlxSprite;
		private var font:FlxBitmapFont;
		
		public function BitmapFontTest2() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			canvas = new FlxSprite(32, 32).makeGraphic(256, 176, 0xff000000, true);
			canvas.drawLine(0, 0, canvas.width, 0, 0xffffffff);
			canvas.drawLine(0, canvas.height - 1, canvas.width, canvas.height - 1, 0xffffffff);
			
			//	We are going to update the text of this font in real-time, to reflect the mouse position
			font = new FlxBitmapFont(AssetsRegistry.knighthawksFontPNG, 31, 25, FlxBitmapFont.TEXT_SET2, 10, 1);
			font.setText("", true, 1, 8, FlxBitmapFont.ALIGN_LEFT);
			font.x = 64;
			font.y = 88;
			
			add(canvas);
			add(font);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			font.text = "x: " + FlxG.mouse.screenX + "\ny: " + FlxG.mouse.screenY;
		}
		
	}

}