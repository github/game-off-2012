package tests.controls 
{
	import org.flixel.*;

	public class ControlTestScene3 extends FlxGroup
	{
		public var map:FlxTilemap;
		
		public function ControlTestScene3() 
		{
			super(1);
			
			map = new FlxTilemap();
			map.loadMap(new AssetsRegistry.bigMapCSV, AssetsRegistry.platformerTilesPNG, 16, 16, 0, 0, 1, 31);
			
			FlxG.camera.setBounds(0, 0, map.width, map.height);
			FlxG.worldBounds = new FlxRect(0, 0, map.width, map.height);
			
			add(map);
		}
		
	}

}