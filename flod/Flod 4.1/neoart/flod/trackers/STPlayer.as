/*
  Flod 4.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod 4.1 - 2012/04/13

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
package neoart.flod.trackers {
  import flash.utils.*;
  import neoart.flod.core.*;

  public final class STPlayer extends AmigaPlayer {
    private var
      track      : Vector.<int>,
      patterns   : Vector.<AmigaRow>,
      samples    : Vector.<AmigaSample>,
      length     : int,
      voices     : Vector.<STVoice>,
      trackPos   : int,
      patternPos : int,
      jumpFlag   : int;

    public function STPlayer(amiga:Amiga = null) {
      super(amiga);
      PERIODS.fixed = true;

      track   = new Vector.<int>(128, true);
      samples = new Vector.<AmigaSample>(16, true);
      voices  = new Vector.<STVoice>(4, true);

      voices[0] = new STVoice(0);
      voices[0].next = voices[1] = new STVoice(1);
      voices[1].next = voices[2] = new STVoice(2);
      voices[2].next = voices[3] = new STVoice(3);
    }

    override public function set force(value:int):void {
      if (value < ULTIMATE_SOUNDTRACKER)
        value = ULTIMATE_SOUNDTRACKER;
      else if (value > DOC_SOUNDTRACKER_20)
        value = DOC_SOUNDTRACKER_20;

      version = value;
    }

    override public function set ntsc(value:int):void {
      super.ntsc = value;

      if (version < DOC_SOUNDTRACKER_9)
        amiga.samplesTick = int((240 - tempo) * (value ? 7.5152005551 : 7.58437970472));
    }

    override public function process():void {
      var chan:AmigaChannel, row:AmigaRow, sample:AmigaSample, value:int, voice:STVoice = voices[0];

      if (!tick) {
        value = track[trackPos] + patternPos;

        while (voice) {
          chan = voice.channel;
          voice.enabled = 0;

          row = patterns[int(value + voice.index)];
          voice.period = row.note;
          voice.effect = row.effect;
          voice.param  = row.param;

          if (row.sample) {
            sample = voice.sample = samples[row.sample];

            if (((version & 2) == 2) && voice.effect == 12) chan.volume = voice.param;
              else chan.volume = sample.volume;
          } else {
            sample = voice.sample;
          }

          if (voice.period) {
            voice.enabled = 1;

            chan.enabled = 0;
            chan.pointer = sample.pointer;
            chan.length  = sample.length;
            chan.period  = voice.last = voice.period;
          }

          if (voice.enabled) chan.enabled = 1;
          chan.pointer = sample.loopPtr;
          chan.length  = sample.repeat;

          if (version < DOC_SOUNDTRACKER_20) {
            voice = voice.next;
            continue;
          }

          switch (voice.effect) {
            case 11:  //position jump
              trackPos = voice.param - 1;
              jumpFlag ^= 1;
              break;
            case 12:  //set volume
              chan.volume = voice.param;
              break;
            case 13:  //pattern break
              jumpFlag ^= 1;
              break;
            case 14:  //set filter
              amiga.filter.active = voice.param ^ 1;
              break;
            case 15:  //set speed
              if (!voice.param) break;
              speed = voice.param & 0x0f;
              tick = 0;
              break;
          }
          voice = voice.next;
        }
      } else {
        while (voice) {
          if (!voice.param) {
            voice = voice.next;
            continue;
          }
          chan = voice.channel;

          if (version == ULTIMATE_SOUNDTRACKER) {
            if (voice.effect == 1) {
              arpeggio(voice);
            } else if (voice.effect == 2) {
              value = voice.param >> 4;

              if (value) voice.period += value;
                else voice.period -= (voice.param & 0x0f);

              chan.period = voice.period;
            }
          } else {
            switch (voice.effect) {
              case 0: //arpeggio
                arpeggio(voice);
                break;
              case 1: //portamento up
                voice.last -= voice.param & 0x0f;
                if (voice.last < 113) voice.last = 113;
                chan.period = voice.last;
                break;
              case 2: //portamento down
                voice.last += voice.param & 0x0f;
                if (voice.last > 856) voice.last = 856;
                chan.period = voice.last;
                break;
            }

            if ((version & 2) != 2) {
              voice = voice.next;
              continue;
            }

            switch (voice.effect) {
              case 12:  //set volume
                chan.volume = voice.param;
                break;
              case 14:  //set filter
                amiga.filter.active = 0;
                break;
              case 15:  //set speed
                speed = voice.param & 0x0f;
                break;
            }
          }
          voice = voice.next;
        }
      }

      if (++tick == speed) {
        tick = 0;
        patternPos += 4;

        if (patternPos == 256 || jumpFlag) {
          patternPos = jumpFlag = 0;

          if (++trackPos == length) {
            trackPos = 0;
            amiga.complete = 1;
          }
        }
      }
    }

    override protected function initialize():void {
      var voice:STVoice = voices[0];
      super.initialize();
      ntsc = standard;

      speed      = 6;
      trackPos   = 0;
      patternPos = 0;
      jumpFlag   = 0;

      while (voice) {
        voice.initialize();
        voice.channel = amiga.channels[voice.index];
        voice.sample  = samples[0];
        voice = voice.next;
      }
    }

    override protected function loader(stream:ByteArray):void {
      var higher:int, i:int, j:int, row:AmigaRow, sample:AmigaSample, score:int, size:int, value:int;
      if (stream.length < 1626) return;

      title = stream.readMultiByte(20, ENCODING);
      score += isLegal(title);

      version = ULTIMATE_SOUNDTRACKER;
      stream.position = 42;

      for (i = 1; i < 16; ++i) {
        value = stream.readUnsignedShort();

        if (!value) {
          samples[i] = null;
          stream.position += 28;
          continue;
        }

        sample = new AmigaSample();
        stream.position -= 24;

        sample.name = stream.readMultiByte(22, ENCODING);
        sample.length = value << 1;
        stream.position += 3;

        sample.volume = stream.readUnsignedByte();
        sample.loop   = stream.readUnsignedShort();
        sample.repeat = stream.readUnsignedShort() << 1;

        stream.position += 22;
        sample.pointer = size;
        size += sample.length;
        samples[i] = sample;

        score += isLegal(sample.name);
        if (sample.length > 9999) version = MASTER_SOUNDTRACKER;
      }

      stream.position = 470;
      length = stream.readUnsignedByte();
      tempo  = stream.readUnsignedByte();

      for (i = 0; i < 128; ++i) {
        value = stream.readUnsignedByte() << 8;
        if (value > 16384) score--;
        track[i] = value;
        if (value > higher) higher = value;
      }

      stream.position = 600;
      higher += 256;
      patterns = new Vector.<AmigaRow>(higher, true);

      i = (stream.length - size - 600) >> 2;
      if (higher > i) higher = i;

      for (i = 0; i < higher; ++i) {
        row = new AmigaRow();

        row.note   = stream.readUnsignedShort();
        value      = stream.readUnsignedByte();
        row.param  = stream.readUnsignedByte();
        row.effect = value & 0x0f;
        row.sample = value >> 4;

        patterns[i] = row;

        if (row.effect > 2 && row.effect < 11) score--;
        if (row.note) {
          if (row.note < 113 || row.note > 856) score--;
        }

        if (row.sample)
          if (row.sample > 15 || !samples[row.sample]) {
            if (row.sample > 15) score--;
            row.sample = 0;
          }

        if (row.effect > 2 || (!row.effect && row.param != 0))
          version = DOC_SOUNDTRACKER_9;

        if (row.effect == 11 || row.effect == 13)
          version = DOC_SOUNDTRACKER_20;
      }

      amiga.store(stream, size);

      for (i = 1; i < 16; ++i) {
        sample = samples[i];
        if (!sample) continue;

        if (sample.loop) {
          sample.loopPtr = sample.pointer + sample.loop;
          sample.pointer = sample.loopPtr;
          sample.length  = sample.repeat;
        } else {
          sample.loopPtr = amiga.memory.length;
          sample.repeat  = 2;
        }

        size = sample.pointer + 4;
        for (j = sample.pointer; j < size; ++j) amiga.memory[j] = 0;
      }

      sample = new AmigaSample();
      sample.pointer = sample.loopPtr = amiga.memory.length;
      sample.length  = sample.repeat  = 2;
      samples[0] = sample;

      if (score < 1) version = 0;
    }

    private function arpeggio(voice:STVoice):void {
      var chan:AmigaChannel = voice.channel, i:int = 0, param:int = tick % 3;

      if (!param) {
        chan.period = voice.last;
        return;
      }

      if (param == 1) param = voice.param >> 4;
        else param = voice.param & 0x0f;

      while (voice.last != PERIODS[i]) i++;
      chan.period = PERIODS[int(i + param)];
    }

    private function isLegal(text:String):int {
      var ascii:int, i:int = 0, len:int = text.length;
      if (!len) return 0;

      for (; i < len; ++i) {
        ascii = text.charCodeAt(i);
        if (ascii && (ascii < 32 || ascii > 127)) return 0;
      }
      return 1;
    }

    public static const
      ULTIMATE_SOUNDTRACKER : int = 1,
      DOC_SOUNDTRACKER_9    : int = 2,
      MASTER_SOUNDTRACKER   : int = 3,
      DOC_SOUNDTRACKER_20   : int = 4;

    private const
      PERIODS: Vector.<int> = Vector.<int>([
        856,808,762,720,678,640,604,570,538,508,480,453,
        428,404,381,360,339,320,302,285,269,254,240,226,
        214,202,190,180,170,160,151,143,135,127,120,113,
        0,0,0]);
  }
}