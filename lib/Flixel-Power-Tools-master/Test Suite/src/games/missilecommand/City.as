package games.missilecommand 
{
	import org.flixel.FlxSprite;

	public class City extends FlxSprite
	{
		[Embed(source = '../../../assets/games/missile-command/city.png')] private var cityPNG:Class;
		
		public function City(x:int, y:int) 
		{
			super(x, y + 4);
			
			loadGraphic(cityPNG, true, false, 32, 18);
		}
		
	}

}