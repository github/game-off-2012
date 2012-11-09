/*
  Flod 4.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod 4.0 - 2012/03/30

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
package neoart.flod.deltamusic {
  import flash.utils.*;
  import neoart.flod.core.*;

  public final class D2Player extends AmigaPlayer {
    private var
      tracks    : Vector.<AmigaStep>,
      patterns  : Vector.<AmigaRow>,
      samples   : Vector.<D2Sample>,
      data      : Vector.<int>,
      arpeggios : Vector.<int>,
      voices    : Vector.<D2Voice>,
      noise     : uint;

    public function D2Player(amiga:Amiga = null) {
      super(amiga);
      PERIODS.fixed = true;

      arpeggios = new Vector.<int>(1024, true);
      voices    = new Vector.<D2Voice>(4, true);

      voices[0] = new D2Voice(0);
      voices[0].next = voices[1] = new D2Voice(1);
      voices[1].next = voices[2] = new D2Voice(2);
      voices[2].next = voices[3] = new D2Voice(3);
    }

    override public function process():void {
      var chan:AmigaChannel, i:int = 0, level:int, row:AmigaRow, sample:D2Sample, value:int, voice:D2Voice = voices[0];

      for (; i < 64;) {
        this.noise = (this.noise << 7) | (this.noise >>> 25);
        this.noise += 0x6eca756d;
        this.noise ^= 0x9e59a92b;

        value = (this.noise >>> 24) & 255;
        if (value > 127) value |= -256;
        amiga.memory[i++] = value;

        value = (this.noise >>> 16) & 255;
        if (value > 127) value |= -256;
        amiga.memory[i++] = value;

        value = (this.noise >>> 8) & 255;
        if (value > 127) value |= -256;
        amiga.memory[i++] = value;

        value = this.noise & 255;
        if (value > 127) value |= -256;
        amiga.memory[i++] = value;
      }

      if (--this.tick < 0) this.tick = this.speed;

      while (voice) {
        if (voice.trackLen < 1) {
          voice = voice.next;
          continue;
        }

        chan = voice.channel;
        sample = voice.sample;

        if (sample.synth) {
          chan.pointer = sample.loopPtr;
          chan.length  = sample.repeat;
        }

        if (this.tick == 0) {
          if (voice.patternPos == 0) {
            voice.step = tracks[int(voice.trackPtr + voice.trackPos)];

            if (++voice.trackPos == voice.trackLen)
              voice.trackPos = voice.restart;
          }
          row = voice.row = patterns[int(voice.step.pattern + voice.patternPos)];

          if (row.note) {
            chan.enabled = 0;
            voice.note = row.note;
            voice.period = PERIODS[int(row.note + voice.step.transpose)];

            sample = voice.sample = samples[row.sample];

            if (sample.synth < 0) {
              chan.pointer = sample.pointer;
              chan.length  = sample.length;
            }

            voice.arpeggioPos    = 0;
            voice.tableCtr       = 0;
            voice.tablePos       = 0;
            voice.vibratoCtr     = sample.vibratos[1];
            voice.vibratoPos     = 0;
            voice.vibratoDir     = 0;
            voice.vibratoPeriod  = 0;
            voice.vibratoSustain = sample.vibratos[2];
            voice.volume         = 0;
            voice.volumePos      = 0;
            voice.volumeSustain  = 0;
          }

          switch (row.effect) {
            case -1:
              break;
            case 0:
              speed = row.param & 15;
              break;
            case 1:
              amiga.filter.active = row.param;
              break;
            case 2:
              voice.pitchBend = ~(row.param & 255) + 1;
              break;
            case 3:
              voice.pitchBend = row.param & 255;
              break;
            case 4:
              voice.portamento = row.param;
              break;
            case 5:
              voice.volumeMax = row.param & 63;
              break;
            case 6:
              amiga.volume = row.param;
              break;
            case 7:
              voice.arpeggioPtr = (row.param & 63) << 4;
              break;
          }
          voice.patternPos = ++voice.patternPos & 15;
        }
        sample = voice.sample;

        if (sample.synth >= 0) {
          if (voice.tableCtr) {
            voice.tableCtr--;
          } else {
            voice.tableCtr = sample.index;
            value = sample.table[voice.tablePos];

            if (value == 0xff) {
              value = sample.table[++voice.tablePos];
              if (value != 0xff) {
                voice.tablePos = value;
                value = sample.table[voice.tablePos];
              }
            }

            if (value != 0xff) {
              chan.pointer = value << 8;
              chan.length  = sample.length;
              if (++voice.tablePos > 47) voice.tablePos = 0;
            }
          }
        }
        value = sample.vibratos[voice.vibratoPos];

        if (voice.vibratoDir) voice.vibratoPeriod -= value;
          else voice.vibratoPeriod += value;

        if (--voice.vibratoCtr == 0) {
          voice.vibratoCtr = sample.vibratos[int(voice.vibratoPos + 1)];
          voice.vibratoDir = ~voice.vibratoDir;
        }

        if (voice.vibratoSustain) {
          voice.vibratoSustain--;
        } else {
          voice.vibratoPos += 3;
          if (voice.vibratoPos == 15) voice.vibratoPos = 12;
          voice.vibratoSustain = sample.vibratos[int(voice.vibratoPos + 2)];
        }

        if (voice.volumeSustain) {
          voice.volumeSustain--;
        } else {
          value = sample.volumes[voice.volumePos];
          level = sample.volumes[int(voice.volumePos + 1)];

          if (level < voice.volume) {
            voice.volume -= value;
            if (voice.volume < level) {
              voice.volume = level;
              voice.volumePos += 3;
              voice.volumeSustain = sample.volumes[int(voice.volumePos - 1)];
            }
          } else {
            voice.volume += value;
            if (voice.volume > level) {
              voice.volume = level;
              voice.volumePos += 3;
              if (voice.volumePos == 15) voice.volumePos = 12;
              voice.volumeSustain = sample.volumes[int(voice.volumePos - 1)];
            }
          }
        }

        if (voice.portamento) {
          if (voice.period < voice.finalPeriod) {
            voice.finalPeriod -= voice.portamento;
            if (voice.finalPeriod < voice.period) voice.finalPeriod = voice.period;
          } else {
            voice.finalPeriod += voice.portamento;
            if (voice.finalPeriod > voice.period) voice.finalPeriod = voice.period;
          }
        }
        value = arpeggios[int(voice.arpeggioPtr + voice.arpeggioPos)];

        if (value == -128) {
          voice.arpeggioPos = 0;
          value = arpeggios[voice.arpeggioPtr]
        }
        voice.arpeggioPos = ++voice.arpeggioPos & 15;

        if (voice.portamento == 0) {
          value = voice.note + voice.step.transpose + value;
          if (value < 0) value = 0;
          voice.finalPeriod = PERIODS[value];
        }

        voice.vibratoPeriod -= (sample.pitchBend - voice.pitchBend);
        chan.period = voice.finalPeriod + voice.vibratoPeriod;

        value = (voice.volume >> 2) & 63;
        if (value > voice.volumeMax) value = voice.volumeMax;
        chan.volume  = value;
        chan.enabled = 1;

        voice = voice.next;
      }
    }

    override protected function initialize():void {
      var voice:D2Voice = voices[0];
      super.initialize();

      speed = 5;
      tick  = 1;
      noise = 0;

      while (voice) {
        voice.initialize();
        voice.channel  = amiga.channels[voice.index];
        voice.sample   = samples[int(samples.length - 1)];

        voice.trackPtr = data[voice.index];
        voice.restart  = data[int(voice.index + 4)];
        voice.trackLen = data[int(voice.index + 8)];

        voice = voice.next;
      }
    }

    override protected function loader(stream:ByteArray):void {
      var i:int, id:String, j:int, len:int, offsets:Vector.<int>, position:int, row:AmigaRow, sample:D2Sample, step:AmigaStep, value:int;
      stream.position = 3014;
      id = stream.readMultiByte(4, ENCODING);
      if (id != ".FNL") return;

      stream.position = 4042;
      data = new Vector.<int>(12, true);

      for (i = 0; i < 4; ++i) {
        data[int(i + 4)] = stream.readUnsignedShort() >> 1;
        value = stream.readUnsignedShort() >> 1;
        data[int(i + 8)] = value;
        len += value;
      }

      value = len;
      for (i = 3; i > 0; --i) data[i] = (value -= data[int(i + 8)]);
      tracks = new Vector.<AmigaStep>(len, true);

      for (i = 0; i < len; ++i) {
        step = new AmigaStep();
        step.pattern   = stream.readUnsignedByte() << 4;
        step.transpose = stream.readByte();
        tracks[i] = step;
      }

      len = stream.readUnsignedInt() >> 2;
      patterns = new Vector.<AmigaRow>(len, true);

      for (i = 0; i < len; ++i) {
        row = new AmigaRow();
        row.note   = stream.readUnsignedByte();
        row.sample = stream.readUnsignedByte();
        row.effect = stream.readUnsignedByte() - 1;
        row.param  = stream.readUnsignedByte();
        patterns[i] = row;
      }

      stream.position += 254;
      value = stream.readUnsignedShort();
      position = stream.position;
      stream.position -= 256;

      len = 1;
      offsets = new Vector.<int>(128, true);

      for (i = 0; i < 128; ++i) {
        j = stream.readUnsignedShort();
        if (j != value) offsets[len++] = j;
      }

      samples = new Vector.<D2Sample>(len);

      for (i = 0; i < len; ++i) {
        stream.position = position + offsets[i];
        sample = new D2Sample();
        sample.length = stream.readUnsignedShort() << 1;
        sample.loop   = stream.readUnsignedShort();
        sample.repeat = stream.readUnsignedShort() << 1;

        for (j = 0; j < 15; ++j)
          sample.volumes[j] = stream.readUnsignedByte();
        for (j = 0; j < 15; ++j)
          sample.vibratos[j] = stream.readUnsignedByte();

        sample.pitchBend = stream.readUnsignedShort();
        sample.synth     = stream.readByte();
        sample.index     = stream.readUnsignedByte();

        for (j = 0; j < 48; ++j)
          sample.table[j] = stream.readUnsignedByte();

        samples[i] = sample;
      }

      len = stream.readUnsignedInt();
      amiga.store(stream, len);

      stream.position += 64;
      for (i = 0; i < 8; ++i)
        offsets[i] = stream.readUnsignedInt();

      len = samples.length;
      position = stream.position;

      for (i = 0; i < len; ++i) {
        sample = samples[i];
        if (sample.synth >= 0) continue;
        stream.position = position + offsets[sample.index];
        sample.pointer = amiga.store(stream, sample.length);
        sample.loopPtr = sample.pointer + sample.loop;
      }

      stream.position = 3018;
      for (i = 0; i < 1024; ++i)
        arpeggios[i] = stream.readByte();

      sample = new D2Sample();
      sample.pointer = sample.loopPtr = amiga.memory.length;
      sample.length  = sample.repeat  = 2;

      samples[len] = sample;
      samples.fixed = true;

      len = patterns.length;
      j = samples.length - 1;

      for (i = 0; i < len; ++i) {
        row = patterns[i];
        if (row.sample > j) row.sample = 0;
      }

      version = 2;
    }

    private const
      PERIODS: Vector.<int> = Vector.<int>([
           0,6848,6464,6096,5760,5424,5120,4832,4560,4304,4064,3840,
        3616,3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,1920,
        1808,1712,1616,1524,1440,1356,1280,1208,1140,1076,1016, 960,
         904, 856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480,
         452, 428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240,
         226, 214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120,
         113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113,
         113]);
  }
}