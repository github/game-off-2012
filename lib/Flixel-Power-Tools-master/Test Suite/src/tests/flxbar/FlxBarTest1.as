package tests.flxbar 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class FlxBarTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "FlxBar 1";
		public static var description:String = "Using FlxBar as a health bar";
		private var instructions:String = "Click the mouse to randomise the health values";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var ufo:FlxSprite;
		private var ufoHealthBar:FlxBar;
		
		public function FlxBarTest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			ufo = new FlxSprite(64, 120, AssetsRegistry.ufoPNG);
			ufo.health = FlxMath.rand(10, 90);
			
			//	Creates a new FlxBar positioned at 16x64 that fills from left to right
			//	The 64x4 is the width and height of the bar.
			//	ufo is the FlxSprite it is bound to, and "health" is the FlxSprite variable it will monitor
			ufoHealthBar = new FlxBar(16, 64, FlxBar.FILL_LEFT_TO_RIGHT, 64, 4, ufo, "health");
			
			//	This tells it to track the x/y position of the red FlxSprite, but offset by the values given
			ufoHealthBar.trackParent(0, -5);
			
			add(ufo);
			add(ufoHealthBar);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			ufo.x = FlxG.mouse.screenX - 16;
			ufo.y = FlxG.mouse.screenY - 16;
			
			if (FlxG.mouse.justReleased())
			{
				var r:uint = FlxMath.rand(0, 100);
				
				ufo.health = r;
				
				header.instructions.text = "Health: " + r.toString() + "%";
			}
			
			//	If you notice a lag/delay in the bar following the sprite then
			//	it's because you've called super.update() at the START of your update function.
			//	Leave it until the end and it'll run smoothly.
			super.update();
		}
		
	}

}