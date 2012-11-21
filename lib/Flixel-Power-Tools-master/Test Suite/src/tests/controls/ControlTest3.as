package tests.controls 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ControlTest3 extends FlxState
	{
		//	Common variables
		public static var title:String = "Controls 3";
		public static var description:String = "2 Player (same keyboard) demo";
		private var instructions:String = "Red uses WASD. Green uses IJKL.";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var player1:FlxSprite;
		private var player2:FlxSprite;
		private var scene:ControlTestScene1;
		
		public function ControlTest3() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			player1 = new FlxSprite(64, 64, AssetsRegistry.redPNG);
			player1.solid = true;
			player1.elasticity = 0.9;
			
			player2 = new FlxSprite(240, 150, AssetsRegistry.greenPNG);
			player2.solid = true;
			player2.elasticity = 0.9;
			
			//	Enable the plugin - you only need do this once (unless you destroy the plugin)
			if (FlxG.getPlugin(FlxControl) == null)
			{
				FlxG.addPlugin(new FlxControl);
			}
			
			//	Control the players
			
			FlxControl.create(player1, FlxControlHandler.MOVEMENT_ACCELERATES, FlxControlHandler.STOPPING_DECELERATES, 1, false, false);
			FlxControl.player1.setWASDControl();
			FlxControl.player1.setStandardSpeed(200);
			
			FlxControl.create(player2, FlxControlHandler.MOVEMENT_ACCELERATES, FlxControlHandler.STOPPING_DECELERATES, 2, false, false);
			FlxControl.player2.setIJKLControl();
			FlxControl.player2.setStandardSpeed(200);
			
			//	A scene for our players to move around
			scene = new ControlTestScene1;
			
			add(scene);
			add(player1);
			add(player2);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			FlxG.collide(player1, player2);
			FlxG.collide(player1, scene);
			FlxG.collide(player2, scene);
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin otherwise resources will get messed right up after a while
			FlxControl.clear();
			
			super.destroy();
		}
		
	}

}