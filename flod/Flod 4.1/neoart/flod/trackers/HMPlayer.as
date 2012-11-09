/*
  Flod 4.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod 4.1 - 2012/04/17

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

  public final class HMPlayer extends AmigaPlayer {
    private var
      track      : Vector.<int>,
      patterns   : Vector.<AmigaRow>,
      samples    : Vector.<HMSample>,
      length     : int,
      restart    : int,
      voices     : Vector.<HMVoice>,
      trackPos   : int,
      patternPos : int,
      jumpFlag   : int;

    public function HMPlayer(amiga:Amiga = null) {
      super(amiga);
      MEGARPEGGIO.fixed = true;
      PERIODS.fixed = true;
      VIBRATO.fixed = true;

      track   = new Vector.<int>(128, true);
      samples = new Vector.<HMSample>(32, true);
      voices  = new Vector.<HMVoice>(4, true);

      voices[0] = new HMVoice(0);
      voices[0].next = voices[1] = new HMVoice(1);
      voices[1].next = voices[2] = new HMVoice(2);
      voices[2].next = voices[3] = new HMVoice(3);
    }

    override public function process():void {
      var chan:AmigaChannel, pattern:int, row:AmigaRow, sample:HMSample, value:int, voice:HMVoice = voices[0];

      if (!this.tick) {
        pattern = track[trackPos] + patternPos;

        while (voice) {
          chan = voice.channel;
          voice.enabled = 0;

          row = patterns[int(pattern + voice.index)];
          voice.effect = row.effect;
          voice.param  = row.param;

          if (row.sample) {
            sample = voice.sample = samples[row.sample];
            voice.volume2 = sample.volume;

            if (sample.name == "Mupp") {
              sample.loopPtr = sample.pointer + sample.waves[0];
              voice.handler = 1;
              voice.volume1 = sample.volumes[0];
            } else {
              voice.handler = 0;
              voice.volume1 = 64;
            }
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
              voice.period     = row.note;
              voice.vibratoPos = 0;
              voice.wavePos    = 0;
              voice.enabled    = 1;

              chan.enabled = 0;
              value = (voice.period * sample.finetune) >> 8;
              chan.period = voice.period + value;

              if (voice.handler) {
                chan.pointer = sample.loopPtr;
                chan.length  = sample.repeat;
              } else {
                chan.pointer = sample.pointer;
                chan.length  = sample.length;
              }
            }
          }

          switch (voice.effect) {
            case 11:  //position jump
              trackPos = voice.param - 1;
              jumpFlag = 1;
              break;
            case 12:  //set volume
              voice.volume2 = voice.param;
              if (voice.volume2 > 64) voice.volume2 = 64;
              break;
            case 13:  //pattern break
              jumpFlag = 1;
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

          if (!row.note) effects(voice);
          handler(voice);

          if (voice.enabled) chan.enabled = 1;
          chan.pointer = sample.loopPtr;
          chan.length  = sample.repeat;

          voice = voice.next;
        }
      } else {
        while (voice) {
          effects(voice);
          handler(voice);

          sample = voice.sample;
          voice.channel.pointer = sample.loopPtr;
          voice.channel.length  = sample.repeat;

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
      var voice:HMVoice = voices[0];
      super.initialize();

      speed      = 6;
      trackPos   = 0;
      patternPos = 0;
      jumpFlag   = 0;

      amiga.samplesTick = 884;

      while (voice) {
        voice.initialize();
        voice.channel = amiga.channels[voice.index];
        voice.sample  = samples[0];
        voice = voice.next;
      }
    }

    override protected function loader(stream:ByteArray):void {
      var count:int, higher:int, i:int, id:String, j:int, mupp:int, position:int, row:AmigaRow, sample:HMSample, size:int, value:int;
      if (stream.length < 2106) return;

      stream.position = 1080;
      id = stream.readMultiByte(4, ENCODING);
      if (id != "FEST") return;

      stream.position = 950;
      length  = stream.readUnsignedByte();
      restart = stream.readUnsignedByte();

      for (i = 0; i < 128; ++i)
        track[i] = stream.readUnsignedByte();

      stream.position = 0;
      title = stream.readMultiByte(20, ENCODING);
      version = 1;

      for (i = 1; i < 32; ++i) {
        samples[i] = null;
        id = stream.readMultiByte(4, ENCODING);

        if (id == "Mupp") {
          value = stream.readUnsignedByte();
          count = value - higher++;
          for (j = 0; j < 128; ++j)
            if (track[j] && track[j] >= count) track[j]--;

          sample = new HMSample();
          sample.name = id;
          sample.length  = sample.repeat = 32;
          sample.restart = stream.readUnsignedByte();
          sample.waveLen = stream.readUnsignedByte();
          stream.position += 17;
          sample.finetune = stream.readByte();
          sample.volume   = stream.readUnsignedByte();

          position = stream.position + 4;
          value = 1084 + (value << 10);
          stream.position = value;

          sample.pointer = amiga.memory.length;
          sample.waves = new Vector.<int>(64, true);
          sample.volumes = new Vector.<int>(64, true);
          amiga.store(stream, 896);

          for (j = 0; j < 64; ++j)
            sample.waves[j] = stream.readUnsignedByte() << 5;
          for (j = 0; j < 64; ++j)
            sample.volumes[j] = stream.readUnsignedByte() & 127;

          stream.position = value;
          stream.writeInt(0x666c6f64);
          stream.position = position;
          mupp += 896;
        } else {
          id = id.substr(0, 2);
          if (id == "El")
            stream.position += 18;
          else {
            stream.position -= 4;
            id = stream.readMultiByte(22, ENCODING);
          }

          value = stream.readUnsignedShort();
          if (!value) {
            stream.position += 6;
            continue;
          }

          sample = new HMSample();
          sample.name = id;
          sample.pointer  = size;
          sample.length   = value << 1;
          sample.finetune = stream.readByte();
          sample.volume   = stream.readUnsignedByte();
          sample.loop     = stream.readUnsignedShort() << 1;
          sample.repeat   = stream.readUnsignedShort() << 1;
          size += sample.length;
        }
        samples[i] = sample;
      }

      for (i = 0; i < 128; ++i) {
        value = track[i] << 8;
        track[i] = value;
        if (value > higher) higher = value;
      }

      stream.position = 1084;
      higher += 256;
      patterns = new Vector.<AmigaRow>(higher, true);

      for (i = 0; i < higher; ++i) {
        value = stream.readUnsignedInt();
        while (value == 0x666c6f64) {
          stream.position += 1020;
          value = stream.readUnsignedInt();
        }

        row = new AmigaRow();
        row.note   = (value >> 16) & 0x0fff;
        row.sample = (value >> 24) & 0xf0 | (value >> 12) & 0x0f;
        row.effect = (value >>  8) & 0x0f;
        row.param  = value & 0xff;

        if (row.sample > 31 || !samples[row.sample]) row.sample = 0;

        patterns[i] = row;
      }

      amiga.store(stream, size);

      for (i = 1; i < 32; ++i) {
        sample = samples[i];
        if (!sample || sample.name == "Mupp") continue;
        sample.pointer += mupp;

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

      sample = new HMSample();
      sample.pointer = sample.loopPtr = amiga.memory.length;
      sample.length  = sample.repeat  = 2;
      samples[0] = sample;
    }

    private function effects(voice:HMVoice):void {
      var chan:AmigaChannel = voice.channel, i:int, len:int, period:int = voice.period & 0x0fff, slide:int, value:int;

      if (voice.effect || voice.param) {
        switch (voice.effect) {
          case 0:   //arpeggio
            value = tick % 3;
            if (!value) break;
            if (value == 1) value = voice.param >> 4;
              else value = voice.param & 0x0f;

            len = 37 - value;

            for (i = 0; i < len; ++i) {
              if (period >= PERIODS[i]) {
                period = PERIODS[int(i + value)];
                break;
              }
            }
            break;
          case 1:   //portamento up
            voice.period -= voice.param;
            if (voice.period < 113) voice.period = 113;
            period = voice.period;
            break;
          case 2:   //portamento down
            voice.period += voice.param;
            if (voice.period > 856) voice.period = 856;
            period = voice.period;
            break;
          case 3:   //tone portamento
          case 5:   //tone portamento + volume slide
            if (voice.effect == 5) slide = 1;
            else if (voice.param) {
              voice.portaSpeed = voice.param;
              voice.param = 0;
            }

            if (voice.portaPeriod) {
              if (voice.portaDir) {
                voice.period -= voice.portaSpeed;
                if (voice.period < voice.portaPeriod) {
                  voice.period = voice.portaPeriod;
                  voice.portaPeriod = 0;
                }
              } else {
                voice.period += voice.portaSpeed;
                if (voice.period > voice.portaPeriod) {
                  voice.period = voice.portaPeriod;
                  voice.portaPeriod = 0;
                }
              }
            }
            period = voice.period;
            break;
          case 4:   //vibrato
          case 6:   //vibrato + volume slide;
            if (voice.effect == 6) slide = 1;
              else if (voice.param) voice.vibratoSpeed = voice.param;

            value = VIBRATO[int((voice.vibratoPos >> 2) & 31)];
            value = ((voice.vibratoSpeed & 0x0f) * value) >> 7;

            if (voice.vibratoPos > 127) period -= value;
              else period += value;

            value = (voice.vibratoSpeed >> 2) & 60;
            voice.vibratoPos = (voice.vibratoPos + value) & 255;
            break;
          case 7:   //mega arpeggio
            value = MEGARPEGGIO[int((voice.vibratoPos & 0x0f) + ((voice.param & 0x0f) << 4))];
            voice.vibratoPos++;
            for (i = 0; i < 37; ++i) if (period >= PERIODS[i]) break;

            value += i;
            if (value > 35) value -= 12;
            period = PERIODS[value];
            break;
          case 10:  //volume slide
            slide = 1;
            break;
        }
      }

      chan.period = period + ((period * voice.sample.finetune) >> 8);

      if (slide) {
        value = voice.param >> 4;

        if (value) voice.volume2 += value;
          else voice.volume2 -= voice.param & 0x0f;

        if (voice.volume2 > 64) voice.volume2 = 64;
          else if (voice.volume2 < 0) voice.volume2 = 0;
      }
    }

    private function handler(voice:HMVoice):void {
      var sample:HMSample;

      if (voice.handler) {
        sample = voice.sample;
        sample.loopPtr = sample.pointer + sample.waves[voice.wavePos];

        voice.volume1 = sample.volumes[voice.wavePos];

        if (++voice.wavePos > sample.waveLen)
          voice.wavePos = sample.restart;
      }
      voice.channel.volume = (voice.volume1 * voice.volume2) >> 6;
    }

    private const
      MEGARPEGGIO: Vector.<int> = Vector.<int>([
         0, 3, 7,12,15,12, 7, 3, 0, 3, 7,12,15,12, 7, 3,
         0, 4, 7,12,16,12, 7, 4, 0, 4, 7,12,16,12, 7, 4,
         0, 3, 8,12,15,12, 8, 3, 0, 3, 8,12,15,12, 8, 3,
         0, 4, 8,12,16,12, 8, 4, 0, 4, 8,12,16,12, 8, 4,
         0, 5, 8,12,17,12, 8, 5, 0, 5, 8,12,17,12, 8, 5,
         0, 5, 9,12,17,12, 9, 5, 0, 5, 9,12,17,12, 9, 5,
        12, 0, 7, 0, 3, 0, 7, 0,12, 0, 7, 0, 3, 0, 7, 0,
        12, 0, 7, 0, 4, 0, 7, 0,12, 0, 7, 0, 4, 0, 7, 0,
         0, 3, 7, 3, 7,12, 7,12,15,12, 7,12, 7, 3, 7, 3,
         0, 4, 7, 4, 7,12, 7,12,16,12, 7,12, 7, 4, 7, 4,
        31,27,24,19,15,12, 7, 3, 0, 3, 7,12,15,19,24,27,
        31,28,24,19,16,12, 7, 4, 0, 4, 7,12,16,19,24,28,
         0,12, 0,12, 0,12, 0,12, 0,12, 0,12, 0,12, 0,12,
         0,12,24,12, 0,12,24,12, 0,12,24,12, 0,12,24,12,
         0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3,
         0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4]),

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