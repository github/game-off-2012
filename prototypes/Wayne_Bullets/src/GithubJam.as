package

{

	import org.flixel.*;

	[SWF(width="640", height="480", backgroundColor="#000000")]
	[Frame(factoryClass="Preloader")]



	public class GithubJam extends FlxGame

	{

		public function GithubJam()

		{

			super(320,240,PlayState,2, 60, 60);
			forceDebugger = true;
		}

	}

}

