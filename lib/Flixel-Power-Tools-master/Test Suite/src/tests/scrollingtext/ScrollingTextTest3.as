package tests.scrollingtext 
{
	import flash.display.BitmapData;
	import flash.geom.Rectangle;
	import flash.display.BlendMode;
	
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;

	import com.greensock.TweenMax;
	import com.greensock.easing.Sine;
	import tests.TestsHeader;
	
	public class ScrollingTextTest3 extends FlxState
	{
		//	Common variables
		public static var title:String = "Text Scroller 3";
		public static var description:String = "Vertical and angled scrolling text";
		private var instructions:String = "Kicking it old-skool";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var a:uint = 0;
		
		private var font1:FlxBitmapFont;
		private var font2:FlxBitmapFont;
		private var font3:FlxBitmapFont;
		
		private var verticalScroller:FlxSprite;
		private var angledScroller:FlxSprite;
		private var scaledScroller:FlxSprite;
		
		public function ScrollingTextTest3() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	If the FlxScrollingText Plugin isn't already in use, we add it here
			if (FlxG.getPlugin(FlxScrollingText) == null)
			{
				FlxG.addPlugin(new FlxScrollingText);
			}

			header.showDarkBackground();
			
			//	Some waffle
			var scrollText:String = "WELCOME!   THIS IS AN EXAMPLE OF SCROLLING BITMAP FONTS IN FLIXEL NICE AND EASY LIKE. YOU CAN ROTATE, ALPHA, SCALE AND BLEND THEM AS MUCH AS YOU LIKE... ";
			scrollText = scrollText.concat("WOW I HATE WRITING SCROLL TEXTS! I HATED IT 20 YEARS AGO, AND I HATE IT NOW!       SO LETS WRAP ..........               ");
			
			//	Create our FlxBitmapFonts in the usual way
			font1 = new FlxBitmapFont(AssetsRegistry.steelFontPNG, 32, 32, FlxBitmapFont.TEXT_SET10 + "0123456789.!?\"", 10);
			font2 = new FlxBitmapFont(AssetsRegistry.metalFontPNG, 46, 48, FlxBitmapFont.TEXT_SET10 + "0123456789?!().,", 6, 2, 2);
			font3 = new FlxBitmapFont(AssetsRegistry.knightHawksPurpleFontPNG, 31, 25, FlxBitmapFont.TEXT_SET6, 10, 1, 1);
			
			//	This one will be rotated the full 360 in real-time (no pre-bakes)
			angledScroller = FlxScrollingText.add(font2, new Rectangle(0, 100, 320, 48), 2, 0, scrollText);
			
			//	Vertically scrolling text using flixel angle
			verticalScroller = FlxScrollingText.add(font1, new Rectangle(0, 104, 240, 32), 2, 0, scrollText);
			verticalScroller.angle = 90;
			verticalScroller.x = -100;
			
			//	Normal horizontal scroller, but scaled x6 larger and alpha'd a little
			scaledScroller = FlxScrollingText.add(font3, new Rectangle(0, 106, 320, 25), 1, 0, scrollText);
			scaledScroller.scale = new FlxPoint(6, 6);
			scaledScroller.alpha = 0.8;
			
			//	Just moves it around, comment out if you don't have greensock.swc linked in (i.e. aren't on FlashDevelop)
			TweenMax.to(verticalScroller, 2, { x: 180, yoyo: true, repeat: -1, ease: Sine.easeInOut } );
			
			add(scaledScroller);
			add(angledScroller);
			add(verticalScroller);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			a++;
			
			angledScroller.angle = FlxMath.wrapValue(a, 1, 360);
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin otherwise it'll crash when changing state
			FlxScrollingText.clear();
			
			super.destroy();
		}
		
	}

}