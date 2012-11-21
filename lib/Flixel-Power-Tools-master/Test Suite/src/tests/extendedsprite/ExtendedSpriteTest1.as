package tests.extendedsprite 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ExtendedSpriteTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "Sprite Drag 1";
		public static var description:String = "Lots of Draggable Sprites";
		private var instructions:String = "Drag the sprites with the mouse";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		private var tasty:FlxGroup;
		
		private var carrot:FlxExtendedSprite;
		private var mushroom:FlxExtendedSprite;
		private var melon:FlxExtendedSprite;
		private var tomato:FlxExtendedSprite;
		private var onion:FlxExtendedSprite;
		private var eggplant:FlxExtendedSprite;
		
		public function ExtendedSpriteTest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	Enable the plugin - you only need do this once (unless you destroy the plugin)
			if (FlxG.getPlugin(FlxMouseControl) == null)
			{
				FlxG.addPlugin(new FlxMouseControl);
			}
			
			tasty = new FlxGroup(6);
			
			//	You can drag the carrot from anywhere inside its bounding box (including transparent parts)
			//	This is the fastest method of dragging (in terms of CPU) so use it if you can! Especially for rectangle shaped sprites
			carrot = new FlxExtendedSprite(32, 32, AssetsRegistry.carrotPNG);
			carrot.enableMouseDrag();
			
			//	The mushroom needs a pixel perfect drag, so the edges are not included
			mushroom = new FlxExtendedSprite(64, 64, AssetsRegistry.mushroomPNG);
			mushroom.enableMouseDrag(false, true);
			
			//	The melon and eggplant need pixel perfect clicks as well, but this time the middle of the sprites snaps to the mouse coordinates (lockCenter)
			melon = new FlxExtendedSprite(128, 128, AssetsRegistry.melonPNG);
			melon.enableMouseDrag(true, true);
			
			eggplant = new FlxExtendedSprite(164, 132, AssetsRegistry.eggplantPNG);
			eggplant.enableMouseDrag(true, true);
			
			//	The tomato and onion are stuck in this fixed rectangle!
			var cage:FlxRect = new FlxRect(16, 160, 200, 64);
			
			//	This is just so we can see the drag bounds on-screen
			var cageOutline:FlxSprite = new FlxSprite(cage.x, cage.y).makeGraphic(cage.width, cage.height, 0x66FF0080);
			
			tomato = new FlxExtendedSprite(64, 170, AssetsRegistry.tomatoPNG);
			tomato.enableMouseDrag(true, true, 255, cage);
			
			onion = new FlxExtendedSprite(140, 180, AssetsRegistry.onionPNG);
			onion.enableMouseDrag(true, true, 255, cage);
			
			tasty.add(carrot);
			tasty.add(mushroom);
			tasty.add(melon);
			tasty.add(eggplant);
			tasty.add(tomato);
			tasty.add(onion);
			
			add(cageOutline);
			add(tasty);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			//	Sorts the sprites on the Y axis (the further down the screen they are, the more "on-top" they visually appear)
			tasty.sort();
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin otherwise resources will get messed right up after a while
			FlxMouseControl.clear();
			
			super.destroy();
		}
		
	}

}