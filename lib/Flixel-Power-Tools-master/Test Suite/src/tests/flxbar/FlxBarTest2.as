package tests.flxbar 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class FlxBarTest2 extends FlxState
	{
		//	Common variables
		public static var title:String = "FlxBar 2";
		public static var description:String = "Demonstrates the 8 ways to fill the bars";
		private var instructions:String = "Each bar uses a different fill method";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var bar1:FlxBar;
		private var bar2:FlxBar;
		private var bar3:FlxBar;
		private var bar4:FlxBar;
		private var bar5:FlxBar;
		private var bar6:FlxBar;
		private var bar7:FlxBar;
		private var bar8:FlxBar;
		private var bar9:FlxBar;
		
		private var v:int;
		private var vDirection:int = 0;
		
		public function FlxBarTest2() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			v = 0;
			
			bar1 = new FlxBar(0, 0, FlxBar.FILL_LEFT_TO_RIGHT);
			bar1.createImageBar(null, AssetsRegistry.healthBarPNG, 0x88000000);
			
			bar2 = new FlxBar(0, 0, FlxBar.FILL_RIGHT_TO_LEFT);
			bar2.createImageBar(null, AssetsRegistry.healthBarPNG, 0x88000000);
			
			bar3 = new FlxBar(0, 0, FlxBar.FILL_HORIZONTAL_INSIDE_OUT);
			bar3.createImageBar(null, AssetsRegistry.healthBarPNG, 0x88000000);
			
			bar4 = new FlxBar(0, 0, FlxBar.FILL_HORIZONTAL_OUTSIDE_IN);
			bar4.createImageBar(null, AssetsRegistry.healthBarPNG, 0x88000000);
			
			//	We use this to align all the bars together (easier than manually entering all the coordinates!)
			FlxDisplay.space([bar1, bar2, bar3, bar4], 32, 48, 0, 32);
			
			bar5 = new FlxBar(0, 0, FlxBar.FILL_TOP_TO_BOTTOM, 10, 100);
			bar5.createImageBar(null, AssetsRegistry.flectrumPNG, 0x88000000);
			
			bar6 = new FlxBar(0, 0, FlxBar.FILL_BOTTOM_TO_TOP);
			bar6.createImageBar(null, AssetsRegistry.flectrumPNG, 0x88000000);
			
			bar7 = new FlxBar(0, 0, FlxBar.FILL_VERTICAL_INSIDE_OUT);
			bar7.createImageBar(null, AssetsRegistry.flectrumPNG, 0x88000000);
			
			bar8 = new FlxBar(0, 0, FlxBar.FILL_VERTICAL_OUTSIDE_IN);
			bar8.createImageBar(null, AssetsRegistry.flectrumPNG, 0x88000000);
			
			//	We use this to align all the bars together (easier than manually entering all the coordinates!)
			FlxDisplay.space([bar5, bar6, bar7, bar8], 180, 48, 32, 0);
			
			//	FlxBar is a normal FlxSprite, so you can do anything you normally do to sprites including alpha, rotate, collide, etc
			bar9 = new FlxBar(160, 180, FlxBar.FILL_LEFT_TO_RIGHT);
			bar9.createImageBar(null, AssetsRegistry.healthBarPNG, 0x88000000);
			bar9.alpha = 0.5;
			bar9.angle = 200;
			
			add(bar1);
			add(bar2);
			add(bar3);
			add(bar4);
			add(bar5);
			add(bar6);
			add(bar7);
			add(bar8);
			add(bar9);
			
			FlxG.watch(bar1, "percent");
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			//	This just cycles the health value up and down, so the bars animate
			if (vDirection == 0)
			{
				v++;
				
				if (v >= 100)
				{
					vDirection = 1;
				}
			}
			else
			{
				v--;
				
				if (v <= 0)
				{
					vDirection = 0;
				}
			}
			
			//	If a FlxBar isn't tied to a sprite you can set the value of it directly via percentage
			bar1.percent = v;
			bar2.percent = v;
			bar3.percent = v;
			bar4.percent = v;
			bar5.percent = v;
			bar6.percent = v;
			bar7.percent = v;
			bar8.percent = v;
			bar9.percent = v;
		}
		
	}

}