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

  public final class PTPlayer extends AmigaPlayer {
    private var
      track        : Vector.<int>,
      patterns     : Vector.<PTRow>,
      samples      : Vector.<PTSample>,
      length       : int,
      voices       : Vector.<PTVoice>,
      trackPos     : int,
      patternPos   : int,
      patternBreak : int,
      patternDelay : int,
      breakPos     : int,
      jumpFlag     : int,
      vibratoDepth : int;

    public function PTPlayer(amiga:Amiga = null) {
      super(amiga);
      PERIODS.fixed = true;
      VIBRATO.fixed = true;
      FUNKREP.fixed = true;

      track   = new Vector.<int>(128, true);
      samples = new Vector.<PTSample>(32, true);
      voices  = new Vector.<PTVoice>(4, true);

      voices[0] = new PTVoice(0);
      voices[0].next = voices[1] = new PTVoice(1);
      voices[1].next = voices[2] = new PTVoice(2);
      voices[2].next = voices[3] = new PTVoice(3);
    }

    override public function set force(value:int):void {
      if (value < PROTRACKER_10)
        value = PROTRACKER_10;
      else if (value > PROTRACKER_12)
        value = PROTRACKER_12;

      version = value;

      if (value < PROTRACKER_11) vibratoDepth = 6;
        else vibratoDepth = 7;
    }

    override public function process():void {
      var chan:AmigaChannel, i:int, pattern:int, row:PTRow, sample:PTSample, value:int, voice:PTVoice = voices[0];

      if (!tick) {
        if (patternDelay) {
          effects();
        } else {
          pattern = track[trackPos] + patternPos;

          while (voice) {
            chan = voice.channel;
            voice.enabled = 0;

            if (!voice.step) chan.period = voice.period;

            row = patterns[int(pattern + voice.index)];
            voice.step   = row.step;
            voice.effect = row.effect;
            voice.param  = row.param;

            if (row.sample) {
              sample = voice.sample = samples[row.sample];

              voice.pointer  = sample.pointer;
              voice.length   = sample.length;
              voice.loopPtr  = voice.funkWave = sample.loopPtr;
              voice.repeat   = sample.repeat;
              voice.finetune = sample.finetune;

              chan.volume = voice.volume = sample.volume;
            } else {
              sample = voice.sample;
            }

            if (!row.note) {
              moreEffects(voice);
              voice = voice.next;
              continue;
            } else {
              if ((voice.step & 0x0ff0) == 0x0e50) {
                voice.finetune = (voice.param & 0x0f) * 37;
              } else if (voice.effect == 3 || voice.effect == 5) {
                if (row.note == voice.period) {
                  voice.portaPeriod = 0;
                } else {
                  i = voice.finetune;
                  value = i + 37;

                  for (i; i < value; ++i)
                    if (row.note >= PERIODS[i]) break;

                  if (i == value) value--;

                  if (i > 0) {
                    value = (voice.finetune / 37) & 8;
                    if (value) i--;
                  }

                  voice.portaPeriod = PERIODS[i];
                  voice.portaDir = row.note > voice.portaPeriod ? 0 : 1;
                }
              } else if (voice.effect == 9) {
                moreEffects(voice);
              }
            }

            for (i = 0; i < 37; ++i)
              if (row.note >= PERIODS[i]) break;

            voice.period = PERIODS[int(voice.finetune + i)];

            if ((voice.step & 0x0ff0) == 0x0ed0) {
              if (voice.funkSpeed) updateFunk(voice);
              extended(voice);
              voice = voice.next;
              continue;
            }

            if (voice.vibratoWave < 4) voice.vibratoPos = 0;
            if (voice.tremoloWave < 4) voice.tremoloPos = 0;

            chan.enabled = 0;
            chan.pointer = voice.pointer;
            chan.length  = voice.length;
            chan.period  = voice.period;

            voice.enabled = 1;
            moreEffects(voice);
            voice = voice.next;
          }
          voice = voices[0];

          while (voice) {
            chan = voice.channel;
            if (voice.enabled) chan.enabled = 1;

            chan.pointer = voice.loopPtr;
            chan.length  = voice.repeat;

            voice = voice.next;
          }
        }
      } else {
        effects();
      }

      if (++tick == speed) {
        tick = 0;
        patternPos += 4;

        if (patternDelay)
          if (--patternDelay) patternPos -= 4;

        if (patternBreak) {
          patternBreak = 0;
          patternPos = breakPos;
          breakPos = 0;
        }

        if (patternPos == 256 || jumpFlag) {
          patternPos = breakPos;
          breakPos = 0;
          jumpFlag = 0;

          if (++trackPos == length) {
            trackPos = 0;
            amiga.complete = 1;
          }
        }
      }
    }

    override protected function initialize():void {
      var voice:PTVoice = voices[0];

      tempo        = 125;
      speed        = 6;
      trackPos     = 0;
      patternPos   = 0;
      patternBreak = 0;
      patternDelay = 0;
      breakPos     = 0;
      jumpFlag     = 0;

      super.initialize();
      force = version;

      while (voice) {
        voice.initialize();
        voice.channel = amiga.channels[voice.index];
        voice.sample  = samples[0];
        voice = voice.next;
      }
    }

    override protected function loader(stream:ByteArray):void {
      var higher:int, i:int, id:String, j:int, row:PTRow, sample:PTSample, size:int, value:int;
      if (stream.length < 2106) return;

      stream.position = 1080;
      id = stream.readMultiByte(4, ENCODING);
      if (id != "M.K." && id != "M!K!") return;

      stream.position = 0;
      title = stream.readMultiByte(20, ENCODING);
      version = PROTRACKER_10;
      stream.position += 22;

      for (i = 1; i < 32; ++i) {
        value = stream.readUnsignedShort();

        if (!value) {
          samples[i] = null;
          stream.position += 28;
          continue;
        }

        sample = new PTSample();
        stream.position -= 24;

        sample.name = stream.readMultiByte(22, ENCODING);
        sample.length = sample.realLen = value << 1;
        stream.position += 2;

        sample.finetune = stream.readUnsignedByte() * 37;
        sample.volume   = stream.readUnsignedByte();
        sample.loop     = stream.readUnsignedShort() << 1;
        sample.repeat   = stream.readUnsignedShort() << 1;

        stream.position += 22;
        sample.pointer = size;
        size += sample.length;
        samples[i] = sample;
      }

      stream.position = 950;
      length = stream.readUnsignedByte();
      stream.position++;

      for (i = 0; i < 128; ++i) {
        value = stream.readUnsignedByte() << 8;
        track[i] = value;
        if (value > higher) higher = value;
      }

      stream.position = 1084;
      higher += 256;
      patterns = new Vector.<PTRow>(higher, true);

      for (i = 0; i < higher; ++i) {
        row = new PTRow();
        row.step = value = stream.readUnsignedInt();

        row.note   = (value >> 16) & 0x0fff;
        row.effect = (value >>  8) & 0x0f;
        row.sample = (value >> 24) & 0xf0 | (value >> 12) & 0x0f;
        row.param  = value & 0xff;

        patterns[i] = row;

        if (row.sample > 31 || !samples[row.sample]) row.sample = 0;

        if (row.effect == 15 && row.param > 31)
          version = PROTRACKER_11;

        if (row.effect == 8)
          version = PROTRACKER_12;
      }

      amiga.store(stream, size);

      for (i = 1; i < 32; ++i) {
        sample = samples[i];
        if (!sample) continue;

        if (sample.loop || sample.repeat > 4) {
          sample.loopPtr = sample.pointer + sample.loop;
          sample.length  = sample.loop + sample.repeat;
        } else {
          sample.loopPtr = amiga.memory.length;
          sample.repeat  = 2;
        }

        size = sample.pointer + 2;
        for (j = sample.pointer; j < size; ++j) amiga.memory[j] = 0;
      }

      sample = new PTSample();
      sample.pointer = sample.loopPtr = amiga.memory.length;
      sample.length  = sample.repeat  = 2;
      samples[0] = sample;
    }

    private function effects():void {
      var chan:AmigaChannel, i:int, position:int, slide:int, value:int, voice:PTVoice = voices[0], wave:int;

      while (voice) {
        chan = voice.channel;
        if (voice.funkSpeed) updateFunk(voice);

        if ((voice.step & 0x0fff) == 0) {
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

            i = voice.finetune;
            position = i + 37;

            for (i; i < position; ++i)
              if (voice.period >= PERIODS[i]) {
                chan.period = PERIODS[int(i + value)];
                break;
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
            } else {
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

              if (voice.glissando) {
                i = voice.finetune;
                value = i + 37;

                for (i; i < value; ++i)
                  if (voice.period >= PERIODS[i]) break;

                if (i == value) i--;
                chan.period = PERIODS[i];
              } else {
                chan.period = voice.period;
              }
            }
            break;
          case 4:   //vibrato
          case 6:   //vibrato + volume slide
            if (voice.effect == 6) {
              slide = 1;
            } else if (voice.param) {
              value = voice.param & 0x0f;
              if (value) voice.vibratoParam = (voice.vibratoParam & 0xf0) | value;
              value = voice.param & 0xf0;
              if (value) voice.vibratoParam = (voice.vibratoParam & 0x0f) | value;
            }

            position = (voice.vibratoPos >> 2) & 31;
            wave = voice.vibratoWave & 3;

            if (wave) {
              value = 255;
              position <<= 3;

              if (wave == 1) {
                if (voice.vibratoPos > 127) value -= position;
                  else value = position;
              }
            } else {
              value = VIBRATO[position];
            }

            value = ((voice.vibratoParam & 0x0f) * value) >> vibratoDepth;

            if (voice.vibratoPos > 127) chan.period = voice.period - value;
              else chan.period = voice.period + value;

            value = (voice.vibratoParam >> 2) & 60;
            voice.vibratoPos = (voice.vibratoPos + value) & 255;
            break;
          case 7:   //tremolo
            chan.period = voice.period;

            if (voice.param) {
              value = voice.param & 0x0f;
              if (value) voice.tremoloParam = (voice.tremoloParam & 0xf0) | value;
              value = voice.param & 0xf0;
              if (value) voice.tremoloParam = (voice.tremoloParam & 0x0f) | value;
            }

            position = (voice.tremoloPos >> 2) & 31;
            wave = voice.tremoloWave & 3;

            if (wave) {
              value = 255;
              position <<= 3;

              if (wave == 1) {
                if (voice.tremoloPos > 127) value -= position;
                  else value = position;
              }
            } else {
              value = VIBRATO[position];
            }

            value = ((voice.tremoloParam & 0x0f) * value) >> 6;

            if (voice.tremoloPos > 127) chan.volume = voice.volume - value;
              else chan.volume = voice.volume + value;

            value = (voice.tremoloParam >> 2) & 60;
            voice.tremoloPos = (voice.tremoloPos + value) & 255;
            break;
          case 10:  //volume slide
            slide = 1;
            break;
          case 14:  //extended effects
            extended(voice);
            break;
        }

        if (slide) {
          slide = 0;
          value = voice.param >> 4;

          if (value) voice.volume += value;
            else voice.volume -= voice.param & 0x0f;

          if (voice.volume < 0) voice.volume = 0;
            else if (voice.volume > 64) voice.volume = 64;

          chan.volume = voice.volume;
        }
        voice = voice.next;
      }
    }

    private function moreEffects(voice:PTVoice):void {
      var chan:AmigaChannel = voice.channel, value:int;
      if (voice.funkSpeed) updateFunk(voice);

      switch (voice.effect) {
        case 9:   //sample offset
          if (voice.param) voice.offset = voice.param;
          value = voice.offset << 8;

          if (value >= voice.length) {
            voice.length = 2;
          } else {
            voice.pointer += value;
            voice.length  -= value;
          }
          break;
        case 11:  //position jump
          trackPos = voice.param - 1;
          breakPos = 0;
          jumpFlag = 1;
          break;
        case 12:  //set volume
          voice.volume = voice.param;
          if (voice.volume > 64) voice.volume = 64;
          chan.volume = voice.volume;
          break;
        case 13:  //pattern break
          breakPos = ((voice.param >> 4) * 10) + (voice.param & 0x0f);

          if (breakPos > 63) breakPos = 0;
            else breakPos <<= 2;

          jumpFlag = 1;
          break;
        case 14:  //extended effects
          extended(voice);
          break;
        case 15:  //set speed
          if (!voice.param) return;

          if (voice.param < 32) speed = voice.param;
            else amiga.samplesTick = 110250 / voice.param;

          tick = 0;
          break;
      }
    }

    private function extended(voice:PTVoice):void {
      var chan:AmigaChannel = voice.channel, effect:int = voice.param >> 4, i:int, len:int, memory:Vector.<int>, param:int = voice.param & 0x0f;

      switch (effect) {
        case 0:   //set filter
          amiga.filter.active = param;
          break;
        case 1:   //fine portamento up
          if (tick) return;
          voice.period -= param;
          if (voice.period < 113) voice.period = 113;
          chan.period = voice.period;
          break;
        case 2:   //fine portamento down
          if (tick) return;
          voice.period += param;
          if (voice.period > 856) voice.period = 856;
          chan.period = voice.period;
          break;
        case 3:   //glissando control
          voice.glissando = param;
          break;
        case 4:   //vibrato control
          voice.vibratoWave = param;
          break;
        case 5:   //set finetune
          voice.finetune = param * 37;
          break;
        case 6:   //pattern loop
          if (tick) return;

          if (param) {
            if (voice.loopCtr) voice.loopCtr--;
              else voice.loopCtr = param;

            if (voice.loopCtr) {
              breakPos = voice.loopPos << 2;
              patternBreak = 1;
            }
          } else {
            voice.loopPos = patternPos >> 2;
          }
          break;
        case 7:   //tremolo control
          voice.tremoloWave = param;
          break;
        case 8:   //karplus strong
          len = voice.length - 2;
          memory = amiga.memory;

          for (i = voice.loopPtr; i < len;)
            memory[i] = (memory[i] + memory[++i]) * 0.5;

          memory[++i] = (memory[i] + memory[0]) * 0.5;
          break;
        case 9:   //retrig note
          if (tick || !param || !voice.period) return;
          if (tick % param) return;

          chan.enabled = 0;
          chan.pointer = voice.pointer;
          chan.length  = voice.length;
          chan.delay   = 30;

          chan.enabled = 1;
          chan.pointer = voice.loopPtr;
          chan.length  = voice.repeat;
          chan.period  = voice.period;
          break;
        case 10:  //fine volume up
          if (tick) return;
          voice.volume += param;
          if (voice.volume > 64) voice.volume = 64;
          chan.volume = voice.volume;
          break;
        case 11:  //fine volume down
          if (tick) return;
          voice.volume -= param;
          if (voice.volume < 0) voice.volume = 0;
          chan.volume = voice.volume;
          break;
        case 12:  //note cut
          if (tick == param) chan.volume = voice.volume = 0;
          break;
        case 13:  //note delay
          if (tick != param || !voice.period) return;

          chan.enabled = 0;
          chan.pointer = voice.pointer;
          chan.length  = voice.length;
          chan.delay   = 30;

          chan.enabled = 1;
          chan.pointer = voice.loopPtr;
          chan.length  = voice.repeat;
          chan.period  = voice.period;
          break;
        case 14:  //pattern delay
          if (tick || patternDelay) return;
          patternDelay = ++param;
          break;
        case 15:  //funk repeat or invert loop
          if (tick) return;
          voice.funkSpeed = param;
          if (param) updateFunk(voice);
          break;
      }
    }

    private function updateFunk(voice:PTVoice):void {
      var chan:AmigaChannel = voice.channel, p1:int, p2:int, value:int = FUNKREP[voice.funkSpeed];

      voice.funkPos += value;
      if (voice.funkPos < 128) return;
      voice.funkPos = 0;

      if (version == PROTRACKER_10) {
        p1 = voice.pointer + voice.sample.realLen - voice.repeat;
        p2 = voice.funkWave + voice.repeat;

        if (p2 > p1) {
          p2 = voice.loopPtr;
          chan.length = voice.repeat;
        }
        chan.pointer = voice.funkWave = p2;
      } else {
        p1 = voice.loopPtr + voice.repeat;
        p2 = voice.funkWave + 1;

        if (p2 >= p1) p2 = voice.loopPtr;

        amiga.memory[p2] = -amiga.memory[p2];
      }
    }

    public static const
      PROTRACKER_10 : int = 1,
      PROTRACKER_11 : int = 2,
      PROTRACKER_12 : int = 3;

    private const
      PERIODS : Vector.<int> = Vector.<int>([
        856,808,762,720,678,640,604,570,538,508,480,453,
        428,404,381,360,339,320,302,285,269,254,240,226,
        214,202,190,180,170,160,151,143,135,127,120,113,0,
        850,802,757,715,674,637,601,567,535,505,477,450,
        425,401,379,357,337,318,300,284,268,253,239,225,
        213,201,189,179,169,159,150,142,134,126,119,113,0,
        844,796,752,709,670,632,597,563,532,502,474,447,
        422,398,376,355,335,316,298,282,266,251,237,224,
        211,199,188,177,167,158,149,141,133,125,118,112,0,
        838,791,746,704,665,628,592,559,528,498,470,444,
        419,395,373,352,332,314,296,280,264,249,235,222,
        209,198,187,176,166,157,148,140,132,125,118,111,0,
        832,785,741,699,660,623,588,555,524,495,467,441,
        416,392,370,350,330,312,294,278,262,247,233,220,
        208,196,185,175,165,156,147,139,131,124,117,110,0,
        826,779,736,694,655,619,584,551,520,491,463,437,
        413,390,368,347,328,309,292,276,260,245,232,219,
        206,195,184,174,164,155,146,138,130,123,116,109,0,
        820,774,730,689,651,614,580,547,516,487,460,434,
        410,387,365,345,325,307,290,274,258,244,230,217,
        205,193,183,172,163,154,145,137,129,122,115,109,0,
        814,768,725,684,646,610,575,543,513,484,457,431,
        407,384,363,342,323,305,288,272,256,242,228,216,
        204,192,181,171,161,152,144,136,128,121,114,108,0,
        907,856,808,762,720,678,640,604,570,538,508,480,
        453,428,404,381,360,339,320,302,285,269,254,240,
        226,214,202,190,180,170,160,151,143,135,127,120,0,
        900,850,802,757,715,675,636,601,567,535,505,477,
        450,425,401,379,357,337,318,300,284,268,253,238,
        225,212,200,189,179,169,159,150,142,134,126,119,0,
        894,844,796,752,709,670,632,597,563,532,502,474,
        447,422,398,376,355,335,316,298,282,266,251,237,
        223,211,199,188,177,167,158,149,141,133,125,118,0,
        887,838,791,746,704,665,628,592,559,528,498,470,
        444,419,395,373,352,332,314,296,280,264,249,235,
        222,209,198,187,176,166,157,148,140,132,125,118,0,
        881,832,785,741,699,660,623,588,555,524,494,467,
        441,416,392,370,350,330,312,294,278,262,247,233,
        220,208,196,185,175,165,156,147,139,131,123,117,0,
        875,826,779,736,694,655,619,584,551,520,491,463,
        437,413,390,368,347,328,309,292,276,260,245,232,
        219,206,195,184,174,164,155,146,138,130,123,116,0,
        868,820,774,730,689,651,614,580,547,516,487,460,
        434,410,387,365,345,325,307,290,274,258,244,230,
        217,205,193,183,172,163,154,145,137,129,122,115,0,
        862,814,768,725,684,646,610,575,543,513,484,457,
        431,407,384,363,342,323,305,288,272,256,242,228,
        216,203,192,181,171,161,152,144,136,128,121,114,0]),

      VIBRATO: Vector.<int> = Vector.<int>([
          0, 24, 49, 74, 97,120,141,161,180,197,212,224,
        235,244,250,253,255,253,250,244,235,224,212,197,
        180,161,141,120, 97, 74, 49, 24]),

      FUNKREP: Vector.<int> = Vector.<int>([
        0,5,6,7,8,10,11,13,16,19,22,26,32,43,64,128]);
  }
}