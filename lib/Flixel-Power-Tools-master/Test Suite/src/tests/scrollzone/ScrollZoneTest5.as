package tests.scrollzone 
{
	import flash.geom.Matrix;
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ScrollZoneTest5 extends FlxState
	{
		//	Common variables
		public static var title:String = "ScrollZone 5";
		public static var description:String = "Advanced draw matrix manipulation";
		private var instructions:String = "Updating the scroll values in real-time";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var pic:FlxSprite;
		private var t:FlxDelay;
		private var s:Number;
		
		public function ScrollZoneTest5() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	If the FlxScrollZone Plugin isn't already in use, we add it here
			if (FlxG.getPlugin(FlxScrollZone) == null)
			{
				FlxG.addPlugin(new FlxScrollZone);
			}
			
			//	Create a sprite from a 320x200 PNG (drawn by a friend of mine, Havoc, in just 16-colours on an Atari ST)
			pic = new FlxSprite(0, 24, AssetsRegistry.acfPNG);
			
			FlxScrollZone.add(pic, new Rectangle(0, 0, 320, 200), 2, -1);
			
			t = new FlxDelay(250);
			t.start();
			
			s = 1;
			
			add(pic);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			if (t.hasExpired)
			{
				var m:Matrix = FlxScrollZone.getDrawMatrix(pic);
				
				m.scale(s, s);
				
				FlxScrollZone.updateDrawMatrix(pic, m);
				
				s += 0.1;
				
				if (s >= 2)
				{
					s = 1;
				}
				
				t.start();
			}
			
			super.update();
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the scrolling image from the plugin, otherwise resources will get messed right up after a while
			FlxScrollZone.clear();
			
			super.destroy();
		}
		
	}

}