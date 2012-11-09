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
package neoart.flod.sidmon {
  import flash.utils.*;
  import neoart.flod.core.*;

  public final class S1Player extends AmigaPlayer {
    private var
      tracksPtr   : Vector.<int>,
      tracks      : Vector.<AmigaStep>,
      patternsPtr : Vector.<int>,
      patterns    : Vector.<SMRow>,
      samples     : Vector.<S1Sample>,
      waveLists   : Vector.<int>,
      speedDef    : int,
      trackLen    : int,
      patternDef  : int,
      mix1Speed   : int,
      mix2Speed   : int,
      mix1Dest    : int,
      mix2Dest    : int,
      mix1Source1 : int,
      mix1Source2 : int,
      mix2Source1 : int,
      mix2Source2 : int,
      doFilter    : int,
      doReset     : int,
      voices      : Vector.<S1Voice>,
      trackPos    : int,
      trackEnd    : int,
      patternPos  : int,
      patternEnd  : int,
      patternLen  : int,
      mix1Ctr     : int,
      mix2Ctr     : int,
      mix1Pos     : int,
      mix2Pos     : int,
      audPtr      : int,
      audLen      : int,
      audPer      : int,
      audVol      : int;

    public function S1Player(amiga:Amiga = null) {
      super(amiga);
      PERIODS.fixed = true;

      tracksPtr = new Vector.<int>(4, true);
      voices    = new Vector.<S1Voice>(4, true);

      voices[0] = new S1Voice(0);
      voices[0].next = voices[1] = new S1Voice(1);
      voices[1].next = voices[2] = new S1Voice(2);
      voices[2].next = voices[3] = new S1Voice(3);
    }

    override public function process():void {
      var chan:AmigaChannel, dst:int, i:int, index:int, memory:Vector.<int> = amiga.memory, row:SMRow, sample:S1Sample, src1:int, src2:int, step:AmigaStep, value:int, voice:S1Voice = voices[0];

      while (voice) {
        chan = voice.channel;
        audPtr = -1;
        audLen = audPer = audVol = 0;

        if (tick == 0) {
          if (patternEnd) {
            if (trackEnd) voice.step = tracksPtr[voice.index];
              else voice.step++;

            step = tracks[voice.step];
            voice.row = patternsPtr[step.pattern];
            if (doReset) voice.noteTimer = 0;
          }

          if (voice.noteTimer == 0) {
            row = patterns[voice.row];

            if (row.sample == 0) {
              if (row.note) {
                voice.noteTimer = row.speed;

                if (voice.waitCtr) {
                  sample = samples[voice.sample];
                  audPtr = sample.pointer;
                  audLen = sample.length;
                  voice.samplePtr = sample.loopPtr;
                  voice.sampleLen = sample.repeat;
                  voice.waitCtr = 1;
                  chan.enabled  = 0;
                }
              }
            } else {
              sample = samples[row.sample];
              if (voice.waitCtr) chan.enabled = voice.waitCtr = 0;

              if (sample.waveform > 15) {
                audPtr = sample.pointer;
                audLen = sample.length;
                voice.samplePtr = sample.loopPtr;
                voice.sampleLen = sample.repeat;
                voice.waitCtr = 1;
              } else {
                voice.wavePos = 0;
                voice.waveList = sample.waveform;
                index = voice.waveList << 4;
                audPtr = waveLists[index] << 5;
                audLen = 32;
                voice.waveTimer = waveLists[++index];
              }

              voice.noteTimer   = row.speed;
              voice.sample      = row.sample;
              voice.envelopeCtr = voice.pitchCtr = voice.pitchFallCtr = 0;
            }

            if (row.note) {
              voice.noteTimer = row.speed;

              if (row.note != 0xff) {
                sample = samples[voice.sample];
                step = tracks[voice.step];

                voice.note = row.note + step.transpose;
                voice.period = audPer = PERIODS[int(1 + sample.finetune + voice.note)];
                voice.phaseSpeed = sample.phaseSpeed;

                voice.bendSpeed   = voice.volume = 0;
                voice.envelopeCtr = voice.pitchCtr = voice.pitchFallCtr = 0;

                switch (row.effect) {
                  case 0:
                    if (row.param == 0) break;
                    sample.attackSpeed = row.param;
                    sample.attackMax   = row.param;
                    voice.waveTimer    = 0;
                    break;
                  case 2:
                    this.speed = row.param;
                    voice.waveTimer = 0;
                    break;
                  case 3:
                    this.patternLen = row.param;
                    voice.waveTimer = 0;
                    break;
                  default:
                    voice.bendTo = row.effect + step.transpose;
                    voice.bendSpeed = row.param;
                    break;
                }
              }
            }
            voice.row++;
          } else {
            voice.noteTimer--;
          }
        }
        sample = samples[voice.sample];
        audVol = voice.volume;

        switch (voice.envelopeCtr) {
          case 8:
            break;
          case 0:   //attack
            audVol += sample.attackSpeed;

            if (audVol > sample.attackMax) {
              audVol = sample.attackMax;
              voice.envelopeCtr += 2;
            }
            break;
          case 2:   //decay
            audVol -= sample.decaySpeed;

            if (audVol <= sample.decayMin || audVol < -256) {
              audVol = sample.decayMin;
              voice.envelopeCtr += 2;
              voice.sustainCtr = sample.sustain;
            }
            break;
          case 4:   //sustain
            voice.sustainCtr--;
            if (voice.sustainCtr == 0 || voice.sustainCtr == -256) voice.envelopeCtr += 2;
            break;
          case 6:   //release
            this.audVol -= sample.releaseSpeed;

            if (audVol <= sample.releaseMin || audVol < -256) {
              audVol = sample.releaseMin;
              voice.envelopeCtr = 8;
            }
            break;
        }

        voice.volume = audVol;
        voice.arpeggioCtr = ++voice.arpeggioCtr & 15;
        index = sample.finetune + sample.arpeggio[voice.arpeggioCtr] + voice.note;
        voice.period = audPer = PERIODS[index];

        if (voice.bendSpeed) {
          value = PERIODS[int(sample.finetune + voice.bendTo)];
          index = ~voice.bendSpeed + 1;
          if (index < -128) index &= 255;
          voice.pitchCtr += index;
          voice.period   += voice.pitchCtr;

          if ((index < 0 && voice.period <= value) || (index > 0 && voice.period >= value)) {
            voice.note   = voice.bendTo;
            voice.period = value;
            voice.bendSpeed = 0;
            voice.pitchCtr  = 0;
          }
        }

        if (sample.phaseShift) {
          if (voice.phaseSpeed) {
            voice.phaseSpeed--;
          } else {
            voice.phaseTimer = ++voice.phaseTimer & 31;
            index = (sample.phaseShift << 5) + voice.phaseTimer;
            voice.period += memory[index] >> 2;
          }
        }
        voice.pitchFallCtr -= sample.pitchFall;
        if (voice.pitchFallCtr < -256) voice.pitchFallCtr += 256;
        voice.period += voice.pitchFallCtr;

        if (voice.waitCtr == 0) {
          if (voice.waveTimer) {
            voice.waveTimer--;
          } else {
            if (voice.wavePos < 16) {
              index = (voice.waveList << 4) + voice.wavePos;
              value = waveLists[index++];

              if (value == 0xff) {
                voice.wavePos = waveLists[index] & 254;
              } else {
                audPtr = value << 5;
                voice.waveTimer = waveLists[index];
                voice.wavePos += 2;
              }
            }
          }
        }
        if (audPtr > -1) chan.pointer = audPtr;
        if (audPer != 0) chan.period  = voice.period;
        if (audLen != 0) chan.length  = audLen;

        if (sample.volume) chan.volume = sample.volume;
          else chan.volume = audVol >> 2;

        chan.enabled = 1;
        voice = voice.next;
      }

      trackEnd = patternEnd = 0;

      if (++tick > speed) {
        tick = 0;

        if (++patternPos == patternLen) {
          patternPos = 0;
          patternEnd = 1;

          if (++trackPos == trackLen)
            trackPos = trackEnd = amiga.complete = 1;
        }
      }

      if (mix1Speed) {
        if (mix1Ctr == 0) {
          mix1Ctr = mix1Speed;
          index = mix1Pos = ++mix1Pos & 31;
          dst  = (mix1Dest    << 5) + 31;
          src1 = (mix1Source1 << 5) + 31;
          src2 =  mix1Source2 << 5;

          for (i = 31; i > -1; --i) {
            memory[dst--] = (memory[src1--] + memory[int(src2 + index)]) >> 1;
            index = --index & 31;
          }
        }
        mix1Ctr--;
      }

      if (mix2Speed) {
        if (mix2Ctr == 0) {
          mix2Ctr = mix2Speed;
          index = mix2Pos = ++mix2Pos & 31;
          dst  = (mix2Dest    << 5) + 31;
          src1 = (mix2Source1 << 5) + 31;
          src2 =  mix2Source2 << 5;

          for (i = 31; i > -1; --i) {
            memory[dst--] = (memory[src1--] + memory[int(src2 + index)]) >> 1;
            index = --index & 31;
          }
        }
        mix2Ctr--;
      }

      if (doFilter) {
        index = mix1Pos + 32;
        memory[index] = ~memory[index] + 1;
      }
      voice = voices[0];

      while (voice) {
        chan = voice.channel;

        if (voice.waitCtr == 1) {
          voice.waitCtr++;
        } else if (voice.waitCtr == 2) {
          voice.waitCtr++;
          chan.pointer = voice.samplePtr;
          chan.length  = voice.sampleLen;
        }
        voice = voice.next;
      }
    }

    override protected function initialize():void {
      var chan:AmigaChannel, step:AmigaStep, voice:S1Voice = voices[0];
      super.initialize();

      speed      =  speedDef;
      tick       =  speedDef;
      trackPos   =  1;
      trackEnd   =  0;
      patternPos = -1;
      patternEnd =  0;
      patternLen =  patternDef;

      mix1Ctr = mix1Pos = 0;
      mix2Ctr = mix2Pos = 0;

      while (voice) {
        voice.initialize();
        chan = amiga.channels[voice.index];

        voice.channel = chan;
        voice.step    = tracksPtr[voice.index];
        step = tracks[voice.step];
        voice.row    = patternsPtr[step.pattern];
        voice.sample = patterns[voice.row].sample;

        chan.length  = 32;
        chan.period  = voice.period;
        chan.enabled = 1;

        voice = voice.next;
      }
    }

    override protected function loader(stream:ByteArray):void {
      var data:int, i:int, id:String, j:int, headers:int, len:int, position:int, row:SMRow, sample:S1Sample, start:int, step:AmigaStep, totInstruments:int, totPatterns:int, totSamples:int, totWaveforms:int, ver:int;

      while (stream.bytesAvailable > 8) {
        start = stream.readUnsignedShort();
        if (start != 0x41fa) continue;
        j = stream.readUnsignedShort();

        start = stream.readUnsignedShort();
        if (start != 0xd1e8) continue;
        start = stream.readUnsignedShort();

        if (start == 0xffd4) {
          if (j == 0x0fec) ver = SIDMON_0FFA;
            else if (j == 0x1466) ver = SIDMON_1444;
              else ver = j;

          position = j + stream.position - 6;
          break;
        }
      }
      if (!position) return;
      stream.position = position;

      id = stream.readMultiByte(32, ENCODING);
      if (id != " SID-MON BY R.v.VLIET  (c) 1988 ") return;

      stream.position = position - 44;
      start = stream.readUnsignedInt();

      for (i = 1; i < 4; ++i)
        tracksPtr[i] = (stream.readUnsignedInt() - start) / 6;

      stream.position = position - 8;
      start = stream.readUnsignedInt();
      len   = stream.readUnsignedInt();
      if (len < start) len = stream.length - position;

      totPatterns = (len - start) >> 2;
      patternsPtr = new Vector.<int>(totPatterns);
      stream.position = position + start + 4;

      for (i = 1; i < totPatterns; ++i) {
        start = stream.readUnsignedInt() / 5;

        if (start == 0) {
          totPatterns = i;
          break;
        }
        patternsPtr[i] = start;
      }

      patternsPtr.length = totPatterns;
      patternsPtr.fixed  = true;

      stream.position = position - 44;
      start = stream.readUnsignedInt();
      stream.position = position - 28;
      len = (stream.readUnsignedInt() - start) / 6;

      tracks = new Vector.<AmigaStep>(len, true);
      stream.position = position + start;

      for (i = 0; i < len; ++i) {
        step = new AmigaStep();
        step.pattern = stream.readUnsignedInt();
        if (step.pattern >= totPatterns) step.pattern = 0;
        stream.readByte();
        step.transpose = stream.readByte();
        if (step.transpose < -99 || step.transpose > 99) step.transpose = 0;
        tracks[i] = step;
      }

      stream.position = position - 24;
      start = stream.readUnsignedInt();
      totWaveforms = stream.readUnsignedInt() - start;

      amiga.memory.length = 32;
      amiga.store(stream, totWaveforms, position + start);
      totWaveforms >>= 5;

      stream.position = position - 16;
      start = stream.readUnsignedInt();
      len = (stream.readUnsignedInt() - start) + 16;
      j = (totWaveforms + 2) << 4;

      waveLists = new Vector.<int>(len < j ? j : len, true);
      stream.position = position + start;
      i = 0;

      while (i < j) {
        waveLists[i++] = i >> 4;
        waveLists[i++] = 0xff;
        waveLists[i++] = 0xff;
        waveLists[i++] = 0x10;
        i += 12;
      }

      for (i = 16; i < len; ++i)
        waveLists[i] = stream.readUnsignedByte();

      stream.position = position - 20;
      stream.position = position + stream.readUnsignedInt();

      mix1Source1 = stream.readUnsignedInt();
      mix2Source1 = stream.readUnsignedInt();
      mix1Source2 = stream.readUnsignedInt();
      mix2Source2 = stream.readUnsignedInt();
      mix1Dest    = stream.readUnsignedInt();
      mix2Dest    = stream.readUnsignedInt();
      patternDef  = stream.readUnsignedInt();
      trackLen    = stream.readUnsignedInt();
      speedDef    = stream.readUnsignedInt();
      mix1Speed   = stream.readUnsignedInt();
      mix2Speed   = stream.readUnsignedInt();

      if (mix1Source1 > totWaveforms) mix1Source1 = 0;
      if (mix2Source1 > totWaveforms) mix2Source1 = 0;
      if (mix1Source2 > totWaveforms) mix1Source2 = 0;
      if (mix2Source2 > totWaveforms) mix2Source2 = 0;
      if (mix1Dest > totWaveforms) mix1Speed = 0;
      if (mix2Dest > totWaveforms) mix2Speed = 0;
      if (speedDef == 0) speedDef = 4;

      stream.position = position - 28;
      j = stream.readUnsignedInt();
      totInstruments = (stream.readUnsignedInt() - j) >> 5;
      if (totInstruments > 63) totInstruments = 63;
      len = totInstruments + 1;

      stream.position = position - 4;
      start = stream.readUnsignedInt();

      if (start == 1) {
        stream.position = 0x71c;
        start = stream.readUnsignedShort();

        if (start != 0x4dfa) {
          stream.position = 0x6fc;
          start = stream.readUnsignedShort();

          if (start != 0x4dfa) {
            version = 0;
            return;
          }
        }
        stream.position += stream.readUnsignedShort();
        samples = new Vector.<S1Sample>(len + 3, true);

        for (i = 0; i < 3; ++i) {
          sample = new S1Sample();
          sample.waveform = 16 + i;
          sample.length   = EMBEDDED[i];
          sample.pointer  = amiga.store(stream, sample.length);
          sample.loop     = sample.loopPtr = 0;
          sample.repeat   = 4;
          sample.volume   = 64;
          samples[int(len + i)] = sample;
          stream.position += sample.length;
        }
      } else {
        samples = new Vector.<S1Sample>(len, true);

        stream.position = position + start;
        data = stream.readUnsignedInt();
        totSamples = (data >> 5) + 15;
        headers = stream.position;
        data += headers;
      }

      sample = new S1Sample();
      samples[0] = sample;
      stream.position = position + j;

      for (i = 1; i < len; ++i) {
        sample = new S1Sample();
        sample.waveform = stream.readUnsignedInt();
        for (j = 0; j < 16; ++j) sample.arpeggio[j] = stream.readUnsignedByte();

        sample.attackSpeed  = stream.readUnsignedByte();
        sample.attackMax    = stream.readUnsignedByte();
        sample.decaySpeed   = stream.readUnsignedByte();
        sample.decayMin     = stream.readUnsignedByte();
        sample.sustain      = stream.readUnsignedByte();
        stream.readByte();
        sample.releaseSpeed = stream.readUnsignedByte();
        sample.releaseMin   = stream.readUnsignedByte();
        sample.phaseShift   = stream.readUnsignedByte();
        sample.phaseSpeed   = stream.readUnsignedByte();
        sample.finetune     = stream.readUnsignedByte();
        sample.pitchFall    = stream.readByte();

        if (ver == SIDMON_1444) {
          sample.pitchFall = sample.finetune;
          sample.finetune = 0;
        } else {
          if (sample.finetune > 15) sample.finetune = 0;
          sample.finetune *= 67;
        }

        if (sample.phaseShift > totWaveforms) {
          sample.phaseShift = 0;
          sample.phaseSpeed = 0;
        }

        if (sample.waveform > 15) {
          if ((totSamples > 15) && (sample.waveform > totSamples)) {
            sample.waveform = 0;
          } else {
            start = headers + ((sample.waveform - 16) << 5);
            if (start >= stream.length) continue;
            j = stream.position;

            stream.position = start;
            sample.pointer  = stream.readUnsignedInt();
            sample.loop     = stream.readUnsignedInt();
            sample.length   = stream.readUnsignedInt();
            sample.name     = stream.readMultiByte(20, ENCODING);

            if (sample.loop == 0      ||
                sample.loop == 99999  ||
                sample.loop == 199999 ||
                sample.loop >= sample.length) {

              sample.loop   = 0;
              sample.repeat = ver == SIDMON_0FFA ? 2 : 4;
            } else {
              sample.repeat = sample.length - sample.loop;
              sample.loop  -= sample.pointer;
            }

            sample.length -= sample.pointer;
            if (sample.length < (sample.loop + sample.repeat))
              sample.length = sample.loop + sample.repeat;

            sample.pointer = amiga.store(stream, sample.length, data + sample.pointer);
            if (sample.repeat < 6 || sample.loop == 0) sample.loopPtr = 0;
              else sample.loopPtr = sample.pointer + sample.loop;

            stream.position = j;
          }
        } else if (sample.waveform > totWaveforms) {
          sample.waveform = 0;
        }
        samples[i] = sample;
      }

      stream.position = position - 12;
      start = stream.readUnsignedInt();
      len = (stream.readUnsignedInt() - start) / 5;
      patterns = new Vector.<SMRow>(len, true);
      stream.position = position + start;

      for (i = 0; i < len; ++i) {
        row = new SMRow();
        row.note   = stream.readUnsignedByte();
        row.sample = stream.readUnsignedByte();
        row.effect = stream.readUnsignedByte();
        row.param  = stream.readUnsignedByte();
        row.speed  = stream.readUnsignedByte();

        if (ver == SIDMON_1444) {
          if (row.note > 0 && row.note < 255) row.note += 469;
          if (row.effect > 0 && row.effect < 255) row.effect += 469;
          if (row.sample > 59) row.sample = totInstruments + (row.sample - 60);
        } else if (row.sample > totInstruments) {
          row.sample = 0;
        }
        patterns[i] = row;
      }

      if (ver == SIDMON_1170 || ver == SIDMON_11C6 || ver == SIDMON_1444) {
        if (ver == SIDMON_1170) mix1Speed = mix2Speed = 0;
        doReset = doFilter = 0;
      } else {
        doReset = doFilter = 1;
      }
      version = 1;
    }

    private const
      SIDMON_0FFA = 0x0ffa,
      SIDMON_1170 = 0x1170,
      SIDMON_11C6 = 0x11c6,
      SIDMON_11DC = 0x11dc,
      SIDMON_11E0 = 0x11e0,
      SIDMON_125A = 0x125a,
      SIDMON_1444 = 0x1444,

      EMBEDDED: Vector.<int> = Vector.<int>([1166, 408, 908]),

      PERIODS: Vector.<int> = Vector.<int>([0,
        5760,5424,5120,4832,4560,4304,4064,3840,3616,3424,3232,3048,
        2880,2712,2560,2416,2280,2152,2032,1920,1808,1712,1616,1524,
        1440,1356,1280,1208,1140,1076,1016, 960, 904, 856, 808, 762,
         720, 678, 640, 604, 570, 538, 508, 480, 452, 428, 404, 381,
         360, 339, 320, 302, 285, 269, 254, 240, 226, 214, 202, 190,
         180, 170, 160, 151, 143, 135, 127,
         0,0,0,0,0,0,0,
        4028,3806,3584,3394,3204,3013,2855,2696,2538,2395,2268,2141,
        2014,1903,1792,1697,1602,1507,1428,1348,1269,1198,1134,1071,
        1007, 952, 896, 849, 801, 754, 714, 674, 635, 599, 567, 536,
         504, 476, 448, 425, 401, 377, 357, 337, 310, 300, 284, 268,
         252, 238, 224, 213, 201, 189, 179, 169, 159, 150, 142, 134,
         0,0,0,0,0,0,0,
        3993,3773,3552,3364,3175,2987,2830,2672,2515,2374,2248,2122,
        1997,1887,1776,1682,1588,1494,1415,1336,1258,1187,1124,1061,
         999, 944, 888, 841, 794, 747, 708, 668, 629, 594, 562, 531,
         500, 472, 444, 421, 397, 374, 354, 334, 315, 297, 281, 266,
         250, 236, 222, 211, 199, 187, 177, 167, 158, 149, 141, 133,
         0,0,0,0,0,0,0,
        3957,3739,3521,3334,3147,2960,2804,2648,2493,2353,2228,2103,
        1979,1870,1761,1667,1574,1480,1402,1324,1247,1177,1114,1052,
         990, 935, 881, 834, 787, 740, 701, 662, 624, 589, 557, 526,
         495, 468, 441, 417, 394, 370, 351, 331, 312, 295, 279, 263,
         248, 234, 221, 209, 197, 185, 176, 166, 156, 148, 140, 132,
         0,0,0,0,0,0,0,
        3921,3705,3489,3304,3119,2933,2779,2625,2470,2331,2208,2084,
        1961,1853,1745,1652,1560,1467,1390,1313,1235,1166,1104,1042,
         981, 927, 873, 826, 780, 734, 695, 657, 618, 583, 552, 521,
         491, 464, 437, 413, 390, 367, 348, 329, 309, 292, 276, 261,
         246, 232, 219, 207, 195, 184, 174, 165, 155, 146, 138, 131,
         0,0,0,0,0,0,0,
        3886,3671,3457,3274,3090,2907,2754,2601,2448,2310,2188,2065,
        1943,1836,1729,1637,1545,1454,1377,1301,1224,1155,1094,1033,
         972, 918, 865, 819, 773, 727, 689, 651, 612, 578, 547, 517,
         486, 459, 433, 410, 387, 364, 345, 326, 306, 289, 274, 259,
         243, 230, 217, 205, 194, 182, 173, 163, 153, 145, 137, 130,
         0,0,0,0,0,0,0,
        3851,3638,3426,3244,3062,2880,2729,2577,2426,2289,2168,2047,
        1926,1819,1713,1622,1531,1440,1365,1289,1213,1145,1084,1024,
         963, 910, 857, 811, 766, 720, 683, 645, 607, 573, 542, 512,
         482, 455, 429, 406, 383, 360, 342, 323, 304, 287, 271, 256,
         241, 228, 215, 203, 192, 180, 171, 162, 152, 144, 136, 128,
        6848,6464,6096,5760,5424,5120,4832,4560,4304,4064,3840,3616,
        3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,1920,1808,
        1712,1616,1524,1440,1356,1280,1208,1140,1076,1016, 960, 904,
         856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 452,
         428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240, 226,
         214, 202, 190, 180, 170, 160, 151, 143, 135, 127]);
  }
}