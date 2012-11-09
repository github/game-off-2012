package
{

	import flash.utils.ByteArray;
	import org.flixel.*;
	import neoart.flod.fasttracker.*;
	import flash.display.*;
	import flash.events.*;
	import flash.net.*;
	import neoart.flod.*;
	import neoart.flod.core.*;

	public class MenuState extends FlxState
	{
		[Embed(source = "bunufuku.xm", mimeType = "application/octet-stream")]
		private var Song:Class;
		
		private var playButton:FlxButton;
		private var devButton:FlxButton;
		private var Title:FlxText;
		private var player:F2Player;
		//private var file:FileReference;
		//private var loader:FileLoader;
		
		
		
		override public function create():void
		{
			FlxG.bgColor = 0xff000000;
			var width:int = 100
			Title = new FlxText((FlxG.width / 2) - (width / 2), FlxG.height / 3, width, "GithubJam");
			Title.alignment = "center";
			add(Title);
			
			devButton = new FlxButton(FlxG.width/2-40,FlxG.height / 3 + 60, "Insert Site", onSite);
			devButton.soundOver = null;  //replace with mouseOver sound
			devButton.color = 0xffD4D943;
			devButton.label.color = 0xffD8EBA2;
			add(devButton);
			
			playButton = new FlxButton(FlxG.width/2-40,FlxG.height / 3 + 100, "Click To Play", onPlay);
			playButton.soundOver = devButton.soundOver;
			playButton.color = devButton.color;
			playButton.label.color = devButton.label.color;
			add(playButton);
			
			player = new F2Player();
			player.load(new Song as ByteArray);
			if (player.version) player.play();
			
			//file = new FileReference();;
			
			
			
			FlxG.mouse.show();
			
		}
		
		override public function update():void
		{
			super.update();	
		}
		
		protected function onSite():void
		{
			
			FlxU.openURL("http://example.com/");  //replace with your site's URL 
		}
		
		protected function onPlay():void
		{
			playButton.exists = false;
			FlxG.switchState(new PlayState());
			//file.addEventListener(Event.CANCEL, cancelHandler);
			//file.addEventListener(Event.SELECT, selectHandler);
			//file.browse();
		}
		//
		//private function cancelHandler(e:Event):void {
			//file.removeEventListener(Event.CANCEL, cancelHandler);
			//file.removeEventListener(Event.SELECT, selectHandler);
		//}
		//
		//private function selectHandler(e:Event):void {
		  //cancelHandler(e);
		  //player.stop();
		  //file.addEventListener(Event.COMPLETE, completeHandler);
		  //file.load();
		//}
		
		//private function completeHandler(e:Event):void {
		  //file.removeEventListener(Event.COMPLETE, completeHandler);
		  //player.load(file.data);
		  //if (player.version) player.play();
		//}
		
    }
}

