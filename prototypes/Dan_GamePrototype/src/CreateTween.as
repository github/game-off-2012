package  
{
	/**
	 * ...
	 * @author Daniel Lewis
	 */
	import com.greensock.*;
	import com.greensock.easing.*;
	import org.flixel.FlxPoint;
	
	public class CreateTween 
	{
		static public var numChoices:int = 4;
		static public function GenerateTween(ref:Object, choice:int):TweenMax 
		{
			switch (choice) 
			{
				case 0:
					return LeftToRightDownArc(ref);
				break;
				
				case 1:
					return RightToLeftDownArc(ref);
				break;
				
				case 2:
					return CenterToRightDownArc(ref);
				break;
				
				case 3:
					return CenterToLeftDownArc(ref);
				break;
				default:
					return LeftToRightDownArc(ref);
			}
		}
		static public function GetStartCoords(choice: int):FlxPoint
		{
			switch (choice) 
			{
				case 0:
					return new FlxPoint(9, -16); //this doesnt seem to work when x is less than 9. dont know why. it used to work i think.
				break;
				
				case 1:
					return new FlxPoint(320 - 16, -16);
				break;
				
				case 2:
					return new FlxPoint(160 - 8, -16);
				break;
				
				case 3:
					return new FlxPoint(160 - 8, -16);
				break;
				default:
					return new FlxPoint(0, 0);
			}
		}
		
		static private function LeftToRightDownArc(ref:Object):TweenMax {
			return new TweenMax(ref as GitEnemy, 5, {bezier:[{x:0, y:240}, {x:320+16, y:240}], orientToBezier:[["x", "y", "angle", 0, 0.01]], ease:Linear.easeNone } );
		}
		static private function RightToLeftDownArc(ref:Object):TweenMax {
			return new TweenMax(ref as GitEnemy, 5, {bezier:[{x:320, y:240}, {x:0-16, y:240}], orientToBezier:[["x", "y", "angle", 0, 0.01]], ease:Linear.easeNone } );
		}
		static private function CenterToRightDownArc(ref:Object):TweenMax {
			return LeftToRightDownArc(ref);
		}
		static private function CenterToLeftDownArc(ref:Object):TweenMax {
			return RightToLeftDownArc(ref);
		}
		
	}

}