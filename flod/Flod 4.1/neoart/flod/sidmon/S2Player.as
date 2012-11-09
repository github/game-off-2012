/*
  Flod 4.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod 4.0 - 2012/03/31

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

  public final class S2Player extends AmigaPlayer {
    private var
      tracks      : Vector.<S2Step>,
      patterns    : Vector.<SMRow>,
      instruments : Vector.<S2Instrument>,
      samples     : Vector.<S2Sample>,
      arpeggios   : Vector.<int>,
      vibratos    : Vector.<int>,
      waves       : Vector.<int>,
      length      : int,
      speedDef    : int,
      voices      : Vector.<S2Voice>,
      trackPos    : int,
      patternPos  : int,
      patternLen  : int,
      arpeggioFx  : Vector.<int>,
      arpeggioPos : int;

    public function S2Player(amiga:Amiga = null) {
      super(amiga);
      PERIODS.fixed = true;

      arpeggioFx = new Vector.<int>(4, true);
      voices     = new Vector.<S2Voice>(4, true);

      voices[0] = new S2Voice(0);
      voices[0].next = voices[1] = new S2Voice(1);
      voices[1].next = voices[2] = new S2Voice(2);
      voices[2].next = voices[3] = new S2Voice(3);
    }

    override public function process():void {
      var chan:AmigaChannel, instr:S2Instrument, row:SMRow, sample:S2Sample, value:int, voice:S2Voice = voices[0];
      arpeggioPos = ++arpeggioPos & 3;

      if (++tick >= speed) {
        tick = 0;

        while (voice) {
          chan = voice.channel;
          voice.enabled = voice.note = 0;

          if (!patternPos) {
            voice.step    = tracks[int(trackPos + voice.index * length)];
            voice.pattern = voice.step.pattern;
            voice.speed   = 0;
          }
          if (--voice.speed < 0) {
            voice.row   = row = patterns[voice.pattern++];
            voice.speed = row.speed;

            if (row.note) {
              voice.enabled = 1;
              voice.note    = row.note + voice.step.transpose;
              chan.enabled  = 0;
            }
          }
          voice.pitchBend = 0;

          if (voice.note) {
            voice.waveCtr      = voice.sustainCtr     = 0;
            voice.arpeggioCtr  = voice.arpeggioPos    = 0;
            voice.vibratoCtr   = voice.vibratoPos     = 0;
            voice.pitchBendCtr = voice.noteSlideSpeed = 0;
            voice.adsrPos = 4;
            voice.volume  = 0;

            if (row.sample) {
              voice.instrument = row.sample;
              voice.instr  = instruments[int(voice.instrument + voice.step.soundTranspose)];
              voice.sample = samples[waves[voice.instr.wave]];
            }
            voice.original = voice.note + arpeggios[voice.instr.arpeggio];
            chan.period    = voice.period = PERIODS[voice.original];

            sample = voice.sample;
            chan.pointer = sample.pointer;
            chan.length  = sample.length;
            chan.enabled = voice.enabled;
            chan.pointer = sample.loopPtr;
            chan.length  = sample.repeat;
          }
          voice = voice.next;
        }

        if (++patternPos == patternLen) {
          patternPos = 0;

          if (++trackPos == length) {
            trackPos = 0;
            amiga.complete = 1;
          }
        }
      }
      voice = voices[0];

      while (voice) {
        if (!voice.sample) {
          voice = voice.next;
          continue;
        }
        chan   = voice.channel;
        sample = voice.sample;

        if (sample.negToggle) {
          voice = voice.next;
          continue;
        }
        sample.negToggle = 1;

        if (sample.negCtr) {
          sample.negCtr = --sample.negCtr & 31;
        } else {
          sample.negCtr = sample.negSpeed;
          if (!sample.negDir) {
            voice = voice.next;
            continue;
          }

          value = sample.negStart + sample.negPos;
          amiga.memory[value] = ~amiga.memory[value];
          sample.negPos += sample.negOffset;
          value = sample.negLen - 1;

          if (sample.negPos < 0) {
            if (sample.negDir == 2) {
              sample.negPos = value;
            } else {
              sample.negOffset = -sample.negOffset;
              sample.negPos += sample.negOffset;
            }
          } else if (value < sample.negPos) {
            if (sample.negDir == 1) {
              sample.negPos = 0;
            } else {
              sample.negOffset = -sample.negOffset;
              sample.negPos += sample.negOffset;
            }
          }
        }
        voice = voice.next;
      }
      voice = voices[0];

      while (voice) {
        if (!voice.sample) {
          voice = voice.next;
          continue;
        }
        voice.sample.negToggle = 0;
        voice = voice.next;
      }
      voice = voices[0];

      while (voice) {
        chan  = voice.channel;
        instr = voice.instr;

        switch (voice.adsrPos) {
          case 0:
            break;
          case 4:   //attack
            voice.volume += instr.attackSpeed;
            if (instr.attackMax <= voice.volume) {
              voice.volume = instr.attackMax;
              voice.adsrPos--;
            }
            break;
          case 3:   //decay
            if (!instr.decaySpeed) {
              voice.adsrPos--;
            } else {
              voice.volume -= instr.decaySpeed;
              if (instr.decayMin >= voice.volume) {
                voice.volume = instr.decayMin;
                voice.adsrPos--;
              }
            }
            break;
          case 2:   //sustain
            if (voice.sustainCtr == instr.sustain) voice.adsrPos--;
              else voice.sustainCtr++;
            break;
          case 1:   //release
            voice.volume -= instr.releaseSpeed;
            if (instr.releaseMin >= voice.volume) {
              voice.volume = instr.releaseMin;
              voice.adsrPos--;
            }
            break;
        }
        chan.volume = voice.volume >> 2;

        if (instr.waveLen) {
          if (voice.waveCtr == instr.waveDelay) {
            voice.waveCtr = instr.waveDelay - instr.waveSpeed;
            if (voice.wavePos == instr.waveLen) voice.wavePos = 0;
              else voice.wavePos++;

            voice.sample = sample = samples[waves[int(instr.wave + voice.wavePos)]];
            chan.pointer = sample.pointer;
            chan.length  = sample.length;
          } else
            voice.waveCtr++;
        }

        if (instr.arpeggioLen) {
          if (voice.arpeggioCtr == instr.arpeggioDelay) {
            voice.arpeggioCtr = instr.arpeggioDelay - instr.arpeggioSpeed;
            if (voice.arpeggioPos == instr.arpeggioLen) voice.arpeggioPos = 0;
              else voice.arpeggioPos++;

            value = voice.original + arpeggios[int(instr.arpeggio + voice.arpeggioPos)];
            voice.period = PERIODS[value];
          } else
            voice.arpeggioCtr++;
        }
        row = voice.row;

        if (tick) {
          switch (row.effect) {
            case 0:
              break;
            case 0x70:  //arpeggio
              arpeggioFx[0] = row.param >> 4;
              arpeggioFx[2] = row.param & 15;
              value = voice.original + arpeggioFx[arpeggioPos];
              voice.period = PERIODS[value];
              break;
            case 0x71:  //pitch up
              voice.pitchBend = -row.param;
              break;
            case 0x72:  //pitch down
              voice.pitchBend = row.param;
              break;
            case 0x73:  //volume up
              if (voice.adsrPos != 0) break;
              if (voice.instrument != 0) voice.volume = instr.attackMax;
              voice.volume += row.param << 2;
              if (voice.volume >= 256) voice.volume = -1;
              break;
            case 0x74:  //volume down
              if (voice.adsrPos != 0) break;
              if (voice.instrument != 0) voice.volume = instr.attackMax;
              voice.volume -= row.param << 2;
              if (voice.volume < 0) voice.volume = 0;
              break;
          }
        }

        switch (row.effect) {
          case 0:
            break;
          case 0x75:  //set adsr attack
            instr.attackMax   = row.param;
            instr.attackSpeed = row.param;
            break;
          case 0x76:  //set pattern length
            patternLen = row.param;
            break;
          case 0x7c:  //set volume
            chan.volume  = row.param;
            voice.volume = row.param << 2;
            if (voice.volume >= 255) voice.volume = 255;
            break;
          case 0x7f:  //set speed
            value = row.param & 15;
            if (value) speed = value;
            break;
        }

        if (instr.vibratoLen) {
          if (voice.vibratoCtr == instr.vibratoDelay) {
            voice.vibratoCtr = instr.vibratoDelay - instr.vibratoSpeed;
            if (voice.vibratoPos == instr.vibratoLen) voice.vibratoPos = 0;
              else voice.vibratoPos++;

            voice.period += vibratos[int(instr.vibrato + voice.vibratoPos)];
          } else
            voice.vibratoCtr++;
        }

        if (instr.pitchBend) {
          if (voice.pitchBendCtr == instr.pitchBendDelay) {
            voice.pitchBend += instr.pitchBend;
          } else
            voice.pitchBendCtr++;
        }

        if (row.param) {
          if (row.effect && row.effect < 0x70) {
            voice.noteSlideTo = PERIODS[int(row.effect + voice.step.transpose)];
            value = row.param;
            if ((voice.noteSlideTo - voice.period) < 0) value = -value;
            voice.noteSlideSpeed = value;
          }
        }

        if (voice.noteSlideTo && voice.noteSlideSpeed) {
          voice.period += voice.noteSlideSpeed;

          if ((voice.noteSlideSpeed < 0 && voice.period < voice.noteSlideTo) ||
              (voice.noteSlideSpeed > 0 && voice.period > voice.noteSlideTo)) {
            voice.noteSlideSpeed = 0;
            voice.period = voice.noteSlideTo;
          }
        }

        voice.period += voice.pitchBend;

        if (voice.period < 95) voice.period = 95;
          else if (voice.period > 5760) voice.period = 5760;

        chan.period = voice.period;
        voice = voice.next;
      }
    }

    override protected function initialize():void {
      var voice:S2Voice = voices[0];
      super.initialize();

      speed      = speedDef;
      tick       = speedDef;
      trackPos   = 0;
      patternPos = 0;
      patternLen = 64;

      while (voice) {
        voice.initialize();
        voice.channel = amiga.channels[voice.index];
        voice.instr   = instruments[0];

        arpeggioFx[voice.index] = 0;
        voice = voice.next;
      }
    }

    override protected function loader(stream:ByteArray):void {
      var higher:int, i:int = 0, id:String, instr:S2Instrument, j:int, len:int, pointers:Vector.<int>, position:int, pos:int, row:SMRow, step:S2Step, sample:S2Sample, sampleData:int, value:int;
      stream.position = 58;
      id = stream.readMultiByte(28, ENCODING);
      if (id != "SIDMON II - THE MIDI VERSION") return;

      stream.position = 2;
      length   = stream.readUnsignedByte();
      speedDef = stream.readUnsignedByte();
      samples  = new Vector.<S2Sample>(stream.readUnsignedShort() >> 6, true);

      stream.position = 14;
      len = stream.readUnsignedInt();
      tracks = new Vector.<S2Step>(len, true);
      stream.position = 90;

      for (; i < len; ++i) {
        step = new S2Step();
        step.pattern = stream.readUnsignedByte();
        if (step.pattern > higher) higher = step.pattern;
        tracks[i] = step;
      }

      for (i = 0; i < len; ++i) {
        step = tracks[i];
        step.transpose = stream.readByte();
      }

      for (i = 0; i < len; ++i) {
        step = tracks[i];
        step.soundTranspose = stream.readByte();
      }

      position = stream.position;
      stream.position = 26;
      len = stream.readUnsignedInt() >> 5;
      instruments = new Vector.<S2Instrument>(++len, true);
      stream.position = position;

      instruments[0] = new S2Instrument();

      for (i = 0; ++i < len;) {
        instr = new S2Instrument();
        instr.wave           = stream.readUnsignedByte() << 4;
        instr.waveLen        = stream.readUnsignedByte();
        instr.waveSpeed      = stream.readUnsignedByte();
        instr.waveDelay      = stream.readUnsignedByte();
        instr.arpeggio       = stream.readUnsignedByte() << 4;
        instr.arpeggioLen    = stream.readUnsignedByte();
        instr.arpeggioSpeed  = stream.readUnsignedByte();
        instr.arpeggioDelay  = stream.readUnsignedByte();
        instr.vibrato        = stream.readUnsignedByte() << 4;
        instr.vibratoLen     = stream.readUnsignedByte();
        instr.vibratoSpeed   = stream.readUnsignedByte();
        instr.vibratoDelay   = stream.readUnsignedByte();
        instr.pitchBend      = stream.readByte();
        instr.pitchBendDelay = stream.readUnsignedByte();
        stream.readByte();
        stream.readByte();
        instr.attackMax      = stream.readUnsignedByte();
        instr.attackSpeed    = stream.readUnsignedByte();
        instr.decayMin       = stream.readUnsignedByte();
        instr.decaySpeed     = stream.readUnsignedByte();
        instr.sustain        = stream.readUnsignedByte();
        instr.releaseMin     = stream.readUnsignedByte();
        instr.releaseSpeed   = stream.readUnsignedByte();
        instruments[i] = instr;
        stream.position += 9;
      }

      position = stream.position;
      stream.position = 30;
      len = stream.readUnsignedInt();
      waves = new Vector.<int>(len, true);
      stream.position = position;

      for (i = 0; i < len; ++i) waves[i] = stream.readUnsignedByte();

      position = stream.position;
      stream.position = 34;
      len = stream.readUnsignedInt();
      arpeggios = new Vector.<int>(len, true);
      stream.position = position;

      for (i = 0; i < len; ++i) arpeggios[i] = stream.readByte();

      position = stream.position;
      stream.position = 38;
      len = stream.readUnsignedInt();
      vibratos = new Vector.<int>(len, true);
      stream.position = position;

      for (i = 0; i < len; ++i) vibratos[i] = stream.readByte();

      len = samples.length;
      position = 0;

      for (i = 0; i < len; ++i) {
        sample = new S2Sample();
        stream.readUnsignedInt();
        sample.length    = stream.readUnsignedShort() << 1;
        sample.loop      = stream.readUnsignedShort() << 1;
        sample.repeat    = stream.readUnsignedShort() << 1;
        sample.negStart  = position + (stream.readUnsignedShort() << 1);
        sample.negLen    = stream.readUnsignedShort() << 1;
        sample.negSpeed  = stream.readUnsignedShort();
        sample.negDir    = stream.readUnsignedShort();
        sample.negOffset = stream.readShort();
        sample.negPos    = stream.readUnsignedInt();
        sample.negCtr    = stream.readUnsignedShort();
        stream.position += 6;
        sample.name      = stream.readMultiByte(32, ENCODING);

        sample.pointer = position;
        sample.loopPtr = position + sample.loop;
        position += sample.length;
        samples[i] = sample;
      }

      sampleData = position;
      len = ++higher;
      pointers = new Vector.<int>(++higher, true);
      for (i = 0; i < len; ++i) pointers[i] = stream.readUnsignedShort();

      position = stream.position;
      stream.position = 50;
      len = stream.readUnsignedInt();
      patterns = new Vector.<SMRow>();
      stream.position = position;
      j = 1;

      for (i = 0; i < len; ++i) {
        row   = new SMRow();
        value = stream.readByte();

        if (!value) {
          row.effect = stream.readByte();
          row.param  = stream.readUnsignedByte();
          i += 2;
        } else if (value < 0) {
          row.speed = ~value;
        } else if (value < 112) {
          row.note = value;
          value = stream.readByte();
          i++;

          if (value < 0) {
            row.speed = ~value;
          } else if (value < 112) {
            row.sample = value;
            value = stream.readByte();
            i++;

            if (value < 0) {
              row.speed = ~value;
            } else {
              row.effect = value;
              row.param  = stream.readUnsignedByte();
              i++;
            }
          } else {
            row.effect = value;
            row.param  = stream.readUnsignedByte();
            i++;
          }
        } else {
          row.effect = value;
          row.param  = stream.readUnsignedByte();
          i++;
        }

        patterns[pos++] = row;
        if ((position + pointers[j]) == stream.position) pointers[j++] = pos;
      }
      pointers[j] = patterns.length;
      patterns.fixed = true;

      if ((stream.position & 1) != 0) stream.position++;
      amiga.store(stream, sampleData);
      len = tracks.length;

      for (i = 0; i < len; ++i) {
        step = tracks[i];
        step.pattern = pointers[step.pattern];
      }

      length++;
      version = 2;
    }

    private const
      PERIODS: Vector.<int> = Vector.<int>([0,
        5760,5424,5120,4832,4560,4304,4064,3840,3616,3424,3232,3048,
        2880,2712,2560,2416,2280,2152,2032,1920,1808,1712,1616,1524,
        1440,1356,1280,1208,1140,1076,1016, 960, 904, 856, 808, 762,
         720, 678, 640, 604, 570, 538, 508, 480, 453, 428, 404, 381,
         360, 339, 320, 302, 285, 269, 254, 240, 226, 214, 202, 190,
         180, 170, 160, 151, 143, 135, 127, 120, 113, 107, 101,  95]);
  }
}