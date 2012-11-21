package tests.velocity 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class VelocityTest3 extends FlxState
	{
		//	Common variables
		public static var title:String = "Velocity 3";
		public static var description:String = "Get the distance between 2 FlxObjects";
		private var instructions:String = "";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var red:FlxSprite;
		private var green:FlxSprite;
		
		public function VelocityTest3() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			red = new FlxSprite(160, 120, AssetsRegistry.redPNG);
			green = new FlxSprite(-32, 0, AssetsRegistry.greenPNG);
			
			add(red);
			add(green);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			green.x = FlxG.mouse.screenX;
			green.y = FlxG.mouse.screenY;
			
			header.instructions.text = "Distance between red and green: " + FlxVelocity.distanceBetween(red, green) + " px";
		}
		
	}

}