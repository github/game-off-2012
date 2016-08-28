/* Flod (replay) version 2.0
   2009/08/15
   Christian Corti
   Neoart Costa Rica

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 	 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 	 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
 	 IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

package neoart.flod {
  import flash.utils.*;

  public class ModSong {
    public static var version:int;

    public var supported:Boolean = true;
    public var title:String;
    public var length:int;
    public var restart:int;
    public var tempo:int = ModFlod.DEFAULT_TEMPO;
    public var numChannels:int = 4;
    public var numPatterns:int;
    public var numSamples:int = 16;
    public var patternLength:int = ModFlod.PATTERN_LENGTH;
    public var positions:Vector.<int>;
    public var patterns:Vector.<ModCommand>;
    public var samples:Vector.<ModSample>;

    protected var standardFx:Vector.<int>;
    protected var extendedFx:Vector.<int>;
    protected var maxSampleLen:int;
    protected var valueFilter:int;
    protected var valueSpeed:int;

    protected const TRACKERS:Vector.<String> = Vector.<String>([
      "Unsupported Format",
      "Ultimate Soundtracker 1.21",
      "Soundtracker AFL/DFJ/DOC/TJC",
      "Ultimate Soundtracker 1.8+",
      "DOC Soundtracker 9",
      "Master Soundtracker",
      "Soundtracker 2.0 DOC",
      "Soundtracker 2.3 SPT",
      "Soundtracker 2.4 SPT",
      "NoiseTracker 1.0",
      "NoiseTracker 1.1",
      "Soundtracker 2.5 SPT",
      "NoiseTracker 1.2",
      "StarTrekker 1.0/1.1",
      "Soundtracker 2.6 SPT",
      "StarTrekker 1.2/1.3",
      "ProTracker 1.0/1.1",
      "ProTracker 2.0/1.3 AF",
      "ProTracker 2.1/2.3",
      "ProTracker 3.0/4.0",
      "MultiTracker"]);

    protected const MARKERS:Vector.<String> = Vector.<String>(
      ["2CHN", "6CHN", "8CHN", "CD81", "OCTA"]);

    public function ModSong(stream:ByteArray, extended:Boolean) {
      version = ModFlod.ULTIMATE_ST;
      initialize(stream, extended);
    }

    public function get tracker():String {
      return TRACKERS[version];
    }

    protected function initialize(stream:ByteArray, extended:Boolean):void {
      var com:ModCommand, i:int, id:String, j:int, s:ByteArray = new ByteArray(), sample:ModSample;
      stream.endian = "littleEndian";
      stream.position = 0;
      title = stream.readMultiByte(20, ModFlod.ENCODING);

      if (title.substr(0, 3) == "MTM") {
        supported = false;
        version = ModFlod.MULTITRACKER;
        return;
      }
      stream.position = 1080;
      id = stream.readMultiByte(4, ModFlod.ENCODING);
      if (isLegal(id)) numSamples = 32;
      j = MARKERS.length;

      for (i = 0; i < j; ++i)
        if (id == MARKERS[i]) {
          supported = false;
          version = ModFlod.UNSUPPORTED;
          return;
        }
      stream.position = 20;
      samples = new Vector.<ModSample>(numSamples, true);
      samples[0] = new ModSample();

      for (i = 0; ++i < numSamples;) {
        s.position = 0;
        stream.readBytes(s, 0, 30);
        sample = new ModSample();
        sample.initialize(s);
        if (sample.realLength > maxSampleLen) maxSampleLen = sample.realLength;
        samples[i] = sample;
      }
      length = stream.readUnsignedByte();
      restart = stream.readUnsignedByte();
      positions = new Vector.<int>(length, true);

      for (i = 0; i < 128; ++i) {
        j = stream.readUnsignedByte();
        if (j > numPatterns) numPatterns = j;
        if (i < length) positions[i] = j;
      }
      stream.position = numSamples > 16 ? 1084 : 600;
      numPatterns++;
      if (id == "M!K!") patternLength = ModFlod.PATTERN_100;
      j = (numPatterns * patternLength) * numChannels;
      patterns = new Vector.<ModCommand>(j, true);
      standardFx = new Vector.<int>(16, true);
      extendedFx = new Vector.<int>(16, true);

      for (i = 0; i < j; ++i) {
        com = extended ? new ModCommandEx() : new ModCommand();
        com.initialize(stream);
        if (com.xeffect != 0) extendedFx[com.xeffect]++;
          else if (com.effect != 0) standardFx[com.effect]++;
        if (com.effect == ModFlod.EX_EFFECT && com.param > valueFilter)
          valueFilter = com.param;
        if (com.effect == ModFlod.SET_SPEED && com.param > valueSpeed)
          valueSpeed = com.param;
        patterns[i] = com;
      }

      detect(id);
      for (i = 0; ++i < numSamples;) samples[i].normalize(stream);
      numSamples--;

      if (version < ModFlod.SOUNDTRACKER_24) {
        tempo = restart;
        restart = 0;
        if (version == ModFlod.ULTIMATE_ST || version == ModFlod.ULTIMATE_ST2) convert(j);
      } else if (restart >= length)
        restart = 0;

      if (tempo < 32 || tempo > 255) tempo = ModFlod.DEFAULT_TEMPO;
      standardFx = null;
      extendedFx = null;
      stream.clear();
    }

    private function detect(marker:String):void {
      if (numSamples > 16) {
        version = ModFlod.SOUNDTRACKER_23;

        if (maxSampleLen > 65535) {
          version = ModFlod.NOISETRACKER_12;
          return;
        }
        if (hasFx(ModFlod.TONE_PORTAMENTO) || hasFx(ModFlod.VIBRATO)) {
          version = ModFlod.NOISETRACKER_10;
        }
        if (restart != 127) version = ModFlod.NOISETRACKER_11;

        if (maxSampleLen > 32767) {
          version = ModFlod.SOUNDTRACKER_24;
          if (hasFx(ModFlod.TONE_PORTAMENTO) || hasFx(ModFlod.VIBRATO))
            version = ModFlod.SOUNDTRACKER_25;
        }
        var id:Array = marker.split(/(\d+)/);

        if (id[0] == "FLT" || id[0] == "EXO") {
          numChannels = id[1];
          if (numChannels != 4) supported = false;
          version = ModFlod.STARTREKKER_10;
          return;
        }
        if (valueFilter > 1 || valueSpeed > 31 || restart == 127) version = ModFlod.PROTRACKER_10;
        if (marker == "M!K!") version = ModFlod.PROTRACKER_22;
        if (hasFx(ModFlod.KARPLUS_STRONG)) version = ModFlod.PROTRACKER_20;

      } else {
        if (restart != 120) version = ModFlod.ULTIMATE_ST2;
        if (hasFx(ModFlod.POSITION_JUMP) || hasFx(ModFlod.PATTERN_BREAK)) {
          version = ModFlod.SOUNDTRACKER_20;
        } else {
          if (hasFx(ModFlod.SET_VOLUME) || hasFx(ModFlod.EX_EFFECT) || hasFx(ModFlod.SET_SPEED))
            version = ModFlod.SOUNDTRACKER_9;

          if (hasFx(ModFlod.TONE_PORTAMENTO) || hasFx(ModFlod.TREMOLO) || hasFx(ModFlod.TONE_PORTA_VOLUME_SLIDE) ||
              hasFx(ModFlod.POSITION_JUMP)   || hasFx(ModFlod.VIBRATO) || hasFx(ModFlod.VIBRATO_VOLUME_SLIDE) ||
              hasFx(ModFlod.SAMPLE_OFFSET)   || hasFx(ModFlod.UNUSED)  || hasFx(ModFlod.VOLUME_SLIDE)) {
            supported = false;
            version = ModFlod.SOUNDTRACKER;
          }
          if (maxSampleLen > 9999)
            version = ModFlod.MASTERTRACKER;
        }
      }
      exceptions();
    }

    private function convert(len:int):void {
      var com:ModCommand, i:int;

      for (i = 0; i < len; ++i) {
        com = patterns[i];
        if (com.effect == 1 || com.effect == 0) {
          com.effect = 0;
        } else {
          if (com.py) {
            com.effect = 1;
            com.param = com.py;
          } else {
            com.param = com.px;
          }
        }
      }
    }

    private function hasFx(index:int, ex:Boolean = false):Boolean {
      if (index > 15) return false;
      return ex ? Boolean(extendedFx[index] > 0) : Boolean(standardFx[index] > 0);
    }

    private function isLegal(text:String):Boolean {
      var c:int, i:int, len:int = text.length;
      if (len == 0) return false;

      for (i = 0; i < len; ++i) {
        c = text.charCodeAt(i);
        if (c) { if ( c < 32 || c > 127) return false; }
      }
      return true;
    }

    private function exceptions():void {
      switch (title) {
        case "bloood":
          version = ModFlod.MASTERTRACKER;
          return;
      }
    }
  }
}