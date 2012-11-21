package tests.flxbar 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class FlxBarTest5 extends FlxState
	{
		//	Common variables
		public static var title:String = "FlxBar 5";
		public static var description:String = "Changing the range of an FlxBar in-game";
		private var instructions:String = "Changing the range of an FlxBar";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var pic:FlxSprite;
		
		private var currentLevel:uint;
		private var currentExperience:uint;
		private var maxExperience:uint;
		private var experienceBar:FlxBar;
		private var experienceText:FlxText;
		
		private var fight:FlxButton;
		
		public function FlxBarTest5() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			header.showDarkBackground();
			
			pic = new FlxSprite(8, 64, AssetsRegistry.dragonWizardPNG);
			
			currentLevel = 1;
			currentExperience = 0;
			maxExperience = 100;
			
			experienceBar = new FlxBar(116, 116, FlxBar.FILL_LEFT_TO_RIGHT, 200, 16);
			experienceBar.createGradientBar([0x00000000], [0xffFFFF00, 0xffFF8B17, 0xffFF0000], 1, 180, true);
			experienceBar.setRange(0, 100);
			experienceBar.percent = 0;
			
			experienceText = new FlxText(116, 100, 260);
			experienceText.shadow = 0xff000000;
			
			fight = new FlxButton(116, 148, "Fight!", increaseExperience);
			
			add(pic);
			add(experienceBar);
			add(experienceText);
			add(fight);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			experienceText.text = "Exp: " + currentExperience + " / " + maxExperience + " - Level: " + currentLevel;
		}
		
		private function increaseExperience():void
		{
			var damage:uint = Math.random() * 50;
			
			currentExperience += damage;
			
			if (currentExperience > maxExperience)
			{
				currentLevel++;
				maxExperience += 250;
				experienceBar.setRange(0, maxExperience);
				header.instructions.text = "You hit for " + damage + " damage and LEVEL UP!";
			}
			else
			{
				header.instructions.text = "You hit for " + damage + " damage";
			}
				
			experienceBar.currentValue = currentExperience;
			
		}
		
	}

}