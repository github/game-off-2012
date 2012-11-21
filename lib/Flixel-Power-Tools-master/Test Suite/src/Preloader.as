package 
{
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.DisplayObject;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.display.StageQuality;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.geom.Rectangle;
	import flash.utils.getDefinitionByName;
	
	public class Preloader extends MovieClip
	{
		[Embed(source = '../assets/suite/loading.png')] private var loadingPNG:Class;
		
		private var bg:Bitmap;
		private var load:Bitmap;
		private var progressBar:Bitmap;
		
		public function Preloader() 
		{
			if (stage)
			{
				stage.scaleMode = StageScaleMode.NO_SCALE;
				stage.align = StageAlign.TOP_LEFT;
				stage.quality = StageQuality.LOW;
			}
			
			addEventListener(Event.ENTER_FRAME, checkFrame);
			loaderInfo.addEventListener(ProgressEvent.PROGRESS, progress);
			loaderInfo.addEventListener(IOErrorEvent.IO_ERROR, ioError);
			
			bg = new Bitmap(new BitmapData(640, 512, false, 0x0));
			
			load = new loadingPNG;
			load.scaleX = 2;
			load.scaleY = 2;
			load.x = 320 - load.width / 2;
			load.y = 240 - load.height / 2;
			
			progressBar = new Bitmap(new BitmapData(492, 10, false, 0xff222244));
			progressBar.x = load.x;
			progressBar.y = load.y + load.height + 8;
			
			addChild(bg);
			addChild(load);
			addChild(progressBar);
		}
		
		private function ioError(e:IOErrorEvent):void 
		{
			trace(e.text);
		}
		
		private function progress(e:ProgressEvent):void 
		{
			var pct:int = int((e.bytesLoaded / e.bytesTotal) * 100);
			var fill:int = 5 * pct;
			progressBar.bitmapData.fillRect(new Rectangle(0, 0, fill, 10), 0xffbbccdd);
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
			
			removeChild(load);
			removeChild(progressBar);
			
			startup();
		}
		
		private function startup():void 
		{
			var mainClass:Class = getDefinitionByName("Main") as Class;
			
			addChild(new mainClass() as DisplayObject);
		}
		
	}
	
}