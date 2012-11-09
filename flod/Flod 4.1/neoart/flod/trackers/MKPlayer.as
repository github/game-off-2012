/*
  Flod 4.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod 4.1 - 2012/04/16

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

  public final class MKPlayer extends AmigaPlayer {
    private var
      track        : Vector.<int>,
      patterns     : Vector.<AmigaRow>,
      samples      : Vector.<AmigaSample>,
      length       : int,
      restart      : int,
      voices       : Vector.<MKVoice>,
      trackPos     : int,
      patternPos   : int,
      jumpFlag     : int,
      vibratoDepth : int,
      restartSave  : int;

    public function MKPlayer(amiga:Amiga = null) {
      super(amiga);
      PERIODS.fixed = true;
      VIBRATO.fixed = true;

      track   = new Vector.<int>(128, true);
      samples = new Vector.<AmigaSample>(32, true);
      voices  = new Vector.<MKVoice>(4, true);

      voices[0] = new MKVoice(0);
      voices[0].next = voices[1] = new MKVoice(1);
      voices[1].next = voices[2] = new MKVoice(2);
      voices[2].next = voices[3] = new MKVoice(3);
    }

    override public function set force(value:int):void {
      if (value < SOUNDTRACKER_23)
        value = SOUNDTRACKER_23;
      else if (value > NOISETRACKER_20)
        value = NOISETRACKER_20;

      version = value;

      if (value == NOISETRACKER_20) vibratoDepth = 6;
        else vibratoDepth = 7;

      if (value == NOISETRACKER_10) {
        restartSave = restart;
        restart = 0;
      } else {
        restart = restartSave;
        restartSave = 0;
      }
    }

    override public function process():void {
      var chan:AmigaChannel, i:int, len:int, pattern:int, period:int, row:AmigaRow, sample:AmigaSample, slide:int, value:int, voice:MKVoice = voices[0];

      if (!tick) {
        pattern = track[trackPos] + patternPos;

        while (voice) {
          chan = voice.channel;
          voice.enabled = 0;

          row = patterns[int(pattern + voice.index)];
          voice.effect = row.effect;
          voice.param  = row.param;

          if (row.sample) {
            sample = voice.sample = samples[row.sample];
            chan.volume = voice.volume = sample.volume;
          } else {
            sample = voice.sample;
          }

          if (row.note) {
            if (voice.effect == 3 || voice.effect == 5) {
              if (row.note < voice.period) {
                voice.portaDir = 1;
                voice.portaPeriod = row.note;
              } else if (row.note > voice.period) {
                voice.portaDir = 0;
                voice.portaPeriod = row.note;
              } else {
                voice.portaPeriod = 0;
              }
            } else {
              voice.enabled = 1;
              voice.vibratoPos = 0;

              chan.enabled = 0;
              chan.pointer = sample.pointer;
              chan.length  = sample.length;
              chan.period  = voice.period = row.note;
            }
          }

          switch (voice.effect) {
            case 11:  //position jump
              trackPos = voice.param - 1;
              jumpFlag ^= 1;
              break;
            case 12:  //set volume
              chan.volume = voice.param;

              if (version == NOISETRACKER_20)
                voice.volume = voice.param;
              break;
            case 13:  //pattern break
              jumpFlag ^= 1;
              break;
            case 14:  //set filter
              amiga.filter.active = voice.param ^ 1;
              break;
            case 15:  //set speed
              value = voice.param;

              if (value < 1) value = 1;
                else if (value > 31) value = 31;

              speed = value;
              tick = 0;
              break;
          }

          if (voice.enabled) chan.enabled = 1;
          chan.pointer = sample.loopPtr;
          chan.length  = sample.repeat;

          voice = voice.next;
        }
      } else {
        while (voice) {
          chan = voice.channel;

          if (!voice.effect && !voice.param) {
            chan.period = voice.period;
            voice = voice.next;
            continue;
          }

          switch (voice.effect) {
            case 0:   //arpeggio
              value = tick % 3;

              if (!value) {
                chan.period = voice.period;
                voice = voice.next;
                continue;
              }

              if (value == 1) value = voice.param >> 4;
                else value = voice.param & 0x0f;

              period = voice.period & 0x0fff;
              len = 37 - value;

              for (i = 0; i < len; ++i) {
                if (period >= PERIODS[i]) {
                  chan.period = PERIODS[int(i + value)];
                  break;
                }
              }
              break;
            case 1:   //portamento up
              voice.period -= voice.param;
              if (voice.period < 113) voice.period = 113;
              chan.period = voice.period;
              break;
            case 2:   //portamento down
              voice.period += voice.param;
              if (voice.period > 856) voice.period = 856;
              chan.period = voice.period;
              break;
            case 3:   //tone portamento
            case 5:   //tone portamento + volume slide
              if (voice.effect == 5) {
                slide = 1;
              } else if (voice.param) {
                voice.portaSpeed = voice.param;
                voice.param = 0;
              }

              if (voice.portaPeriod) {
                if (voice.portaDir) {
                  voice.period -= voice.portaSpeed;

                  if (voice.period <= voice.portaPeriod) {
                    voice.period = voice.portaPeriod;
                    voice.portaPeriod = 0;
                  }
                } else {
                  voice.period += voice.portaSpeed;

                  if (voice.period >= voice.portaPeriod) {
                    voice.period = voice.portaPeriod;
                    voice.portaPeriod = 0;
                  }
                }
              }
              chan.period = voice.period;
              break;
            case 4:   //vibrato
            case 6:   //vibrato + volume slide
              if (voice.effect == 6) {
                slide = 1
              } else if (voice.param) {
                voice.vibratoSpeed = voice.param;
              }

              value = (voice.vibratoPos >> 2) & 31;
              value = ((voice.vibratoSpeed & 0x0f) * VIBRATO[value]) >> vibratoDepth;

              if (voice.vibratoPos > 127) chan.period = voice.period - value;
                else chan.period = voice.period + value;

              value = (voice.vibratoSpeed >> 2) & 60;
              voice.vibratoPos = (voice.vibratoPos + value) & 255;
              break;
            case 10:  //volume slide
              slide = 1;
              break;
          }

          if (slide) {
            value = voice.param >> 4;
            slide = 0;

            if (value) voice.volume += value;
              else voice.volume -= voice.param & 0x0f;

            if (voice.volume < 0) voice.volume = 0;
              else if (voice.volume > 64) voice.volume = 64;

            chan.volume = voice.volume;
          }
          voice = voice.next;
        }
      }

      if (++tick == speed) {
        tick = 0;
        patternPos += 4;

        if (patternPos == 256 || jumpFlag) {
          patternPos = jumpFlag = 0;
          trackPos = (++trackPos & 127);

          if (trackPos == length) {
            trackPos = restart;
            amiga.complete = 1;
          }
        }
      }
    }

    override protected function initialize():void {
      var voice:MKVoice = voices[0];
      super.initialize();
      force = version;

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
      var higher:int, i:int, id:String, j:int, row:AmigaRow, sample:AmigaSample, size:int, value:int;
      if (stream.length < 2106) return;

      stream.position = 1080;
      id = stream.readMultiByte(4, ENCODING);
      if (id != "M.K." && id != "FLT4") return;

      stream.position = 0;
      title = stream.readMultiByte(20, ENCODING);
      version = SOUNDTRACKER_23;
      stream.position += 22;

      for (i = 1; i < 32; ++i) {
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
        sample.loop   = stream.readUnsignedShort() << 1;
        sample.repeat = stream.readUnsignedShort() << 1;

        stream.position += 22;
        sample.pointer = size;
        size += sample.length;
        samples[i] = sample;

        if (sample.length > 32768)
          version = SOUNDTRACKER_24;
      }

      stream.position = 950;
      length  = stream.readUnsignedByte();
      value   = stream.readUnsignedByte();
      restart =  value < length ? value : 0;

      for (i = 0; i < 128; ++i) {
        value = stream.readUnsignedByte() << 8;
        track[i] = value;
        if (value > higher) higher = value;
      }

      stream.position = 1084;
      higher += 256;
      patterns = new Vector.<AmigaRow>(higher, true);

      for (i = 0; i < higher; ++i) {
        row = new AmigaRow();
        value = stream.readUnsignedInt();

        row.note   = (value >> 16) & 0x0fff;
        row.effect = (value >>  8) & 0x0f;
        row.sample = (value >> 24) & 0xf0 | (value >> 12) & 0x0f;
        row.param  = value & 0xff;

        patterns[i] = row;

        if (row.sample > 31 || !samples[row.sample]) row.sample = 0;

        if (row.effect == 3 || row.effect == 4)
          version = NOISETRACKER_10;

        if (row.effect == 5 || row.effect == 6)
          version = NOISETRACKER_20;

        if (row.effect > 6 && row.effect < 10) {
          version = 0;
          return;
        }
      }

      amiga.store(stream, size);

      for (i = 1; i < 32; ++i) {
        sample = samples[i];
        if (!sample) continue;

        if (sample.name.indexOf("2.0") > -1)
          version = NOISETRACKER_20;

        if (sample.loop) {
          sample.loopPtr = sample.pointer + sample.loop;
          sample.length  = sample.loop + sample.repeat;
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

      if (version < NOISETRACKER_20 && restart != 127)
        version = NOISETRACKER_11;
    }

    public static const
      SOUNDTRACKER_23 : int = 1,
      SOUNDTRACKER_24 : int = 2,
      NOISETRACKER_10 : int = 3,
      NOISETRACKER_11 : int = 4,
      NOISETRACKER_20 : int = 5;

    private const
      PERIODS: Vector.<int> = Vector.<int>([
        856,808,762,720,678,640,604,570,538,508,480,453,
        428,404,381,360,339,320,302,285,269,254,240,226,
        214,202,190,180,170,160,151,143,135,127,120,113,0]),

      VIBRATO: Vector.<int> = Vector.<int>([
          0, 24, 49, 74, 97,120,141,161,180,197,212,224,
        235,244,250,253,255,253,250,244,235,224,212,197,
        180,161,141,120, 97, 74, 49, 24]);
  }
}