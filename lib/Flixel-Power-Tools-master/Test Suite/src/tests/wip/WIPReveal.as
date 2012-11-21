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
	
	public class WIPReveal extends FlxState
	{
		//	Common variables
		public static var title:String = "WIP 1";
		public static var description:String = "";
		private var instructions:String = "";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var pic:FlxSprite;
		private var output:FlxSprite;
		private var pixels:Array;
		private var r:Rectangle;
		private var p:Point;
		private var c:int;
		
		public function WIPReveal() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			//header.showDarkBackground();
			
			pic = new FlxSprite(0, 0, AssetsRegistry.questarPNG);
			
			pixels = new Array;
			
			for (var x:int = 0; x < pic.width; x++)
			{
				for (var y:int = 0; y < pic.height; y++)
				{
					pixels.push(new Point(x, y));
				}
			}
			
			//trace(pixels);
			
			r = new Rectangle(0, 0, 1, 1);
			
			FlxU.shuffle(pixels, pixels.length * 2);
			
			//trace("shuffle done");
			//trace(pixels);
			
			output = new FlxSprite(0, 0).makeGraphic(pic.width, pic.height, 0x0);
			
			pic.visible = false;
			add(pic);
			
			add(output);
			
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			var px:int;
			
			var b:BitmapData;
			
			if (pixels.length > 0)
			{
				for (var i:int = 0; i < 200; i++)
				{
					if (pixels.length == 0)
					{
						break;
					}
					
					p = pixels.shift();
					
					r.x = p.x;
					r.y = p.y;
					
					//trace("copying pixel", p);
					
					b = output.pixels;
					
					b.copyPixels(pic.pixels, r, p, null, null, true);
					
					output.pixels = b;
				}
			}
		}
		
		override public function destroy():void
		{
			super.destroy();
		}
		
		
		
	}

}