package tests.controls 
{
	import org.flixel.*;

	public class ControlTestScene2 extends FlxGroup
	{
		public var map:FlxTilemap;
		
		public function ControlTestScene2() 
		{
			super(1);
			
			map = new FlxTilemap();
			map.loadMap(new AssetsRegistry.platformerMapCSV, AssetsRegistry.platformerTilesPNG, 16, 16, 0, 0, 1, 31);
			
			map.y = -32;
			
			FlxG.camera.setBounds(0, 0, 320, 256);
			FlxG.worldBounds = new FlxRect(0, -32, 320, 288);
			
			add(map);
		}
		
	}

}