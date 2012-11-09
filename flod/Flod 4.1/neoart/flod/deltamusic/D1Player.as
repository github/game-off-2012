/*
  Flod 4.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod 3.0 - 2012/02/08

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

  public final class D1Player extends AmigaPlayer {
    private var
      pointers : Vector.<int>,
      tracks   : Vector.<AmigaStep>,
      patterns : Vector.<AmigaRow>,
      samples  : Vector.<D1Sample>,
      voices   : Vector.<D1Voice>;

    public function D1Player(amiga:Amiga = null) {
      super(amiga);
      PERIODS.fixed = true;

      samples = new Vector.<D1Sample>(21, true);
      voices  = new Vector.<D1Voice>(4, true);

      voices[0] = new D1Voice(0);
      voices[0].next = voices[1] = new D1Voice(1);
      voices[1].next = voices[2] = new D1Voice(2);
      voices[2].next = voices[3] = new D1Voice(3);
    }

    override public function process():void {
      var adsr:int, chan:AmigaChannel, loop:int, row:AmigaRow, sample:D1Sample, value:int, voice:D1Voice = voices[0];

      while (voice) {
        chan = voice.channel;

        if (--voice.speed == 0) {
          voice.speed = speed;

          if (voice.patternPos == 0) {
            voice.step = tracks[int(pointers[voice.index] + voice.trackPos)];

            if (voice.step.pattern < 0) {
              voice.trackPos = voice.step.transpose;
              voice.step = tracks[int(pointers[voice.index] + voice.trackPos)];
            }
            voice.trackPos++;
          }

          row = patterns[int(voice.step.pattern + voice.patternPos)];
          if (row.effect) voice.row = row;

          if (row.note) {
            chan.enabled = 0;
            voice.row = row;
            voice.note = row.note + voice.step.transpose;
            voice.arpeggioPos = voice.pitchBend = voice.status = 0;

            sample = voice.sample = samples[row.sample];
            if (!sample.synth) chan.pointer = sample.pointer;
            chan.length = sample.length;

            voice.tableCtr   = voice.tablePos = 0;
            voice.vibratoCtr = sample.vibratoWait;
            voice.vibratoPos = sample.vibratoLen;
            voice.vibratoDir = sample.vibratoLen << 1;
            voice.volume     = voice.attackCtr = voice.decayCtr = voice.releaseCtr = 0;
            voice.sustain    = sample.sustain;
          }
          if (++voice.patternPos == 16) voice.patternPos = 0;
        }
        sample = voice.sample;

        if (sample.synth) {
          if (voice.tableCtr == 0) {
            voice.tableCtr = sample.tableDelay;

            do {
              loop = 1;
              if (voice.tablePos >= 48) voice.tablePos = 0;
              value = sample.table[voice.tablePos];
              voice.tablePos++;

              if (value >= 0) {
                chan.pointer = sample.pointer + (value << 5);
                loop = 0;
              } else if (value != -1) {
                sample.tableDelay = value & 127;
              } else {
                voice.tablePos = sample.table[voice.tablePos];
              }
            } while (loop);
          } else
            voice.tableCtr--;
        }

        if (sample.portamento) {
          value = PERIODS[voice.note] + voice.pitchBend;

          if (voice.period != 0) {
            if (voice.period < value) {
              voice.period += sample.portamento;
              if (voice.period > value) voice.period = value;
            } else {
              voice.period -= sample.portamento;
              if (voice.period < value) voice.period = value;
            }
          } else
            voice.period = value;
        }

        if (voice.vibratoCtr == 0) {
          voice.vibratoPeriod = voice.vibratoPos * sample.vibratoStep;

          if ((voice.status & 1) == 0) {
            voice.vibratoPos++;
            if (voice.vibratoPos == voice.vibratoDir) voice.status ^= 1;
          } else {
            voice.vibratoPos--;
            if (voice.vibratoPos == 0) voice.status ^= 1;
          }
        } else {
          voice.vibratoCtr--;
        }

        if (sample.pitchBend < 0) voice.pitchBend += sample.pitchBend;
          else voice.pitchBend -= sample.pitchBend;

        if (voice.row) {
          row = voice.row;

          switch (row.effect) {
            case 0:
              break;
            case 1:
              value = row.param & 15;
              if (value) speed = value;
              break;
            case 2:
              voice.pitchBend -= row.param;
              break;
            case 3:
              voice.pitchBend += row.param;
              break;
            case 4:
              amiga.filter.active = row.param;
              break;
            case 5:
              sample.vibratoWait = row.param;
              break;
            case 6:
              sample.vibratoStep = row.param;
            case 7:
              sample.vibratoLen = row.param;
              break;
            case 8:
              sample.pitchBend = row.param;
              break;
            case 9:
              sample.portamento = row.param;
              break;
            case 10:
              value = row.param;
              if (value > 64) value = 64;
              sample.volume = 64;
              break;
            case 11:
              sample.arpeggio[0] = row.param;
              break;
            case 12:
              sample.arpeggio[1] = row.param;
              break;
            case 13:
              sample.arpeggio[2] = row.param;
              break;
            case 14:
              sample.arpeggio[3] = row.param;
              break;
            case 15:
              sample.arpeggio[4] = row.param;
              break;
            case 16:
              sample.arpeggio[5] = row.param;
              break;
            case 17:
              sample.arpeggio[6] = row.param;
              break;
            case 18:
              sample.arpeggio[7] = row.param;
              break;
            case 19:
              sample.arpeggio[0] = sample.arpeggio[4] = row.param;
              break;
            case 20:
              sample.arpeggio[1] = sample.arpeggio[5] = row.param;
              break;
            case 21:
              sample.arpeggio[2] = sample.arpeggio[6] = row.param;
              break;
            case 22:
              sample.arpeggio[3] = sample.arpeggio[7] = row.param;
              break;
            case 23:
              value = row.param;
              if (value > 64) value = 64;
              sample.attackStep = value;
              break;
            case 24:
              sample.attackDelay = row.param;
              break;
            case 25:
              value = row.param;
              if (value > 64) value = 64;
              sample.decayStep = value;
              break;
            case 26:
              sample.decayDelay = row.param;
              break;
            case 27:
              sample.sustain = row.param & (sample.sustain & 255);
              break;
            case 28:
              sample.sustain = (sample.sustain & 65280) + row.param;
              break;
            case 29:
              value = row.param;
              if (value > 64) value = 64;
              sample.releaseStep = value;
              break;
            case 30:
              sample.releaseDelay = row.param;
              break;
          }
        }

        if (sample.portamento)
          value = voice.period;
        else {
          value = PERIODS[int(voice.note + sample.arpeggio[voice.arpeggioPos])];
          voice.arpeggioPos = ++voice.arpeggioPos & 7;
          value -= (sample.vibratoLen * sample.vibratoStep);
          value += voice.pitchBend;
          voice.period = 0;
        }

        chan.period = value + voice.vibratoPeriod;
        adsr  = voice.status & 14;
        value = voice.volume;

        if (adsr == 0) {
          if (voice.attackCtr == 0) {
            voice.attackCtr = sample.attackDelay;
            value += sample.attackStep;

            if (value >= 64) {
              adsr |= 2;
              voice.status |= 2;
              value = 64;
            }
          } else {
            voice.attackCtr--;
          }
        }

        if (adsr == 2) {
          if (voice.decayCtr == 0) {
            voice.decayCtr = sample.decayDelay;
            value -= sample.decayStep;

            if (value <= sample.volume) {
              adsr |= 6;
              voice.status |= 6;
              value = sample.volume;
            }
          } else {
            voice.decayCtr--;
          }
        }

        if (adsr == 6) {
          if (voice.sustain == 0) {
            adsr |= 14;
            voice.status |= 14;
          } else {
            voice.sustain--;
          }
        }

        if (adsr == 14) {
          if (voice.releaseCtr == 0) {
            voice.releaseCtr = sample.releaseDelay;
            value -= sample.releaseStep;

            if (value < 0) {
              voice.status &= 9;
              value = 0;
            }
          } else {
            voice.releaseCtr--;
          }
        }

        chan.volume  = voice.volume = value;
        chan.enabled = 1;

        if (!sample.synth) {
          if (sample.loop) {
            chan.pointer = sample.loopPtr;
            chan.length  = sample.repeat;
          } else {
            chan.pointer = amiga.loopPtr;
            chan.length  = 2;
          }
        }
        voice = voice.next;
      }
    }

    override protected function initialize():void {
      var voice:D1Voice = voices[0];
      super.initialize();

      speed = 6;

      while (voice) {
        voice.initialize();
        voice.channel = amiga.channels[voice.index];
        voice.sample  = samples[20];
        voice = voice.next;
      }
    }

    override protected function loader(stream:ByteArray):void {
      var data:Vector.<int>, i:int, id:String, index:int, j:int, len:int, position:int, row:AmigaRow, sample:D1Sample, step:AmigaStep, value:int;
      id = stream.readMultiByte(4, ENCODING);
      if (id != "ALL ") return;

      position = 104;
      data = new Vector.<int>(25 ,true);
      for (i = 0; i < 25; ++i) data[i] = stream.readUnsignedInt();

      pointers = new Vector.<int>(4, true);
      for (i = 1; i < 4; ++i)
        pointers[i] = pointers[j] + (data[j++] >> 1) - 1;

      len = pointers[3] + (data[3] >> 1) - 1;
      tracks = new Vector.<AmigaStep>(len, true);
      index = position + data[1] - 2;
      stream.position = position;
      j = 1;

      for (i = 0; i < len; ++i) {
        step  = new AmigaStep();
        value = stream.readUnsignedShort();

        if (value == 0xffff || stream.position == index) {
          step.pattern   = -1;
          step.transpose = stream.readUnsignedShort();
          index += data[j++];
        } else {
          stream.position--;
          step.pattern   = ((value >> 2) & 0x3fc0) >> 2;
          step.transpose = stream.readByte();
        }
        tracks[i] = step;
      }

      len = data[4] >> 2;
      patterns = new Vector.<AmigaRow>(len, true);

      for (i = 0; i < len; ++i) {
        row = new AmigaRow();
        row.sample = stream.readUnsignedByte();
        row.note   = stream.readUnsignedByte();
        row.effect = stream.readUnsignedByte() & 31;
        row.param  = stream.readUnsignedByte();
        patterns[i] = row;
      }

      index = 5;

      for (i = 0; i < 20; ++i) {
        samples[i] = null;

        if (data[index] != 0) {
          sample = new D1Sample();
          sample.attackStep   = stream.readUnsignedByte();
          sample.attackDelay  = stream.readUnsignedByte();
          sample.decayStep    = stream.readUnsignedByte();
          sample.decayDelay   = stream.readUnsignedByte();
          sample.sustain      = stream.readUnsignedShort();
          sample.releaseStep  = stream.readUnsignedByte();
          sample.releaseDelay = stream.readUnsignedByte();
          sample.volume       = stream.readUnsignedByte();
          sample.vibratoWait  = stream.readUnsignedByte();
          sample.vibratoStep  = stream.readUnsignedByte();
          sample.vibratoLen   = stream.readUnsignedByte();
          sample.pitchBend    = stream.readByte();
          sample.portamento   = stream.readUnsignedByte();
          sample.synth        = stream.readUnsignedByte();
          sample.tableDelay   = stream.readUnsignedByte();

          for (j = 0; j < 8; ++j)
            sample.arpeggio[j] = stream.readByte();

          sample.length = stream.readUnsignedShort();
          sample.loop   = stream.readUnsignedShort();
          sample.repeat = stream.readUnsignedShort() << 1;
          sample.synth  = sample.synth ? 0 : 1;

          if (sample.synth) {
            for (j = 0; j < 48; ++j)
              sample.table[j] = stream.readByte();

            len = data[index] - 78;
          } else {
            len = sample.length;
          }

          sample.pointer = amiga.store(stream, len);
          sample.loopPtr = sample.pointer + sample.loop;
          samples[i] = sample;
        }
        index++;
      }

      sample = new D1Sample();
      sample.pointer = sample.loopPtr = amiga.memory.length;
      sample.length  = sample.repeat  = 2;
      samples[20] = sample;
      version = 1;
    }

    private const
      PERIODS:Vector.<int> = Vector.<int>([
        0000,6848,6464,6096,5760,5424,5120,4832,4560,4304,4064,3840,
        3616,3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,1920,
        1808,1712,1616,1524,1440,1356,1280,1208,1140,1076,0960,0904,
        0856,0808,0762,0720,0678,0640,0604,0570,0538,0508,0480,0452,
        0428,0404,0381,0360,0339,0320,0302,0285,0269,0254,0240,0226,
        0214,0202,0190,0180,0170,0160,0151,0143,0135,0127,0120,0113,
        0113,0113,0113,0113,0113,0113,0113,0113,0113,0113,0113,0113]);
  }
}