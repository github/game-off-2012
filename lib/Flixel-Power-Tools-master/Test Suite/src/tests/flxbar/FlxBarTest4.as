package tests.flxbar 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class FlxBarTest4 extends FlxState
	{
		//	Common variables
		public static var title:String = "FlxBar 4";
		public static var description:String = "A Zelda style Health Bar";
		private var instructions:String = "Click the mouse to randomise the health values";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var panel:FlxSprite;
		private var healthBar:FlxBar;
		
		private var increase:FlxButton;
		private var decrease:FlxButton;
		
		public function FlxBarTest4() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			panel = new FlxSprite(0, 64, AssetsRegistry.zeldaLifePanelPNG);
			FlxDisplay.screenCenter(panel);
			
			healthBar = new FlxBar(panel.x + 8, panel.y + 25, FlxBar.FILL_LEFT_TO_RIGHT, 158, 14);
			healthBar.createImageBar(null, AssetsRegistry.zeldaLifeHeartsPNG, 0x0);
			
			//	There are 10 hearts in the graphic (one after the other) so we set the range here as being from 0 to 10
			healthBar.setRange(0, 10);
			
			//	The starting value
			healthBar.currentValue = 1;
			
			increase = new FlxButton(panel.x, panel.y + panel.height + 4, "+", addHealth);
			increase.width = 64;
			
			decrease = new FlxButton(panel.x + panel.width - 80, panel.y + panel.height + 4, "-", removeHealth);
			decrease.width = 64;
			
			add(panel);
			add(healthBar);
			add(increase);
			add(decrease);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
		}
		
		private function addHealth():void
		{
			healthBar.currentValue++;
				
			header.instructions.text = "Health: " + healthBar.currentValue;
		}
		
		private function removeHealth():void
		{
			healthBar.currentValue--;
			
			header.instructions.text = "Health: " + healthBar.currentValue;
		}
		
	}

}