/* Flectrum version 1.0
   2009/08/15
   Christian Corti
   Neoart Costa Rica

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 	 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 	 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
 	 IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

package neoart.flectrum {
  import flash.events.*;
  import flash.media.*;
  import flash.utils.*;

  public class SoundEx extends Sound {
    public static const SOUND_START:String = "soundStart";
    public static const SOUND_STOP:String  = "soundStop";

    public var fourier:Boolean;
    public var stretchFactor:int;

    protected var soundChannel:SoundChannel;
    protected var computed:ByteArray;
    protected var spectrum:Vector.<Number>;

    private const TABLE:Vector.<int> = Vector.<int>([
      0, 0,128,85,64,51,42,36,32,28,25,23,21,19,18,17,16,15,14,13,12,12,11,11,10,10, 9, 9, 9, 8, 8, 8,
      8, 7,  7, 7, 7, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
      4, 3,  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2,  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

    public function SoundEx(fourier:Boolean = false, stretchFactor:int = 2) {
      this.fourier = fourier;
      this.stretchFactor = stretchFactor;
      computed = new ByteArray();
      spectrum = new Vector.<Number>;
      super();
    }

    override public function play(startTime:Number = 0, loops:int = 0, sndTransform:SoundTransform = null):SoundChannel {
      soundChannel = super.play(startTime, loops, sndTransform);
      soundChannel.addEventListener(Event.SOUND_COMPLETE, soundCompleteHandler);
      dispatchEvent(new Event(SOUND_START));
      return soundChannel;
    }

    public function stop():void {
      if (!soundChannel) return;
      soundChannel.stop();
      dispatchEvent(new Event(SOUND_STOP));
      soundChannel = null;
    }

    public function get peak():Number {
      if (!soundChannel) return 0;
      var a:Number = soundChannel.leftPeak;
      a += soundChannel.rightPeak;
      return a * 0.5;
    }

    public function get leftPeak():Number {
      if (!soundChannel) return 0;
      return soundChannel.leftPeak;
    }

    public function get rightPeak():Number {
      if (!soundChannel) return 0;
      return soundChannel.rightPeak;
    }

    public function get position():Number {
      if (!soundChannel) return 0;
      return soundChannel.position;
    }

    public function getStereoSampling(interval:int = 256):Vector.<Number> {
      var a:Number, i:int, offset:int = TABLE[interval] << 2, p:int;
      SoundMixer.computeSpectrum(computed, fourier, stretchFactor);
      spectrum.length = interval;

      for (i = 0; i < interval; ++i) {
        p += offset;
        computed.position = p;
        a = computed.readFloat();
        computed.position = p + 1024;
        a += computed.readFloat();
        if (a < 0) a = -a;
        a *= 0.5;
        spectrum[i] = a * (2 - a);
      }
      return spectrum;
    }

    public function getStereoAdd(interval:int = 256):Vector.<Number> {
      var a:Number, i:int, j:int, len:int = TABLE[interval], p:int, s:Number;
      SoundMixer.computeSpectrum(computed, fourier, stretchFactor);
      spectrum.length = interval;

      for (i = 0; i < interval; ++i) {
        a = 0;
        s = 0;
        for (j = 0; j < len; ++j) {
          computed.position = p;
          a = computed.readFloat();
          computed.position = p + 1024;
          a += computed.readFloat();
          if (a < 0) a = -a;
          s += a;
          p += 4;
        }
        s /= len;
        spectrum[i] = s * (2 - s);
      }
      return spectrum;
    }

    protected function soundCompleteHandler(e:Event):void {
      soundChannel.removeEventListener(Event.SOUND_COMPLETE, soundCompleteHandler);
      dispatchEvent(new Event(Event.SOUND_COMPLETE));
      soundChannel = null;
    }
  }
}