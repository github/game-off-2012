package  
{
	import flash.geom.Point;
	import starling.display.Image;
	import starling.display.Quad;
	import starling.display.Sprite;
	import starling.events.Event;
	import starling.core.Starling;
	import starling.textures.Texture;
	
	public class Background extends Sprite 
	{
		private var lyr0Texture:Texture;
		private var layer0:Image;
		private var lyr0Visible:Boolean;
		
		private var lyr1Texture:Texture;
		private var layer1:Image;
		private var lyr1Visible:Boolean;
		
		private var layerGround:Quad;
		private var groundVisible:Boolean;
		
		private var xOffset:Number = 0;
		
		private static var _instance:Background;
		
		public function Background() 
		{
			_instance = this;
			
			super();
			this.addEventListener(Event.ADDED_TO_STAGE, OnAddedToStage);
		}
		
		private function OnAddedToStage(event:Event):void
		{
			lyr1Texture = Texture.fromBitmap(new Resources.layer1Texture());
			lyr1Texture.repeat = true;
			layer1 = new Image(lyr1Texture);
			lyr1Visible = true;
			layer1.height = layer1.height * 1.4;
			layer1.y = -150;
			addChild(layer1);
			
			lyr0Texture = Texture.fromBitmap(new Resources.layer0Texture());
			lyr0Texture.repeat = true;
			layer0 = new Image(lyr0Texture);
			lyr0Visible = true;
			layer0.y = -100;
			addChild(layer0);
			
			groundVisible = true;
			layerGround = new Quad(600, 300, 0x4f9873);
			layerGround.y = 500;
			addChild(layerGround);
		}
		
		private function setOffset(image:Image, pos:Number):void
		{
			xOffset = ((pos * image.width)/360)*-0.0028;
			image.setTexCoords(0, new Point(0 + xOffset,0));
			image.setTexCoords(1, new Point(1 + xOffset, 0));
			image.setTexCoords(2, new Point(0 + xOffset, 1));
			image.setTexCoords(3, new Point(1 + xOffset, 1));
		 
		}
		
		public static function GetInstance():Background
		{
			return _instance;
		}
		
		public function rotatingWorld(rotationY:Number):void
		{
			setOffset(layer0, rotationY);
			setOffset(layer1, rotationY);
		}
		
		public function MovingUp(distance:Number):void
		{
			if (lyr1Visible)
			{
				layer1.y += distance * 0.4;
				if (layer1.y > 800)
				{
					removeChild(layer1,true);
					lyr1Visible = false;
				}
			}
			
			if (lyr0Visible)
			{
				layer0.y += distance * 0.8;
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