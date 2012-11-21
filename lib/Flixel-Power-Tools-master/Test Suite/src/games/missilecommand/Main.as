/**
 * Missile Command
 * 
 * @link http://www.photonstorm.com
 * @author Richard Davey / Photon Storm
*/

package games.missilecommand
{
	import flash.display.Sprite;
	import flash.display.StageQuality;
	
	import org.flixel.*;
	
	public class Main extends FlxGame
	{
		public function Main():void 
		{
			super(320, 240, MenuState, 2, 60, 60);
			
			forceDebugger = true;
		}
		
	}
	
}