package 
{
	import flash.display.DisplayObject;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.text.TextField;
	import flash.utils.getDefinitionByName;
	
	/**
	 * ...
	 * @author Adrian Higareda
	 */
	public class Preloader extends MovieClip 
	{
		private var AlertLabel:TextField;
		private var PercentageLoaded:Number;
		private var bud:Sprite;
		private var vine:Sprite;
		
		public function Preloader() 
		{
			if (stage) {
				stage.scaleMode = StageScaleMode.NO_SCALE;
				stage.align = StageAlign.TOP_LEFT;
			}
			addEventListener(Event.ENTER_FRAME, checkFrame);
			loaderInfo.addEventListener(ProgressEvent.PROGRESS, progress);
			loaderInfo.addEventListener(IOErrorEvent.IO_ERROR, ioError);
			
			//Show loader
			AlertLabel = new TextField();
			AlertLabel.textColor = 0xFFFFFF;
			AlertLabel.text = "0% Loaded";
			AlertLabel.x = 300 - (AlertLabel.width/2);
			AlertLabel.y = 500;
			addChild(AlertLabel);
			
			bud = new Sprite();
			bud.graphics.beginFill(0x4DBD37);
			bud.graphics.drawRect(0, 0, 50, 50);
			bud.graphics.endFill();
			bud.x = 300 - (bud.width / 2);
			bud.y = 430;
			addChild(bud);
			
			vine = new Sprite();
			vine.graphics.beginFill(0x4DBD37);
			vine.graphics.drawRect(0, 0, 10, 10);
			vine.graphics.endFill();
			vine.x = 300 - (vine.width / 2);
			vine.y = 470 - vine.height;
			addChild(vine);
		}
		
		private function ioError(e:IOErrorEvent):void 
		{
			trace(e.text);
		}
		
		private function progress(event:ProgressEvent):void 
		{
			// Update loader
			PercentageLoaded = event.bytesLoaded / event.bytesTotal * 100;
			bud.y = 430 - (PercentageLoaded * 2);
			vine.height = PercentageLoaded * 2;
			vine.y = 470 - vine.height;
			AlertLabel.text = int (PercentageLoaded) + "% Loaded";
		}
		
		private function checkFrame(e:Event):void 
		{
			if (currentFrame == totalFrames) 
			{
				stop();
				loadingFinished();
			}
		}
		
		private function loadingFinished():void 
		{
			removeEventListener(Event.ENTER_FRAME, checkFrame);
			loaderInfo.removeEventListener(ProgressEvent.PROGRESS, progress);
			loaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, ioError);
			
			//Hide loader
			removeChild(AlertLabel);
			AlertLabel = null;
			removeChild(bud);
			bud = null;
			removeChild(vine);
			vine = null;
			
			startup();
		}
		
		private function startup():void 
		{
			var mainClass:Class = getDefinitionByName("Main") as Class;
			addChild(new mainClass() as DisplayObject);
		}
		
	}
	
}