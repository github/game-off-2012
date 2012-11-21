package tests.collision 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class CollisionTest4 extends FlxState
	{
		//	Common variables
		public static var title:String = "Collision 4";
		public static var description:String = "Pixel perfect collision with 2 rotating sprites";
		private var instructions:String = "";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var bar1:FlxSprite;
		private var bar2:FlxSprite;
		private var debug:FlxSprite;
		
		public function CollisionTest4() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			bar1 = new FlxSprite(164, 80);
			bar1.loadRotatedGraphic(AssetsRegistry.flectrumPNG, 128, -1, true, true);
			
			bar2 = new FlxSprite(64, 64);
			bar2.loadRotatedGraphic(AssetsRegistry.flectrum2PNG, 128, -1, true, true);
			
			debug = new FlxSprite(8, 32).makeGraphic(32, 32);
			
			add(bar1);
			add(bar2);
			add(debug);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			debug.pixels = FlxCollision.debug;
			
			bar1.angle += 1;
			bar2.angle -= 1;
			
			bar2.x = FlxG.mouse.screenX;
			bar2.y = FlxG.mouse.screenY;
			
			header.instructions.text = "Colliding: " + FlxCollision.pixelPerfectCheck(bar1, bar2);
		}
		
	}

}