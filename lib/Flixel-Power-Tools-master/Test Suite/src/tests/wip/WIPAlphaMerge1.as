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
	
	public class WIPAlphaMerge1 extends FlxState
	{
		//	Common variables
		public static var title:String = "WIP 1";
		public static var description:String = "";
		private var instructions:String = "";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var pic1:FlxSprite;
		private var pic2:FlxSprite;
		private var test:FlxText;
		private var output:FlxSprite;
		
		public function WIPAlphaMerge1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			header.showDarkBackground();
			
			//	Our texture
			pic1 = new FlxSprite(0, 0, AssetsRegistry.acrylBladeRunnerPNG);
			
			pic2 = new FlxSprite(0, 0, AssetsRegistry.alphaMaskPNG);
			
			//pic2 = new FlxSprite(0, 0);
			//pic2.loadRotatedGraphic(AssetsRegistry.alphaMaskPNG, 64, -1, false, false);
			
			//	Our funny white pattern thing
			//pic2 = new FlxSprite(0, 0).makeGraphic(100, 100, 0x0);
			//pic2.pixels.fillRect(new Rectangle(10, 10, 52, 52), 0x44ffffff);
			//pic2.pixels.fillRect(new Rectangle(50, 50, 52, 52), 0x88ffffff);
			//
			//test = new FlxText(0, 0, 200, "PHOTON STORM");
			//test.size = 20;
			//
			//var grad:BitmapData = FlxGradient.createGradientBitmapData(test.width, test.height, [ 0xffe09000, 0xfff8f868, 0xffc87010 ], 4);
			
			//	Copy the texture
			//var b:BitmapData = grad;
			
			var b:BitmapData = pic1.pixels;
			
			//	They use the pattern alphaa
			b.copyChannel(pic2.pixels, new Rectangle(0, 0, pic1.width, pic1.height), new Point, BitmapDataChannel.ALPHA, BitmapDataChannel.ALPHA);
			//b.copyChannel(pic1.pixels, new Rectangle(0, 0, pic1.width, pic1.height), new Point, BitmapDataChannel.RED, BitmapDataChannel.RED);
			//b.copyChannel(pic1.pixels, new Rectangle(0, 0, pic1.width, pic1.height), new Point, BitmapDataChannel.GREEN, BitmapDataChannel.GREEN);
			//b.copyChannel(pic1.pixels, new Rectangle(0, 0, pic1.width, pic1.height), new Point, BitmapDataChannel.BLUE, BitmapDataChannel.BLUE);
			
			output = new FlxSprite(0, 0);
			output.pixels = b;
			
			//pic2.angularAcceleration = 50;
			//pic2.maxAngular = 200;
			//pic2.angle = 45;
			
			add(output);
			
			//add(pic2);
			//pic2.visible = false;
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