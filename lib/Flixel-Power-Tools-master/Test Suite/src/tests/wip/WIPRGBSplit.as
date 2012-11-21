package tests.wip 
{
	import flash.display.BitmapData;
	import flash.display.BitmapDataChannel;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FlxGradient;
	import tests.TestsHeader;
	import com.greensock.TweenMax;
	
	public class WIPRGBSplit extends FlxState
	{
		//	Common variables
		public static var title:String = "WIP 1";
		public static var description:String = "";
		private var instructions:String = "";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var pic:FlxSprite;
		
		private var red:FlxSprite;
		private var green:FlxSprite;
		private var blue:FlxSprite;
		
		public function WIPRGBSplit() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			header.showDarkBackground();
			
			//	Our texture
			
			pic = new FlxSprite(0, 0, AssetsRegistry.questarPNG);
			
			var r:BitmapData = new BitmapData(pic.width, pic.height, true, 0x00000000);
			var g:BitmapData = new BitmapData(pic.width, pic.height, true, 0x00000000);
			var b:BitmapData = new BitmapData(pic.width, pic.height, true, 0x00000000);
			
			//r.copyPixels(pic.pixels, pic.pixels.rect, new Point, null, null, 
			//r.c
			
			for (var y:int = 0; y < pic.height; y++)
			{
				for (var x:int = 0; x < pic.width; x++)
				{
					var color:Object = FlxColor.getRGB(pic.pixels.getPixel32(x, y));
					//var a:uint = int(color.alpha);
					var a:uint = int(color.alpha / 3);
					
					r.setPixel32(x, y, FlxColor.getColor32(a, color.red, 0, 0));
					g.setPixel32(x, y, FlxColor.getColor32(a, 0, color.green, 0));
					b.setPixel32(x, y, FlxColor.getColor32(a, 0, 0, color.blue));
				}
			}
			
			//r.copyChannel(pic.pixels, pic.pixels.rect, new Point, BitmapDataChannel.ALPHA, BitmapDataChannel.ALPHA);
			//r.copyChannel(pic.pixels, pic.pixels.rect, new Point, BitmapDataChannel.RED, BitmapDataChannel.RED);
			//
			//g.copyChannel(pic.pixels, new Rectangle(0, 0, pic.width, pic.height), new Point, BitmapDataChannel.ALPHA, BitmapDataChannel.ALPHA);
			//g.copyChannel(pic.pixels, new Rectangle(0, 0, pic.width, pic.height), new Point, BitmapDataChannel.GREEN, BitmapDataChannel.GREEN);
			//
			//b.copyChannel(pic.pixels, new Rectangle(0, 0, pic.width, pic.height), new Point, BitmapDataChannel.ALPHA, BitmapDataChannel.ALPHA);
			//b.copyChannel(pic.pixels, new Rectangle(0, 0, pic.width, pic.height), new Point, BitmapDataChannel.BLUE, BitmapDataChannel.BLUE);
			
			red = new FlxSprite(0, 0).makeGraphic(pic.width, pic.height);
			red.pixels = r;
			//red.alpha = 0.5;
			
			green = new FlxSprite(0, 0).makeGraphic(pic.width, pic.height);
			green.pixels = g;
			//green.alpha = 0.5;
			
			blue = new FlxSprite(0, 0).makeGraphic(pic.width, pic.height);
			blue.pixels = b;
			//blue.alpha = 0.5;
			
			red.y = 240;
			green.y = 240;
			blue.y = 240;
			
			add(red);
			add(green);
			add(blue);
			
			TweenMax.to(red, 1, { y: 0 } );
			TweenMax.to(green, 1, { y: 0, delay: 0.25 } );
			TweenMax.to(blue, 1, { y: 0, delay: 0.5 } );
		}
		
		override public function update():void
		{
			super.update();
		}
		
		override public function destroy():void
		{
			super.destroy();
		}
		
		
		
	}

}