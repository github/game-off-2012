package tests.gradient 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class GradientTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "Gradients 1";
		public static var description:String = "Create gradient filled FlxSprites with ease";
		private var instructions:String = "Create gradient filled FlxSprites with ease";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		public function GradientTest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	A nice red to yellow vertical gradient
			var gradient1:FlxSprite = FlxGradient.createGradientFlxSprite(64, 176, [0xffFF0000, 0xffFF8000, 0xffFFFF00], 2 );
			gradient1.x = 32;
			gradient1.y = 32;
			
			//	Make the gradient retro looking and "chunky" with the chucnkSize parameter (here set to 4)
			var gradient2:FlxSprite = FlxGradient.createGradientFlxSprite(64, 176, [0xff00FF00, 0xff00FFFF, 0xffFF0080], 4 );
			gradient2.x = 128;
			gradient2.y = 32;
			
			//	You can pass as many colours as you like in the colours Array, here we have a rainbow style effect
			var gradient3:FlxSprite = FlxGradient.createGradientFlxSprite(64, 176, [0xffFF0000, 0xffFF8000, 0xffFFFF00, 0xff00FF00, 0xff0080FF, 0xff8000FF], 1 );
			gradient3.x = 224;
			gradient3.y = 32;
			
			add(gradient1);
			add(gradient2);
			add(gradient3);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
		}
		
	}

}