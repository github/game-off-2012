package games.missilecommand
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	
	public class MenuState extends FlxState
	{
		[Embed(source = '../../../assets/games/missile-command/title-page.png')] private var titlePagePNG:Class;
		
		private var titlePage:FlxSprite;
		private var startGame:FlxButton;
		
		public function MenuState() 
		{
		}
		
		override public function create():void
		{
			titlePage = new FlxSprite(0, 0, titlePagePNG);
			
			startGame = new FlxButton(0, 200, "Nuke them all", fadeTitle);
			
			FlxDisplay.screenCenter(startGame, true);
			
			FlxG.mouse.show();
			
			add(titlePage);
			add(startGame);
		}
		
		private function fadeTitle():void
		{
			FlxG.switchState(new PlayState);
			//FlxG.fade(0xff000000, 1, switchToGame);
		}
		
		private function switchToGame():void
		{
			FlxG.switchState(new PlayState);
		}
		
	}

}