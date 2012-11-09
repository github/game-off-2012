/*
  Flod 4.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod 4.0 - 2012/03/24

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
package neoart.flod.whittaker {
  import flash.utils.*;
  import neoart.flod.core.*;

  public final class DWPlayer extends AmigaPlayer {
    private var
      songs         : Vector.<DWSong>,
      samples       : Vector.<DWSample>,
      stream        : ByteArray,
      song          : DWSong,
      songvol       : int,
      master        : int,
      periods       : int,
      frqseqs       : int,
      volseqs       : int,
      transpose     : int,
      slower        : int,
      slowerCounter : int,
      delaySpeed    : int,
      delayCounter  : int,
      fadeSpeed     : int,
      fadeCounter   : int,
      wave          : DWSample,
      waveCenter    : int,
      waveLo        : int,
      waveHi        : int,
      waveDir       : int,
      waveLen       : int,
      wavePos       : int,
      waveRateNeg   : int,
      waveRatePos   : int,
      voices        : Vector.<DWVoice>,
      active        : int,
      complete      : int,
      base          : int,
      com2          : int,
      com3          : int,
      com4          : int,
      readMix       : String,
      readLen       : int;

    public function DWPlayer(amiga:Amiga = null) {
      super(amiga);
      voices = new Vector.<DWVoice>(4, true);

      voices[0] = new DWVoice(0,1);
      voices[1] = new DWVoice(1,2);
      voices[2] = new DWVoice(2,4);
      voices[3] = new DWVoice(3,8);
    }

    override public function process():void {
      var chan:AmigaChannel, loop:int, pos:int, sample:DWSample, value:int, voice:DWVoice = voices[active], volume:int;

      if (slower) {
        if (--slowerCounter == 0) {
          slowerCounter = 6;
          return;
        }
      }

      if ((delayCounter += delaySpeed) > 255) {
        delayCounter -= 256;
        return;
      }

      if (fadeSpeed) {
        if (--fadeCounter == 0) {
          fadeCounter = fadeSpeed;
          songvol--;
        }

        if (!songvol) {
          if (!loopSong) {
            amiga.complete = 1;
            return;
          } else {
            initialize();
          }
        }
      }

      if (wave) {
        if (waveDir) {
          amiga.memory[wavePos++] = waveRatePos;
          if (waveLen > 1) amiga.memory[wavePos++] = waveRatePos;
          if ((wavePos -= (waveLen << 1)) == waveLo) waveDir = 0;
        } else {
          amiga.memory[wavePos++] = waveRateNeg;
          if (waveLen > 1) amiga.memory[wavePos++] = waveRateNeg;
          if (wavePos == waveHi) waveDir = 1;
        }
      }

      while (voice) {
        chan = voice.channel;
        stream.position = voice.patternPos;
        sample = voice.sample;

        if (!voice.busy) {
          voice.busy = 1;

          if (sample.loopPtr < 0) {
            chan.pointer = amiga.loopPtr;
            chan.length  = amiga.loopLen;
          } else {
            chan.pointer = sample.pointer + sample.loopPtr;
            chan.length  = sample.length  - sample.loopPtr;
          }
        }

        if (--voice.tick == 0) {
          voice.flags = 0;
          loop = 1;

          while (loop > 0) {
            value = stream.readByte();

            if (value < 0) {
              if (value >= -32) {
                voice.speed = speed * (value + 33);
              } else if (value >= com2) {
                value -= com2;
                voice.sample = sample = samples[value];
              } else if (value >= com3) {
                pos = stream.position;

                stream.position = volseqs + ((value - com3) << 1);
                stream.position = base + stream.readUnsignedShort();
                voice.volseqPtr = stream.position;

                stream.position--;
                voice.volseqSpeed = stream.readUnsignedByte();

                stream.position = pos;
              } else if (value >= com4) {
                pos = stream.position;

                stream.position = frqseqs + ((value - com4) << 1);
                voice.frqseqPtr = base + stream.readUnsignedShort();
                voice.frqseqPos = voice.frqseqPtr;

                stream.position = pos;
              } else {
                switch (value) {
                  case -128:
                    stream.position = voice.trackPtr + voice.trackPos;
                    value = stream[readMix]();

                    if (value) {
                      stream.position = base + value;
                      voice.trackPos += readLen;
                    } else {
                      stream.position = voice.trackPtr;
                      stream.position = base + stream[readMix]();
                      voice.trackPos = readLen;

                      if (!loopSong) {
                        complete &= ~(voice.bitFlag);
                        if (!complete) amiga.complete = 1;
                      }
                    }
                    break;
                  case -127:
                    if (variant > 0) voice.portaDelta = 0;
                    voice.portaSpeed = stream.readByte();
                    voice.portaDelay = stream.readUnsignedByte();
                    voice.flags |= 2;
                    break;
                  case -126:
                    voice.tick = voice.speed;
                    voice.patternPos = stream.position;

                    if (variant == 41) {
                      voice.busy = 1;
                      chan.enabled = 0;
                    } else {
                      chan.pointer = amiga.loopPtr;
                      chan.length  = amiga.loopLen;
                    }

                    loop = 0;
                    break;
                  case -125:
                    if (variant > 0) {
                      voice.tick = voice.speed;
                      voice.patternPos = stream.position;
                      chan.enabled = 1;
                      loop = 0;
                    }
                    break;
                  case -124:
                    amiga.complete = 1;
                    break;
                  case -123:
                    if (variant > 0) transpose = stream.readByte();
                    break;
                  case -122:
                    voice.vibrato = -1;
                    voice.vibratoSpeed = stream.readUnsignedByte();
                    voice.vibratoDepth = stream.readUnsignedByte();
                    voice.vibratoDelta = 0;
                    break;
                  case -121:
                    voice.vibrato = 0;
                    break;
                  case -120:
                    if (variant == 21) {
                      voice.halve = 1;
                    } else if (variant == 11) {
                      fadeSpeed = stream.readUnsignedByte();
                    } else {
                      voice.transpose = stream.readByte();
                    }
                    break;
                  case -119:
                    if (variant == 21) {
                      voice.halve = 0;
                    } else {
                      voice.trackPtr = base + stream.readUnsignedShort();
                      voice.trackPos = 0;
                    }
                    break;
                  case -118:
                    if (variant == 31) {
                      delaySpeed = stream.readUnsignedByte();
                    } else {
                      speed = stream.readUnsignedByte();
                    }
                    break;
                  case -117:
                    fadeSpeed = stream.readUnsignedByte();
                    fadeCounter = fadeSpeed;
                    break;
                  case -116:
                    value = stream.readUnsignedByte();
                    if (variant != 32) songvol = value;
                    break;
                }
              }
            } else {
              voice.patternPos = stream.position;
              voice.note = (value += sample.finetune);
              voice.tick = voice.speed;
              voice.busy = 0;

              if (variant >= 20) {
                value = (value + transpose + voice.transpose) & 0xff;
                stream.position = voice.volseqPtr;
                volume = stream.readUnsignedByte();

                voice.volseqPos = stream.position;
                voice.volseqCounter = voice.volseqSpeed;

                if (voice.halve) volume >>= 1;
                volume = (volume * songvol) >> 6;
              } else {
                volume = sample.volume;
              }

              chan.pointer = sample.pointer;
              chan.length  = sample.length;
              chan.volume  = volume;

              stream.position = periods + (value << 1);
              value = (stream.readUnsignedShort() * sample.relative) >> 10;
              if (variant < 10) voice.portaDelta = value;

              chan.period  = value;
              chan.enabled = 1;
              loop = 0;
            }
          }
        } else if (voice.tick == 1) {
          if (variant < 30) {
            chan.enabled = 0;
          } else {
            value = stream.readUnsignedByte();

            if (value != 131) {
              if (variant < 40 || value < 224 || (stream.readUnsignedByte() != 131))
                chan.enabled = 0;
            }
          }
        } else if (variant == 0) {
          if (voice.flags & 2) {
            if (voice.portaDelay) {
              voice.portaDelay--;
            } else {
              voice.portaDelta -= voice.portaSpeed;
              chan.period = voice.portaDelta;
            }
          }
        } else {
          stream.position = voice.frqseqPos;
          value = stream.readByte();

          if (value < 0) {
            value &= 0x7f;
            stream.position = voice.frqseqPtr;
          }

          voice.frqseqPos = stream.position;

          value = (value + voice.note + transpose + voice.transpose) & 0xff;
          stream.position = periods + (value << 1);
          value = (stream.readUnsignedShort() * sample.relative) >> 10;

          if (voice.flags & 2) {
            if (voice.portaDelay) {
              voice.portaDelay--;
            } else {
              voice.portaDelta += voice.portaSpeed;
              value -= voice.portaDelta;
            }
          }

          if (voice.vibrato) {
            if (voice.vibrato > 0) {
              voice.vibratoDelta -= voice.vibratoSpeed;
              if (!voice.vibratoDelta) voice.vibrato ^= 0x80000000;
            } else {
              voice.vibratoDelta += voice.vibratoSpeed;
              if (voice.vibratoDelta == voice.vibratoDepth) voice.vibrato ^= 0x80000000;
            }

            if (!voice.vibratoDelta) voice.vibrato ^= 1;

            if (voice.vibrato & 1) {
              value += voice.vibratoDelta;
            } else {
              value -= voice.vibratoDelta;
            }
          }

          chan.period = value;

          if (variant >= 20) {
            if (--voice.volseqCounter < 0) {
              stream.position = voice.volseqPos;
              volume = stream.readByte();

              if (volume >= 0) voice.volseqPos = stream.position;
              voice.volseqCounter = voice.volseqSpeed;
              volume &= 0x7f;

              if (voice.halve) volume >>= 1;
              chan.volume = (volume * songvol) >> 6;
            }
          }
        }

        voice = voice.next;
      }
    }

    override protected function initialize():void {
      var i:int, len:int, voice:DWVoice = voices[active];
      super.initialize();

      song    = songs[playSong];
      songvol = master;
      speed   = song.speed;

      transpose     = 0;
      slowerCounter = 6;
      delaySpeed    = song.delay;
      delayCounter  = 0;
      fadeSpeed     = 0;
      fadeCounter   = 0;

      if (wave) {
        waveDir = 0;
        wavePos = wave.pointer + waveCenter;
        i = wave.pointer;

        len = wavePos;
        for (; i < len; ++i) amiga.memory[i] = waveRateNeg;

        len += waveCenter;
        for (; i < len; ++i) amiga.memory[i] = waveRatePos;
      }

      while (voice) {
        voice.initialize();
        voice.channel = amiga.channels[voice.index];
        voice.sample  = samples[0];
        complete += voice.bitFlag;

        voice.trackPtr   = song.tracks[voice.index];
        voice.trackPos   = readLen;
        stream.position  = voice.trackPtr;
        voice.patternPos = base + stream[readMix]();

        if (frqseqs) {
          stream.position = frqseqs;
          voice.frqseqPtr = base + stream.readUnsignedShort();
          voice.frqseqPos = voice.frqseqPtr;
        }

        voice = voice.next;
      }
    }

    override protected function loader(stream:ByteArray):void {
      var flag:int, headers:int, i:int, index:int, info:int, lower:int, pos:int, sample:DWSample, size:int = 10, song:DWSong, total:int, value:int;

      master  = 64;
      readMix = "readUnsignedShort";
      readLen = 2;
      variant = 0;

      if (stream.readUnsignedShort() == 0x48e7) {                               //movem.l
        stream.position = 4;
        if (stream.readUnsignedShort() != 0x6100) return;                       //bsr.w

        stream.position += stream.readUnsignedShort();
        variant = 30;
      } else {
        stream.position = 0;
      }

      while (value != 0x4e75) {                                                 //rts
        value = stream.readUnsignedShort();

        switch (value) {
          case 0x47fa:                                                          //lea x,a3
            base = stream.position + stream.readShort();
            break;
          case 0x6100:                                                          //bsr.w
            stream.position += 2;
            info = stream.position;

            if (stream.readUnsignedShort() == 0x6100)                           //bsr.w
              info = stream.position + stream.readUnsignedShort();
            break;
          case 0xc0fc:                                                          //mulu.w #x,d0
            size = stream.readUnsignedShort();

            if (size == 18) {
              readMix = "readUnsignedInt";
              readLen = 4;
            } else {
              variant = 10;
            }

            if (stream.readUnsignedShort() == 0x41fa)
              headers = stream.position + stream.readUnsignedShort();

            if (stream.readUnsignedShort() == 0x1230) flag = 1;
            break;
          case 0x1230:                                                          //move.b (a0,d0.w),d1
            stream.position -= 6;

            if (stream.readUnsignedShort() == 0x41fa) {
              headers = stream.position + stream.readUnsignedShort();
              flag = 1;
            }

            stream.position += 4;
            break;
          case 0xbe7c:                                                          //cmp.w #x,d7
            channels = stream.readUnsignedShort();
            stream.position += 2;

            if (stream.readUnsignedShort() == 0x377c)
              master = stream.readUnsignedShort();
            break;
        }

        if (stream.bytesAvailable < 20) return;
      }

      index = stream.position;
      songs = new Vector.<DWSong>();
      lower = 0x7fffffff;
      total = 0;
      stream.position = headers;

      while (1) {
        song = new DWSong();
        song.tracks = new Vector.<int>(channels, true);

        if (flag) {
          song.speed = stream.readUnsignedByte();
          song.delay = stream.readUnsignedByte();
        } else {
          song.speed = stream.readUnsignedShort();
        }

        if (song.speed > 255) break;

        for (i = 0; i < channels; ++i) {
          value = base + stream[readMix]();
          if (value < lower) lower = value;
          song.tracks[i] = value;
        }

        songs[total++] = song;
        if ((lower - stream.position) < size) break;
      }

      if (!total) return;
      songs.fixed = true;
      lastSong = songs.length - 1;

      stream.position = info;
      if (stream.readUnsignedShort() != 0x4a2b) return;                         //tst.b x(a3)
      headers = size = 0;
      wave = null;

      while (value != 0x4e75) {                                                 //rts
        value = stream.readUnsignedShort();

        switch (value) {
          case 0x4bfa:
            if (headers) break;
            info = stream.position + stream.readShort();
            stream.position++;
            total = stream.readUnsignedByte();

            stream.position -= 10;
            value = stream.readUnsignedShort();
            pos = stream.position;

            if (value == 0x41fa || value == 0x207a) {                           //lea x,a0 | movea.l x,a0
              headers = stream.position + stream.readUnsignedShort();
            } else if (value == 0xd0fc) {                                       //adda.w #x,a0
              headers = (64 + stream.readUnsignedShort());
              stream.position -= 18;
              headers += (stream.position + stream.readUnsignedShort());
            }

            stream.position = pos;
            break;
          case 0x84c3:                                                          //divu.w d3,d2
            if (size) break;
            stream.position += 4;
            value = stream.readUnsignedShort();

            if (value == 0xdafc) {                                              //adda.w #x,a5
              size = stream.readUnsignedShort();
            } else if (value == 0xdbfc) {                                       //adda.l #x,a5
              size = stream.readUnsignedInt();
            }

            if (size == 12 && variant < 30) variant = 20;

            pos = stream.position;
            samples = new Vector.<DWSample>(++total, true);
            stream.position = headers;

            for (i = 0; i < total; ++i) {
              sample = new DWSample();
              sample.length   = stream.readUnsignedInt();
              sample.relative = 3579545 / stream.readUnsignedShort();
              sample.pointer  = amiga.store(stream, sample.length);

              value = stream.position;
              stream.position = info + (i * size) + 4;
              sample.loopPtr = stream.readInt();

              if (variant == 0) {
                stream.position += 6;
                sample.volume = stream.readUnsignedShort();
              } else if (variant == 10) {
                stream.position += 4;
                sample.volume = stream.readUnsignedShort();
                sample.finetune = stream.readByte();
              }

              stream.position = value;
              samples[i] = sample;
            }

            amiga.loopLen = 64;
            stream.length = headers;
            stream.position = pos;
            break;
          case 0x207a:                                                          //movea.l x,a0
            value = stream.position + stream.readShort();

            if (stream.readUnsignedShort() != 0x323c) {                         //move.w #x,d1
              stream.position -= 2;
              break;
            }

            wave = samples[int((value - info) / size)];
            waveCenter = (stream.readUnsignedShort() + 1) << 1;

            stream.position += 2;
            waveRateNeg = stream.readByte();
            stream.position += 12;
            waveRatePos = stream.readByte();
            break;
          case 0x046b:                                                          //subi.w #x,x(a3)
          case 0x066b:                                                          //addi.w #x,x(a3)
            total = stream.readUnsignedShort();
            sample = samples[int((stream.readUnsignedShort() - info) / size)];

            if (value == 0x066b) {
              sample.relative += total;
            } else {
              sample.relative -= total;
            }
            break;
        }
      }

      if (!samples.length) return;
      stream.position = index;

      periods = 0;
      frqseqs = 0;
      volseqs = 0;
      slower  = 0;

      com2 = 0xb0;
      com3 = 0xa0;
      com4 = 0x90;

      while (stream.bytesAvailable > 16) {
        value = stream.readUnsignedShort();

        switch (value) {
          case 0x47fa:                                                          //lea x,a3
            stream.position += 2;
            if (stream.readUnsignedShort() != 0x4a2b) break;                    //tst.b x(a3)

            pos = stream.position;
            stream.position += 4;
            value = stream.readUnsignedShort();

            if (value == 0x103a) {                                              //move.b x,d0
              stream.position += 4;

              if (stream.readUnsignedShort() == 0xc0fc) {                       //mulu.w #x,d0
                value = stream.readUnsignedShort();
                total = songs.length;
                for (i = 0; i < total; ++i) songs[i].delay *= value;
                stream.position += 6;
              }
            } else if (value == 0x532b) {                                       //subq.b #x,x(a3)
              stream.position -= 8;
            }

            value = stream.readUnsignedShort();

            if (value == 0x4a2b) {                                              //tst.b x(a3)
              stream.position = base + stream.readUnsignedShort();
              slower = stream.readByte();
            }

            stream.position = pos;
            break;
          case 0x0c6b:                                                          //cmpi.w #x,x(a3)
            stream.position -= 6;
            value = stream.readUnsignedShort();

            if (value == 0x546b || value == 0x526b) {                           //addq.w #2,x(a3) | addq.w #1,x(a3)
              stream.position += 4;
              waveHi = wave.pointer + stream.readUnsignedShort();
            } else if (value == 0x556b || value == 0x536b) {                    //subq.w #2,x(a3) | subq.w #1,x(a3)
              stream.position += 4;
              waveLo = wave.pointer + stream.readUnsignedShort();
            }

            waveLen = (value < 0x546b) ? 1 : 2;
            break;
          case 0x7e00:                                                          //moveq #0,d7
          case 0x7e01:                                                          //moveq #1,d7
          case 0x7e02:                                                          //moveq #2,d7
          case 0x7e03:                                                          //moveq #3,d7
            active = value & 0xf;
            total = channels - 1;

            if (active) {
              voices[0].next = null;
              for (i = total; i > 0;) voices[i].next = voices[--i];
            } else {
              voices[total].next = null;
              for (i = 0; i < total;) voices[i].next = voices[++i];
            }
            break;
          case 0x0c68:                                                          //cmpi.w #x,x(a0)
            stream.position += 22;
            if (stream.readUnsignedShort() == 0x0c11) variant = 40;
            break;
          case 0x322d:                                                          //move.w x(a5),d1
            pos = stream.position;
            value = stream.readUnsignedShort();

            if (value == 0x000a || value == 0x000c) {                           //10 | 12
              stream.position -= 8;

              if (stream.readUnsignedShort() == 0x45fa)                         //lea x,a2
                periods = stream.position + stream.readUnsignedShort();
            }

            stream.position = pos + 2;
            break;
          case 0x0400:                                                          //subi.b #x,d0
          case 0x0440:                                                          //subi.w #x,d0
          case 0x0600:                                                          //addi.b #x,d0
            value = stream.readUnsignedShort();

            if (value == 0x00c0 || value == 0x0040) {                           //192 | 64
              com2 = 0xc0;
              com3 = 0xb0;
              com4 = 0xa0;
            } else if (value == com3) {
              stream.position += 2;

              if (stream.readUnsignedShort() == 0x45fa) {                       //lea x,a2
                volseqs = stream.position + stream.readUnsignedShort();
                if (variant < 40) variant = 30;
              }
            } else if (value == com4) {
              stream.position += 2;

              if (stream.readUnsignedShort() == 0x45fa)                         //lea x,a2
                frqseqs = stream.position + stream.readUnsignedShort();
            }
            break;
          case 0x4ef3:                                                          //jmp (a3,a2.w)
            stream.position += 2;
          case 0x4ed2:                                                          //jmp a2
            lower = stream.position;
            stream.position -= 10;
            stream.position += stream.readUnsignedShort();
            pos = stream.position;                                              //jump table address

            stream.position = pos + 2;                                          //effect -126
            stream.position = base + stream.readUnsignedShort() + 10;
            if (stream.readUnsignedShort() == 0x4a14) variant = 41;             //tst.b (a4)

            stream.position = pos + 16;                                         //effect -120
            value = base + stream.readUnsignedShort();

            if (value > lower && value < pos) {
              stream.position = value;
              value = stream.readUnsignedShort();

              if (value == 0x50e8) {                                            //st x(a0)
                variant = 21;
              } else if (value == 0x1759) {                                     //move.b (a1)+,x(a3)
                variant = 11;
              }
            }

            stream.position = pos + 20;                                         //effect -118
            value = base + stream.readUnsignedShort();

            if (value > lower && value < pos) {
              stream.position = value + 2;
              if (stream.readUnsignedShort() != 0x4880) variant = 31;           //ext.w d0
            }

            stream.position = pos + 26;                                         //effect -115
            value = stream.readUnsignedShort();
            if (value > lower && value < pos) variant = 32;

            if (frqseqs) stream.position = stream.length;
            break;
        }
      }

      if (!periods) return;
      com2 -= 256;
      com3 -= 256;
      com4 -= 256;

      this.stream = stream;
      version = 1;
    }
  }
}