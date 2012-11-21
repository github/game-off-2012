package tests.controls 
{
	import org.flixel.*;

	public class ControlTestScene1 extends FlxGroup
	{
		public var map:FlxTilemap;
		
		public function ControlTestScene1() 
		{
			super(1);
			
			map = new FlxTilemap();
			map.loadMap(new AssetsRegistry.scifiMap1CSV, AssetsRegistry.scifiTilesPNG, 16, 16, 0, 0, 1, 55);
			
			//map.y = -32;
			
			FlxG.camera.setBounds(0, 0, 320, 256);
			FlxG.worldBounds = new FlxRect(0, 0, 320, 256);
			
			add(map);
		}
		
	}

}