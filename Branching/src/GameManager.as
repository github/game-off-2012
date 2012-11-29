package  
{
	import flash.display.BitmapData;
	import starling.display.Button;
	import starling.display.Sprite;
	import starling.events.Event;
	import starling.textures.Texture;
	
	public class GameManager extends Sprite 
	{
		private var StartBttn:Button;
		private var BttnTexture:Texture;
		
		private var coreGame:CoreGame;
		
		public function GameManager() 
		{
			addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
		}
		
		private function onAddedToStage(event:Event):void
        {
			removeEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
			
			var DummyBox:flash.display.Sprite = new flash.display.Sprite();
			DummyBox.graphics.beginFill(0xeeeeee, 1);
			DummyBox.graphics.drawRect(0,0,100,50);
			DummyBox.graphics.endFill();
			var ImageData:BitmapData = new BitmapData(80,40,true,0x000000);
			ImageData.draw(DummyBox);
			BttnTexture = Texture.fromBitmapData(ImageData,false,false);
			StartBttn = new Button(BttnTexture, "Start");
			StartBttn.x = (stage.stageWidth/2)-(StartBttn.width/2);
			StartBttn.y = (stage.stageHeight / 2) - (StartBttn.height / 2);
			StartBttn.addEventListener(Event.TRIGGERED, OnStartGame);
			addChild(StartBttn);
		}
		
		private function OnStartGame(event:Event):void 
		{
			removeChild(StartBttn, true);
			coreGame = new CoreGame();
			addChild(coreGame);
		}
	}

}