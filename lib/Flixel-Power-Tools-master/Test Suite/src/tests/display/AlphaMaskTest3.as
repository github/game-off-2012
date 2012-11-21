package tests.display 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;
	
	public class AlphaMaskTest3 extends FlxState
	{
		//	Common variables
		public static var title:String = "AlphaMask 3";
		public static var description:String = "A dynamically updating alpha mask";
		private var instructions:String = "A dynamically updating alpha mask";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var picture:FlxSprite;
		private var mask:FlxSprite;
		private var output:FlxSprite;
		
		public function AlphaMaskTest3() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	TODO - test when mask is smaller than picture - what to do?
			
			header.showDarkBackground();
			
			//	This will hold our final image
			output = new FlxSprite(0, 0);
			
			//	We pass in the image itself, the mask and the result is placed into the output FlxSprite
			FlxDisplay.alphaMask(AssetsRegistry.questarPNG, AssetsRegistry.alphaMask2PNG, output);
			
			//	Which we then display. Easy!
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