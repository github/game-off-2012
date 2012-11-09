/*
  Flod 4.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod 4.0 - 2012/03/11

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
package neoart.flod.soundmon {
  import flash.utils.*;
  import neoart.flod.core.*;

  public final class BPPlayer extends AmigaPlayer {
    private var
      tracks      : Vector.<BPStep>,
      patterns    : Vector.<AmigaRow>,
      samples     : Vector.<BPSample>,
      length      : int,
      buffer      : Vector.<int>,
      voices      : Vector.<BPVoice>,
      trackPos    : int,
      patternPos  : int,
      nextPos     : int,
      jumpFlag    : int,
      repeatCtr   : int,
      arpeggioCtr : int,
      vibratoPos  : int;

    public function BPPlayer(amiga:Amiga = null) {
      super(amiga);
      PERIODS.fixed = true;
      VIBRATO.fixed = true;

      buffer  = new Vector.<int>(128, true);
      samples = new Vector.<BPSample>(16, true);
      voices  = new Vector.<BPVoice>(4, true);

      voices[0] = new BPVoice(0);
      voices[0].next = voices[1] = new BPVoice(1);
      voices[1].next = voices[2] = new BPVoice(2);
      voices[2].next = voices[3] = new BPVoice(3);
    }

    override public function process():void {
      var chan:AmigaChannel, data:int, dst:int, instr:int, len:int, memory:Vector.<int> = amiga.memory, note:int, option:int, row:AmigaRow, sample:BPSample, src:int, step:BPStep, voice:BPVoice = voices[0];
      arpeggioCtr = --arpeggioCtr & 3;
      vibratoPos  = ++vibratoPos  & 7;

      while (voice) {
        chan = voice.channel;
        voice.period += voice.autoSlide;

        if (voice.vibrato) chan.period = voice.period + (VIBRATO[vibratoPos] / voice.vibrato);
          else chan.period = voice.period;

        chan.pointer = voice.samplePtr;
        chan.length  = voice.sampleLen;

        if (voice.arpeggio || voice.autoArpeggio) {
          note = voice.note;

          if (!arpeggioCtr)
            note += ((voice.arpeggio & 0xf0) >> 4) + ((voice.autoArpeggio & 0xf0) >> 4);
          else if (arpeggioCtr == 1)
            note += (voice.arpeggio & 0x0f) + (voice.autoArpeggio & 0x0f);

          chan.period = voice.period = PERIODS[int(note + 35)];
          voice.restart = 0;
        }

        if (!voice.synth || voice.sample < 0) {
          voice = voice.next;
          continue;
        }
        sample = samples[voice.sample];

        if (voice.adsrControl) {
          if (--voice.adsrCtr == 0) {
            voice.adsrCtr = sample.adsrSpeed;
            data = (128 + memory[int(sample.adsrTable + voice.adsrPtr)]) >> 2;
            chan.volume = (data * voice.volume) >> 6;

            if (++voice.adsrPtr == sample.adsrLen) {
              voice.adsrPtr = 0;
              if (voice.adsrControl == 1) voice.adsrControl = 0;
            }
          }
        }

        if (voice.lfoControl) {
          if (--voice.lfoCtr == 0) {
            voice.lfoCtr = sample.lfoSpeed;
            data = memory[int(sample.lfoTable + voice.lfoPtr)];
            if (sample.lfoDepth) data = (data / sample.lfoDepth) >> 0;
            chan.period = voice.period + data;

            if (++voice.lfoPtr == sample.lfoLen) {
              voice.lfoPtr = 0;
              if (voice.lfoControl == 1) voice.lfoControl = 0;
            }
          }
        }

        if (voice.synthPtr < 0) {
          voice = voice.next;
          continue;
        }

        if (voice.egControl) {
          if (--voice.egCtr == 0) {
            voice.egCtr = sample.egSpeed;
            data = voice.egValue;
            voice.egValue = (128 + memory[int(sample.egTable + voice.egPtr)]) >> 3;

            if (voice.egValue != data) {
              src = (voice.index << 5) + data;
              dst = voice.synthPtr + data;

              if (voice.egValue < data) {
                data -= voice.egValue;
                len = dst - data;
                for (; dst > len;) memory[--dst] = buffer[--src];
              } else {
                data = voice.egValue - data;
                len = dst + data;
                for (; dst < len;) memory[dst++] = ~buffer[src++] + 1
              }
            }

            if (++voice.egPtr == sample.egLen) {
              voice.egPtr = 0;
              if (voice.egControl == 1) voice.egControl = 0;
            }
          }
        }

        switch (voice.fxControl) {
          case 0:
            break;
          case 1:   //averaging
            if (--voice.fxCtr == 0) {
              voice.fxCtr = sample.fxSpeed;
              dst = voice.synthPtr;
              len = voice.synthPtr + 32;
              data = dst > 0 ? memory[int(dst - 1)] : 0;

              for (; dst < len;) {
                data = (data + memory[int(dst + 1)]) >> 1;
                memory[dst++] = data;
              }
            }
            break;
          case 2:   //inversion
            src = (voice.index << 5) + 31;
            len = voice.synthPtr + 32;
            data = sample.fxSpeed;

            for (dst = voice.synthPtr; dst < len; ++dst) {
              if (buffer[src] < memory[dst]) {
                memory[dst] -= data;
              } else if (buffer[src] > memory[dst]) {
                memory[dst] += data;
              }
              src--;
            }
            break;
          case 3:   //backward inversion
          case 5:   //backward transform
            src = voice.index << 5;
            len = voice.synthPtr + 32;
            data = sample.fxSpeed;

            for (dst = voice.synthPtr; dst < len; ++dst) {
              if (buffer[src] < memory[dst]) {
                memory[dst] -= data;
              } else if (buffer[src] > memory[dst]) {
                memory[dst] += data;
              }
              src++;
            }
            break;
          case 4:   //transform
            src = voice.synthPtr + 64;
            len = voice.synthPtr + 32;
            data = sample.fxSpeed;

            for (dst = voice.synthPtr; dst < len; ++dst) {
              if (memory[src] < memory[dst]) {
                memory[dst] -= data;
              } else if (memory[src] > memory[dst]) {
                memory[dst] += data;
              }
              src++;
            }
            break;
          case 6:   //wave change
            if (--voice.fxCtr == 0) {
              voice.fxControl = 0;
              voice.fxCtr = 1;
              src = voice.synthPtr + 64;
              len = voice.synthPtr + 32;
              for (dst = voice.synthPtr; dst < len; ++dst) memory[dst] = memory[src++];
            }
            break;
        }

        if (voice.modControl) {
          if (--voice.modCtr == 0) {
            voice.modCtr = sample.modSpeed;
            memory[voice.synthPtr + 32] = memory[int(sample.modTable + voice.modPtr)];

            if (++voice.modPtr == sample.modLen) {
              voice.modPtr = 0;
              if (voice.modControl == 1) voice.modControl = 0;
            }
          }
        }
        voice = voice.next;
      }

      if (--tick == 0) {
        tick = speed;
        voice = voices[0];

        while (voice) {
          chan = voice.channel;
          voice.enabled = 0;

          step   = tracks[int((trackPos << 2) + voice.index)];
          row    = patterns[int(patternPos + ((step.pattern - 1) << 4))];
          note   = row.note;
          option = row.effect;
          data   = row.param;

          if (note) {
            voice.autoArpeggio = voice.autoSlide = voice.vibrato = 0;
            if (option != 10 || (data & 0xf0) == 0) note += step.transpose;
            voice.note = note;
            voice.period = PERIODS[int(note + 35)];

            if (option < 13) voice.restart = voice.volumeDef = 1;
              else voice.restart = 0;

            instr = row.sample;
            if (instr == 0) instr = voice.sample;
            if (option != 10 || (data & 0x0f) == 0) instr += step.soundTranspose;

            if (option < 13 && (!voice.synth || (voice.sample != instr))) {
              voice.sample = instr;
              voice.enabled = 1;
            }
          }

          switch (option) {
            case 0:   //arpeggio once
              voice.arpeggio = data;
              break;
            case 1:   //set volume
              voice.volume = data;
              voice.volumeDef = 0;

              if (version < BPSOUNDMON_V3 || !voice.synth)
                chan.volume = voice.volume;
              break;
            case 2:   //set speed
              tick = speed = data;
              break;
            case 3:   //set filter
              amiga.filter.active = data;
              break;
            case 4:   //portamento up
              voice.period -= data;
              voice.arpeggio = 0;
              break;
            case 5:   //portamento down
              voice.period += data;
              voice.arpeggio = 0;
              break;
            case 6:   //set vibrato
              if (version == BPSOUNDMON_V3) voice.vibrato = data;
                else repeatCtr = data;
              break;
            case 7:   //step jump
              if (version == BPSOUNDMON_V3) {
                nextPos = data;
                jumpFlag = 1;
              } else if (repeatCtr == 0) {
                trackPos = data;
              }
              break;
            case 8:   //set auto slide
              voice.autoSlide = data;
              break;
            case 9:   //set auto arpeggio
              voice.autoArpeggio = data;
              if (version == BPSOUNDMON_V3) {
                voice.adsrPtr = 0;
                if (voice.adsrControl == 0) voice.adsrControl = 1;
              }
              break;
            case 11:  //change effect
              voice.fxControl = data;
              break;
            case 13:  //change inversion
              voice.autoArpeggio = data;
              voice.fxControl ^= 1;
              voice.adsrPtr = 0;
              if (voice.adsrControl == 0) voice.adsrControl = 1;
              break;
            case 14:  //no eg reset
              voice.autoArpeggio = data;
              voice.adsrPtr = 0;
              if (voice.adsrControl == 0) voice.adsrControl = 1;
              break;
            case 15:  //no eg and no adsr reset
              voice.autoArpeggio = data;
              break;
          }
          voice = voice.next;
        }

        if (jumpFlag) {
          trackPos   = nextPos;
          patternPos = jumpFlag = 0;
        } else if (++patternPos == 16) {
          patternPos = 0;

          if (++trackPos == length) {
            trackPos = 0;
            amiga.complete = 1;
          }
        }
        voice = voices[0];

        while (voice) {
          chan = voice.channel;
          if (voice.enabled) chan.enabled = voice.enabled = 0;
          if (voice.restart == 0) {
            voice = voice.next;
            continue;
          }

          if (voice.synthPtr > -1) {
            src = voice.index << 5;
            len = voice.synthPtr + 32;
            for (dst = voice.synthPtr; dst < len; ++dst) memory[dst] = buffer[src++];
            voice.synthPtr = -1;
          }
          voice = voice.next;
        }
        voice = voices[0];

        while (voice) {
          if (voice.restart == 0 || voice.sample < 0) {
            voice = voice.next;
            continue;
          }
          chan = voice.channel;

          chan.period = voice.period;
          voice.restart = 0;
          sample = samples[voice.sample];

          if (sample.synth) {
            voice.synth   = 1;
            voice.egValue = 0;
            voice.adsrPtr = voice.lfoPtr = voice.egPtr = voice.modPtr = 0;

            voice.adsrCtr = 1;
            voice.lfoCtr  = sample.lfoDelay + 1;
            voice.egCtr   = sample.egDelay  + 1;
            voice.fxCtr   = sample.fxDelay  + 1;
            voice.modCtr  = sample.modDelay + 1;

            voice.adsrControl = sample.adsrControl;
            voice.lfoControl  = sample.lfoControl;
            voice.egControl   = sample.egControl;
            voice.fxControl   = sample.fxControl;
            voice.modControl  = sample.modControl;

            chan.pointer = voice.samplePtr = sample.pointer;
            chan.length  = voice.sampleLen = sample.length;

            if (voice.adsrControl) {
              data = (128 + memory[sample.adsrTable]) >> 2;

              if (voice.volumeDef) {
                voice.volume = sample.volume;
                voice.volumeDef = 0;
              }

              chan.volume = (data * voice.volume) >> 6;
            } else {
              chan.volume = voice.volumeDef ? sample.volume : voice.volume;
            }

            if (voice.egControl || voice.fxControl || voice.modControl) {
              voice.synthPtr = sample.pointer;
              dst = voice.index << 5;
              len = voice.synthPtr + 32;
              for (src = voice.synthPtr; src < len; ++src) buffer[dst++] = memory[src];
            }
          } else {
            voice.synth = voice.lfoControl = 0;

            if (sample.pointer < 0) {
              voice.samplePtr = amiga.loopPtr;
              voice.sampleLen = 2;
            } else {
              chan.pointer = sample.pointer;
              chan.volume  = voice.volumeDef ? sample.volume : voice.volume;

              if (sample.repeat != 2) {
                voice.samplePtr = sample.loopPtr;
                chan.length = voice.sampleLen = sample.repeat;
              } else {
                voice.samplePtr = amiga.loopPtr;
                voice.sampleLen = 2;
                chan.length = sample.length;
              }
            }
          }
          chan.enabled = voice.enabled = 1;
          voice = voice.next;
        }
      }
    }

    override protected function initialize():void {
      var i:int, voice:BPVoice = voices[0];
      super.initialize();

      speed       = 6;
      tick        = 1;
      trackPos    = 0;
      patternPos  = 0;
      nextPos     = 0;
      jumpFlag    = 0;
      repeatCtr   = 0;
      arpeggioCtr = 1;
      vibratoPos  = 0;

      for (i = 0; i < 128; ++i) buffer[i] = 0;

      while (voice) {
        voice.initialize();
        voice.channel   = amiga.channels[voice.index];
        voice.samplePtr = amiga.loopPtr;
        voice = voice.next;
      }
    }

    override protected function reset():void {
      var i:int, len:int, pos:int, voice:BPVoice = voices[0];

      while (voice) {
        if (voice.synthPtr > -1) {
          pos = voice.index << 5;
          len = voice.synthPtr + 32;

          for (i = voice.synthPtr; i < len; ++i)
            amiga.memory[i] = buffer[pos++];
        }

        voice = voice.next;
      }
    }

    override protected function loader(stream:ByteArray):void {
      var higher:int, i:int = 0, id:String, len:int, row:AmigaRow, sample:BPSample, step:BPStep, tables:int;
      title = stream.readMultiByte(26, ENCODING);

      id = stream.readMultiByte(4, ENCODING);
      if (id == "BPSM") {
        version = BPSOUNDMON_V1;
      } else {
        id = id.substr(0, 3);
        if (id == "V.2") version = BPSOUNDMON_V2;
          else if (id == "V.3") version = BPSOUNDMON_V3;
            else return;

        stream.position = 29;
        tables = stream.readUnsignedByte();
      }

      length = stream.readUnsignedShort();

      for (; ++i < 16;) {
        sample = new BPSample();

        if (stream.readUnsignedByte() == 0xff) {
          sample.synth   = 1;
          sample.table   = stream.readUnsignedByte();
          sample.pointer = sample.table << 6;
          sample.length  = stream.readUnsignedShort() << 1;

          sample.adsrControl = stream.readUnsignedByte();
          sample.adsrTable   = stream.readUnsignedByte() << 6;
          sample.adsrLen     = stream.readUnsignedShort();
          sample.adsrSpeed   = stream.readUnsignedByte();
          sample.lfoControl  = stream.readUnsignedByte();
          sample.lfoTable    = stream.readUnsignedByte() << 6;
          sample.lfoDepth    = stream.readUnsignedByte();
          sample.lfoLen      = stream.readUnsignedShort();

          if (version < BPSOUNDMON_V3) {
            stream.readByte();
            sample.lfoDelay  = stream.readUnsignedByte();
            sample.lfoSpeed  = stream.readUnsignedByte();
            sample.egControl = stream.readUnsignedByte();
            sample.egTable   = stream.readUnsignedByte() << 6;
            stream.readByte();
            sample.egLen     = stream.readUnsignedShort();
            stream.readByte();
            sample.egDelay   = stream.readUnsignedByte();
            sample.egSpeed   = stream.readUnsignedByte();
            sample.fxSpeed   = 1;
            sample.modSpeed  = 1;
            sample.volume    = stream.readUnsignedByte();
            stream.position += 6;
          } else {
            sample.lfoDelay   = stream.readUnsignedByte();
            sample.lfoSpeed   = stream.readUnsignedByte();
            sample.egControl  = stream.readUnsignedByte();
            sample.egTable    = stream.readUnsignedByte() << 6;
            sample.egLen      = stream.readUnsignedShort();
            sample.egDelay    = stream.readUnsignedByte();
            sample.egSpeed    = stream.readUnsignedByte();
            sample.fxControl  = stream.readUnsignedByte();
            sample.fxSpeed    = stream.readUnsignedByte();
            sample.fxDelay    = stream.readUnsignedByte();
            sample.modControl = stream.readUnsignedByte();
            sample.modTable   = stream.readUnsignedByte() << 6;
            sample.modSpeed   = stream.readUnsignedByte();
            sample.modDelay   = stream.readUnsignedByte();
            sample.volume     = stream.readUnsignedByte();
            sample.modLen     = stream.readUnsignedShort();
          }
        } else {
          stream.position--;
          sample.synth  = 0;
          sample.name   = stream.readMultiByte(24, ENCODING);
          sample.length = stream.readUnsignedShort() << 1;

          if (sample.length) {
            sample.loop   = stream.readUnsignedShort();
            sample.repeat = stream.readUnsignedShort() << 1;
            sample.volume = stream.readUnsignedShort();

            if ((sample.loop + sample.repeat) >= sample.length)
              sample.repeat = sample.length - sample.loop;
          } else {
            sample.pointer--;
            sample.repeat = 2;
            stream.position += 6;
          }
        }
        samples[i] = sample;
      }

      len = length << 2;
      tracks = new Vector.<BPStep>(len, true);

      for (i = 0; i < len; ++i) {
        step = new BPStep();
        step.pattern = stream.readUnsignedShort();
        step.soundTranspose = stream.readByte();
        step.transpose = stream.readByte();
        if (step.pattern > higher) higher = step.pattern;
        tracks[i] = step;
      }

      len = higher << 4;
      patterns = new Vector.<AmigaRow>(len, true);

      for (i = 0; i < len; ++i) {
        row = new AmigaRow();
        row.note   = stream.readByte();
        row.sample = stream.readUnsignedByte();
        row.effect = row.sample & 0x0f;
        row.sample = (row.sample & 0xf0) >> 4;
        row.param  = stream.readByte();
        patterns[i] = row;
      }

      amiga.store(stream, tables << 6);

      for (i = 0; ++i < 16;) {
        sample = samples[i];
        if (sample.synth || !sample.length) continue;
        sample.pointer = amiga.store(stream, sample.length);
        sample.loopPtr = sample.pointer + sample.loop;
      }
    }

    public static const
      BPSOUNDMON_V1 = 1,
      BPSOUNDMON_V2 = 2,
      BPSOUNDMON_V3 = 3;

    private const
      PERIODS: Vector.<int> = Vector.<int>([
        6848,6464,6080,5760,5440,5120,4832,4576,4320,4064,3840,3616,
        3424,3232,3040,2880,2720,2560,2416,2288,2160,2032,1920,1808,
        1712,1616,1520,1440,1360,1280,1208,1144,1080,1016, 960, 904,
         856, 808, 760, 720, 680, 640, 604, 572, 540, 508, 480, 452,
         428, 404, 380, 360, 340, 320, 302, 286, 270, 254, 240, 226,
         214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120, 113,
         107, 101,  95,  90,  85,  80,  76,  72,  68,  64,  60,  57]),

      VIBRATO: Vector.<int> = Vector.<int>([0,64,128,64,0,-64,-128,-64]);
  }
}