package tests.display 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;
	
	public class AlphaMaskTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "AlphaMask 1";
		public static var description:String = "Using an FlxSprite as an alpha mask";
		private var instructions:String = "Using an FlxSprite as an alpha mask";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var picture:FlxSprite;
		private var mask:FlxSprite;
		private var output:FlxSprite;
		
		public function AlphaMaskTest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	The picture
			picture = new FlxSprite(0, 0, AssetsRegistry.acrylBladeRunnerPNG);
			
			//	The mask
			mask = new FlxSprite(0, 0, AssetsRegistry.alphaMaskPNG);
			
			//	The final display
			output = new FlxSprite(0, 22);
			
			FlxDisplay.alphaMaskFlxSprite(picture, mask, output);
			
			add(output);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
		}
		
	}

}