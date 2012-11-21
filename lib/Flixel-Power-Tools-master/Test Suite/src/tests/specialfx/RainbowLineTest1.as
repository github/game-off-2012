package tests.specialfx 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.RainbowLineFX;
	import tests.TestsHeader;

	public class RainbowLineTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "RainbowLine";
		public static var description:String = "Rainbow Line FX Plugin";
		private var instructions:String = "Click for random colors. Up/Down to change step size.";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var pic:FlxSprite;
		private var line1:RainbowLineFX;
		private var line2:RainbowLineFX;
		private var currentP:uint = 5;
		
		public function RainbowLineTest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			if (FlxG.getPlugin(FlxSpecialFX) == null)
			{
				FlxG.addPlugin(new FlxSpecialFX);
			}
			
			header.showDarkBackground();
			
			pic = new FlxSprite(0, 30, AssetsRegistry.noCooper1984PNG);
			
			line1 = FlxSpecialFX.rainbowLine();
			line2 = FlxSpecialFX.rainbowLine();

			line1.create(0, pic.y - 1, 320, 1, null, 360, 4);
			line2.create(0, pic.y + pic.height, 320, 1, null, 360, 4);
			line2.setDirection(1);
			
			add(pic);
			add(line1.sprite);
			add(line2.sprite);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			if (FlxG.mouse.justReleased())
			{
				var c:Object = FlxColor.getTriadicHarmony(FlxColor.getRandomColor(50, 255));
				
				line1.updateColors([ c.color1, c.color2, c.color3 ], 360, false, 180);
			}
			
			if (FlxG.keys.justReleased("UP"))
			{
				line1.stepSize += 1;
			}
			else if (FlxG.keys.justReleased("DOWN"))
			{
				line1.stepSize -= 1;
			}
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin, otherwise resources will get messed right up after a while
			FlxSpecialFX.clear();
			
			super.destroy();
		}
		
	}

}