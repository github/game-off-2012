package tests.bitmapfont 
{
	import flash.display.BitmapData;
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class BitmapFontTest3 extends FlxState
	{
		//	Common variables
		private var header:TestsHeader;
		public static var title:String = "Bitmap Font 3";
		public static var description:String = "Using a fixed width and alignment";
		private var instructions:String = "Using a fixed width and alignment";
		
		//	Test specific variables
		private var canvas:FlxSprite;
		private var font1:FlxBitmapFont;
		private var font2:FlxBitmapFont;
		
		public function BitmapFontTest3() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);

			//	Test specific
			
			canvas = new FlxSprite(14, 32).makeGraphic(292, 176, 0xff000000, true);
			canvas.drawLine(0, 0, canvas.width, 0, 0xffffffff);
			canvas.drawLine(0, canvas.height - 1, canvas.width, canvas.height - 1, 0xffffffff);
			
			//	This font has a fixed width of 290px, and the text is aligned to the RIGHT of it
			font1 = new FlxBitmapFont(AssetsRegistry.knightHawksPurpleFontPNG, 31, 25, FlxBitmapFont.TEXT_SET6, 10, 1, 1);
			font1.setFixedWidth(290, FlxBitmapFont.ALIGN_RIGHT);
			font1.x = 16;
			font1.y = 48;
			
			//	This font has a fixed width of 290px, and the text is aligned in the CENTER of it
			font2 = new FlxBitmapFont(AssetsRegistry.knightHawksPurpleFontPNG, 31, 25, FlxBitmapFont.TEXT_SET6, 10, 1, 1);
			font2.setFixedWidth(290, FlxBitmapFont.ALIGN_CENTER);
			font2.x = 16;
			font2.y = 112;
			
			add(canvas);
			add(font1);
			add(font2);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			font1.text = "X " + FlxG.mouse.screenX;
			font2.text = "X " + FlxG.mouse.screenX;
		}
		
	}

}