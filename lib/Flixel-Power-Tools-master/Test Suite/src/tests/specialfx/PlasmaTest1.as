package tests.specialfx 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.PlasmaFX;
	import tests.TestsHeader;

	public class PlasmaTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "Plasma 1";
		public static var description:String = "Plasma FX Plugin";
		private var instructions:String = "Pretty init :)";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var plasma:PlasmaFX;
		private var soPretty:FlxSprite;
		
		public function PlasmaTest1() 
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
			
			plasma = FlxSpecialFX.plasma();
			soPretty = plasma.create(0, 8, 160, 120, 2, 2);
			
			add(soPretty);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin, otherwise resources will get messed right up after a while
			FlxSpecialFX.clear();
			
			super.destroy();
		}
		
	}

}