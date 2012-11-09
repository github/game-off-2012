/*
  Flod 4.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod 4.0 - 2012/03/09

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
package neoart.flod.core {
  import flash.events.*;
  import flash.media.*;
  import flash.utils.*;
  import neoart.flip.*;

  public class CorePlayer extends EventDispatcher {
    public static const
      ENCODING : String = "us-ascii";
    public var
      quality   : int,
      record    : int,
      playSong  : int,
      lastSong  : int,
      version   : int,
      variant   : int,
      title     : String = "",
      channels  : int,
      loopSong  : int,
      speed     : int,
      tempo     : int;
    protected var
      hardware  : CoreMixer,
      sound     : Sound,
      soundChan : SoundChannel,
      soundPos  : Number = 0.0,
      endian    : String,
      tick      : int;

    public function CorePlayer(hardware:CoreMixer) {
      hardware.player = this;
      this.hardware = hardware;
    }

    public function set force(value:int):void {
      version = 0;
    }

    public function set ntsc(value:int):void { }

    public function set stereo(value:Number):void { }

    public function set volume(value:Number):void { }

    public function get waveform():ByteArray {
      return hardware.waveform();
    }

    public function toggle(index:int):void { }

    public function load(stream:ByteArray):int {
      var zip:ZipFile;
      hardware.reset();
      stream.position = 0;

      version  = 0;
      playSong = 0;
      lastSong = 0;

      if (stream.readUnsignedInt() == 67324752) {
        zip = new ZipFile(stream);
        stream = zip.uncompress(zip.entries[0]);
      }

      if (stream) {
        stream.endian = endian;
        stream.position = 0;
        loader(stream);
        if (version) setup();
      }
      return version;
    }

    public function play(processor:Sound = null):int {
      if (!version) return 0;
      if (soundPos == 0.0) initialize();
      sound = processor || new Sound();

      if (quality && (hardware is Soundblaster)) {
        sound.addEventListener(SampleDataEvent.SAMPLE_DATA, hardware.accurate);
      } else {
        sound.addEventListener(SampleDataEvent.SAMPLE_DATA, hardware.fast);
      }

      soundChan = sound.play(soundPos);
      soundChan.addEventListener(Event.SOUND_COMPLETE, completeHandler);
      soundPos = 0.0;
      return 1;
    }

    public function pause():void {
      if (!version || !soundChan) return;
      soundPos = soundChan.position;
      removeEvents();
    }

    public function stop():void {
      if (!version) return;
      if (soundChan) removeEvents();
      soundPos = 0.0;
      reset();
    }

    public function process():void { }

    public function fast():void { }

    public function accurate():void { }

    protected function setup():void { }

    //js function reset
    protected function initialize():void {
      tick = 0;
      hardware.initialize();
      hardware.samplesTick = 110250 / tempo;
    }

    protected function reset():void { }

    protected function loader(stream:ByteArray):void { }

    private function completeHandler(e:Event):void {
      stop();
      dispatchEvent(e);
    }

    private function removeEvents():void {
      soundChan.stop();
      soundChan.removeEventListener(Event.SOUND_COMPLETE, completeHandler);
      soundChan.dispatchEvent(new Event(Event.SOUND_COMPLETE));

      if (quality) {
        sound.removeEventListener(SampleDataEvent.SAMPLE_DATA, hardware.accurate);
      } else {
        sound.removeEventListener(SampleDataEvent.SAMPLE_DATA, hardware.fast);
      }
    }
  }
}