package  
{
	import starling.display.Quad;
	import starling.display.Sprite;
	import starling.events.Event;
	import starling.core.Starling;
	
	public class Background extends Sprite 
	{
		private var layerGround:Quad;
		private var groundVisible:Boolean;
		private var layer0:Quad;
		private var lyr0Visible:Boolean;
		private var layer1:Quad;
		private var lyr1Visible:Boolean;
		
		private static var _instance:Background;
		
		public function Background() 
		{
			_instance = this;
			
			super();
			this.addEventListener(Event.ADDED_TO_STAGE, OnAddedToStage);
		}
		
		private function OnAddedToStage(event:Event):void
		{
			lyr1Visible = true;
			layer1 = new Quad(600, 800, 0x653df4);
			addChild(layer1);
			
			lyr0Visible = true;
			layer0 = new Quad(600, 600, 0xaa2515);
			layer0.y = 200;
			addChild(layer0);
			
			groundVisible = true;
			layerGround = new Quad(600, 300, 0x555555);
			layerGround.y = 500;
			addChild(layerGround);
		}
		
		public static function GetInstance():Background
		{
			return _instance;
		}
		
		public function MovingUp(distance:Number):void
		{
			if (lyr1Visible)
			{
				layer1.y += distance * 0.3;
				if (layer1.y > 800)
				{
					removeChild(layer1,true);
					lyr1Visible = false;
				}
			}
			
			if (lyr0Visible)
			{
				layer0.y += distance * 0.5;
				if (layer0.y > 800)
				{
					removeChild(layer0,true);
					lyr0Visible = false;
				}
			}
			
			if (groundVisible)
			{
				layerGround.y += distance * 0.8;
				if (layerGround.y > 800)
				{
					removeChild(layerGround,true);
					groundVisible = false;
				}
			}
		}
	}
}