package  
{
	import flash.events.Event;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	public class soundManager 
	{
		private var BgMusicChannel:SoundChannel;
		private var SfxChannel:SoundChannel;
		
		private var LvlBgMusic:Sound;
		
		private var eatSfx:Sound;
		private var divideSfx:Sound;
		private var hitSfx:Sound;
		private var diedSfx:Sound;
		
		public function soundManager() 
		{
			//Music
			eatSfx = new Resources.eatSfx as Sound;
			divideSfx = new Resources.divideSfx as Sound;
			hitSfx = new Resources.hitSfx as Sound;
			diedSfx = new Resources.deadSfx as Sound;
			/*LvlBgMusic = new Resources.bgmusic as Sound;
			BgMusicChannel = LvlBgMusic.play();
			BgMusicChannel.addEventListener(Event.SOUND_COMPLETE, OnBgMusicFinished, false, 0, true);
			*/
		}
		
		private function OnBgMusicFinished(event:Event):void 
		{
			BgMusicChannel = LvlBgMusic.play();
			BgMusicChannel.addEventListener(Event.SOUND_COMPLETE, OnBgMusicFinished, false, 0, true);
		}
		
		public function playEat():void
		{
			SfxChannel = eatSfx.play();
		}
		
		public function playDivide():void
		{
			SfxChannel = divideSfx.play();
		}
		
		public function playHit():void
		{
			SfxChannel = hitSfx.play();
		}
		
		public function playDied():void
		{
			SfxChannel = diedSfx.play();
		}
	}

}