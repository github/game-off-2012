package tests.delay 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class DelayTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "Delay 1";
		public static var description:String = "Example of the FlxDelay timer class";
		private var instructions:String = "Sprites change position every 2000ms (2 seconds)";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var timer:FlxDelay;
		private var red:FlxSprite;
		private var green:FlxSprite;
		private var blue:FlxSprite;
		
		public function DelayTest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			red = new FlxSprite(32, 32, AssetsRegistry.redPNG);
			green = new FlxSprite(96, 96, AssetsRegistry.greenPNG);
			blue = new FlxSprite(128, 128, AssetsRegistry.bluePNG);
			
			timer = new FlxDelay(2000);
			timer.start();
			
			add(blue);
			add(red);
			add(green);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			if (timer.hasExpired)
			{
				//	If 1000ms (1 second) has passed then the timer expires
				
				//	Randomise the sprite positions
				red.x = FlxMath.rand(0, 320 - red.width);
				red.y = FlxMath.rand(32, 180);
				
				green.x = FlxMath.rand(0, 320 - green.width);
				green.y = FlxMath.rand(32, 180);

				blue.x = FlxMath.rand(0, 320 - blue.width);
				blue.y = FlxMath.rand(32, 180);
				
				//	And start the timer again
				timer.start();
			}
			
		}
		
	}

}