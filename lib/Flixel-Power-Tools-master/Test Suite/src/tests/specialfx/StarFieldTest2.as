package tests.specialfx 
{
	import flash.display.BitmapData;
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.StarfieldFX;
	import tests.TestsHeader;

	public class StarFieldTest2 extends FlxState
	{
		//	Common variables
		public static var title:String = "StarField 2";
		public static var description:String = "Example of the 3D StarField";
		private var instructions:String = "Click to enable mouse follow";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var stars:FlxSprite;
		private var starfield:StarfieldFX;
		private var followingMouse:Boolean = false;
		
		public function StarFieldTest2() 
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
			
			stars = starfield.create(0, 32, 320, 176, 256, 2);
			
			add(stars);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			if (FlxG.mouse.justPressed())
			{
				followingMouse ? followingMouse = false : followingMouse = true;
			}
			
			if (followingMouse)
			{
				starfield.centerX = FlxG.mouse.screenX - stars.x;
				starfield.centerY = FlxG.mouse.screenY - stars.y;
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