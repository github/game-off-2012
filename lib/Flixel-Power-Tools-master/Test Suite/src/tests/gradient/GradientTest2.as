package tests.gradient 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class GradientTest2 extends FlxState
	{
		//	Common variables
		public static var title:String = "Gradients 2";
		public static var description:String = "Gradients can run at any angle";
		private var instructions:String = "Gradients can run at any angle";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		public function GradientTest2() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	180 degrees
			var gradient1:FlxSprite = FlxGradient.createGradientFlxSprite(64, 176, [0xffFF0000, 0xffFF8000, 0xffFFFF00, 0xff00FF00, 0xff0080FF, 0xff8000FF], 2, 180 );
			gradient1.x = 32;
			gradient1.y = 32;
			
			//	45 degrees
			var gradient2:FlxSprite = FlxGradient.createGradientFlxSprite(64, 176, [0xffFF0000, 0xffFF8000, 0xffFFFF00, 0xff00FF00, 0xff0080FF, 0xff8000FF], 2, 45 );
			gradient2.x = 128;
			gradient2.y = 32;
			
			//	222 degrees!
			var gradient3:FlxSprite = FlxGradient.createGradientFlxSprite(64, 176, [0xffFF0000, 0xffFF8000, 0xffFFFF00, 0xff00FF00, 0xff0080FF, 0xff8000FF], 2, 222 );
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