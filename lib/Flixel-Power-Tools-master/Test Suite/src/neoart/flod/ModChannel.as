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

  public class ModChannel {
    public var id:int;
    public var mute:Boolean;
    public var panning:Number = 1.0;
    public var command:ModCommand;
    public var sample:ModSample;

    public var period:int;
    public var note:int;
    public var volume:int;
    public var phase:Number = 0.0;
    public var sampleLen:int;
    public var sampleOffset:int;
    public var wavePos:int;

    public var voicePeriod:int;
    public var voiceSample:ModSample;
    public var voiceVolume:int;

    public var glissando:Boolean;
    public var invertPos:int;
    public var invertSpeed:int;
    public var loopRow:int;
    public var loopCounter:int;
    public var portaPeriod:int;
    public var portaSpeed:int;
    public var tremoloDepth:int;
    public var tremoloPos:int;
    public var tremoloRetrig:Boolean = true;
    public var tremoloSpeed:int;
    public var tremoloWave:int;
    public var vibratoDepth:int;
    public var vibratoPos:int;
    public var vibratoRetrig:Boolean = true;
    public var vibratoSpeed:int;
    public var vibratoWave:int;

    protected var m_finetune:int;

    protected const FUNK_TABLE:Vector.<int> = Vector.<int>([
      0, 5, 6, 7, 8, 10, 11, 13, 16, 19, 22, 26, 32, 43, 64, 128]);

    protected const VIBRATO_TABLE:Vector.<int> = Vector.<int>([
        0,  24,  49,  74,  97, 120, 141, 161, 180, 197, 212, 224,
      235, 244, 250, 253, 255, 253, 250, 244, 235, 224, 212, 197,
      180, 161, 141, 120,  97,  74,  49,  24]);

    public function ModChannel(id:int, sample:ModSample) {
      this.id = id;
      this.sample = this.voiceSample = sample;
      command = new ModCommand();
      if ((++id & 2) == 0) panning = -panning;
    }

    public function get finetune():int { return m_finetune; }
    public function set finetune(value:int):void {
      m_finetune = value * 36;
    }

    public function invertLoop():void {
      invertPos += FUNK_TABLE[invertSpeed];

      if (invertPos >= 128) {
        invertPos = 0;
        if (++wavePos >= sampleLen) wavePos = sample.loopStart;
        sample.wave[wavePos] = -sample.wave[wavePos];
      }
    }

    public function karplusStrong():void {
      var i:int, len:int = sample.length - 2;

      for (i = sample.loopStart; i < len;)
        sample.wave[i] = (sample.wave[i] + sample.wave[++i]) * 0.5;

      sample.wave[++i] = (sample.wave[i] + sample.wave[0]) * 0.5;
    }

    public function tonePortamento():void {
      if (period >= portaPeriod) {
        if ((period -= portaSpeed) < portaPeriod) {
          period = portaPeriod;
          portaPeriod = 0;
        }
      } else {
        if ((period += portaSpeed) > portaPeriod) {
          period = portaPeriod;
          portaPeriod = 0;
        }
      }

      if (glissando) {
        for (var i:int = 0; i < 36; ++i)
          if (period > ModFlod.PERIODS[i]) break;
        i--;
        period = ModFlod.PERIODS[m_finetune + i];
      }
      voicePeriod = period;
    }

    public function tremolo():void {
      var pos:int = tremoloPos & 31, delta:int = 255;

      switch (tremoloWave) {
        case 0:
          delta = VIBRATO_TABLE[pos];
          break;
        case 1:
          pos <<= 3;
          if (tremoloPos < 0) delta -= pos;
            else delta = pos;
          break;
      }

      delta = (delta * tremoloDepth) >> 6;

      if (tremoloPos < 0) voiceVolume = volume - delta;
        else voiceVolume = volume + delta;
      if (voiceVolume < 0) voiceVolume = 0;
        else if (voiceVolume > 64) voiceVolume = 64;

      if ((tremoloPos += tremoloSpeed) > 31) tremoloPos -= 64;
    }

    public function vibrato():void {
      var pos:int = vibratoPos & 31, delta:int = 255;

      switch (vibratoWave) {
        case 0:
          delta = VIBRATO_TABLE[pos];
          break;
        case 1:
          pos <<= 3;
          if (vibratoPos < 0) delta -= pos;
            else delta = pos;
          break;
      }

      delta = (delta * vibratoDepth) >> 7;

      if (vibratoPos < 0) voicePeriod = period - delta;
        else voicePeriod = period + delta;

      if ((vibratoPos += vibratoSpeed) > 31) vibratoPos -= 64;
    }

    public function volumeSlide():void {
      if (command.px != 0) volume += command.px;
        else if (command.py != 0) volume -= command.py;
      if (volume < 0) volume = 0;
        else if (volume > 64) volume = 64;

      voiceVolume = volume;
    }

    public function reset(sample:ModSample):void {
      this.sample = this.voiceSample = sample;
      command = new ModCommand();
      m_finetune = 0;

      period    = note         = 0;
      volume    = phase        = 0;
      sampleLen = sampleOffset = 0;
      wavePos   = voicePeriod  = voiceVolume = 0;

      invertPos     = invertSpeed = 0;
      loopRow       = loopCounter = 0;
      portaPeriod   = portaSpeed  = 0;
      tremoloDepth  = tremoloPos  = 0;
      tremoloSpeed  = tremoloWave = 0;
      vibratoDepth  = vibratoPos  = 0;
      vibratoSpeed  = vibratoWave = 0;
      glissando     = false;
      tremoloRetrig = true;
      vibratoRetrig = true;
    }
  }
}