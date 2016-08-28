package tests.extendedsprite 
{
	import org.flixel.plugin.photonstorm.FlxExtendedSprite;

	public class Atari extends FlxExtendedSprite
	{
		
		public function Atari() 
		{
			super(32, 32, AssetsRegistry.atari130xePNG);
			
			enableMouseDrag();
		}
		
	}

}