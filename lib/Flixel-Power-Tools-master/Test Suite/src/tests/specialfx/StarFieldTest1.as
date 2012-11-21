package tests.specialfx 
{
	import flash.display.BitmapData;
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.StarfieldFX;
	import tests.TestsHeader;

	public class StarFieldTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "StarField 1";
		public static var description:String = "Example of the default 2D Star field";
		private var instructions:String = "2D Star field. Click to randomise direction.";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var stars:FlxSprite;
		private var starfield:StarfieldFX;
		
		public function StarFieldTest1() 
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
			
			starfield = FlxSpecialFX.starfield();
			
			stars = starfield.create(0, 32, 320, 176, 256);
			
			add(stars);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			if (FlxG.mouse.justPressed())
			{
				starfield.setStarSpeed(FlxMath.randFloat(-1, 1), FlxMath.randFloat(-1, 1));
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