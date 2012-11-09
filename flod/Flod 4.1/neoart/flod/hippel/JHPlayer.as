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
package neoart.flod.hippel {
  import flash.utils.*;
  import neoart.flod.core.*;

  public final class JHPlayer extends AmigaPlayer {
    private var
      songs       : Vector.<JHSong>,
      samples     : Vector.<AmigaSample>,
      stream      : ByteArray,
      base        : int,
      patterns    : int,
      patternLen  : int,
      periods     : int,
      frqseqs     : int,
      volseqs     : int,
      samplesData : int,
      song        : JHSong,
      voices      : Vector.<JHVoice>,
      coso        : int;

    public function JHPlayer(amiga:Amiga = null) {
      super(amiga);
      voices = new Vector.<JHVoice>(4, true);

      voices[0] = new JHVoice(0);
      voices[0].next = voices[1] = new JHVoice(1);
      voices[1].next = voices[2] = new JHVoice(2);
      voices[2].next = voices[3] = new JHVoice(3);
    }

    override public function process():void {
      var chan:AmigaChannel, loop:int, period:int, pos1:int, pos2:int, sample:AmigaSample, value:int, voice:JHVoice = voices[0];

      if (--tick == 0) {
        tick = speed;

        while (voice) {
          chan = voice.channel;

          if (coso) {
            if (--voice.cosoCounter < 0) {
              voice.cosoCounter = voice.cosoSpeed;

              do {
                stream.position = voice.patternPos;

                do {
                  loop = 0;
                  value = stream.readByte();

                  if (value == -1) {
                    if (voice.trackPos == song.length) {
                      voice.trackPos = 0;
                      amiga.complete = 1;
                    }

                    stream.position = voice.trackPtr + voice.trackPos;
                    value = stream.readUnsignedByte();
                    voice.trackTransp = stream.readByte();
                    pos1 = stream[stream.position];

                    if ((variant > 3) && (pos1 > 127)) {
                      pos2 = (pos1 >> 4) & 15;
                      pos1 &= 15;

                      if (pos2 == 15) {
                        pos2 = 100;

                        if (pos1) {
                          pos2 = (15 - pos1) + 1;
                          pos2 <<= 1;
                          pos1 = pos2;
                          pos2 <<= 1;
                          pos2 += pos1;
                        }

                        voice.volFade = pos2;
                      } else if (pos2 == 8) {
                        amiga.complete = 1;
                      } else if (pos2 == 14) {
                        speed = pos1;
                      }
                    } else {
                      voice.volTransp = stream.readByte();
                    }

                    stream.position = patterns + (value << 1);
                    voice.patternPos = stream.readUnsignedShort();
                    voice.trackPos += 12;
                    loop = 1;
                  } else if (value == -2) {
                    voice.cosoCounter = voice.cosoSpeed = stream.readUnsignedByte();
                    loop = 3;
                  } else if (value == -3) {
                    voice.cosoCounter = voice.cosoSpeed = stream.readUnsignedByte();
                    voice.patternPos = stream.position;
                  } else {
                    voice.note = value;
                    voice.info = stream.readByte();

                    if (voice.info & 224) voice.infoPrev = stream.readByte();

                    voice.patternPos = stream.position;
                    voice.portaDelta = 0;

                    if (value >= 0) {
                      if (variant == 1) chan.enabled = 0;
                      value = (voice.info & 31) + voice.volTransp;
                      stream.position = volseqs + (value << 1);
                      stream.position = stream.readUnsignedShort();

                      voice.volCounter = voice.volSpeed = stream.readUnsignedByte();
                      voice.volSustain = 0;
                      value = stream.readByte();

                      voice.vibSpeed = stream.readByte();
                      voice.vibrato  = 64;
                      voice.vibDepth = voice.vibDelta = stream.readByte();
                      voice.vibDelay = stream.readUnsignedByte();

                      voice.volseqPtr = stream.position;
                      voice.volseqPos = 0;

                      if (value != -128) {
                        if (variant > 1 && (voice.info & 64)) value = voice.infoPrev;
                        stream.position = frqseqs + (value << 1);

                        voice.frqseqPtr = stream.readUnsignedShort();
                        voice.frqseqPos = 0;

                        voice.tick = 0;
                      }
                    }
                  }
                } while (loop > 2);
              } while (loop > 0);
            }
          } else {
            stream.position = voice.patternPtr + voice.patternPos;
            value = stream.readByte();

            if (voice.patternPos == patternLen || (value & 127) == 1) {
              if (voice.trackPos == song.length) {
                voice.trackPos = 0;
                amiga.complete = 1;
              }

              stream.position = voice.trackPtr + voice.trackPos;
              value = stream.readUnsignedByte();
              voice.trackTransp = stream.readByte();
              voice.volTransp = stream.readByte();

              if (voice.volTransp == -128) amiga.complete = 1;

              voice.patternPtr = patterns + (value * patternLen);
              voice.patternPos = 0;
              voice.trackPos += 12;

              stream.position = voice.patternPtr;
              value = stream.readByte();
            }

            if (value & 127) {
              voice.note = value & 127;
              voice.portaDelta = 0;

              pos1 = stream.position;
              if (!voice.patternPos) stream.position += patternLen;
              stream.position -= 2;

              voice.infoPrev = stream.readByte();
              stream.position = pos1;
              voice.info = stream.readByte();

              if (value >= 0) {
                if (variant == 1) chan.enabled = 0;
                value = (voice.info & 31) + voice.volTransp;
                stream.position = volseqs + (value << 6);

                voice.volCounter = voice.volSpeed = stream.readUnsignedByte();
                voice.volSustain = 0;
                value = stream.readByte();

                voice.vibSpeed = stream.readByte();
                voice.vibrato  = 64;
                voice.vibDepth = voice.vibDelta = stream.readByte();
                voice.vibDelay = stream.readUnsignedByte();

                voice.volseqPtr = stream.position;
                voice.volseqPos = 0;

                if (variant > 1 && (voice.info & 64)) value = voice.infoPrev;

                voice.frqseqPtr = frqseqs + (value << 6);
                voice.frqseqPos = 0;

                voice.tick = 0;
              }
            }
            voice.patternPos += 2;
          }
          voice = voice.next;
        }
        voice = voices[0];
      }

      while (voice) {
        chan = voice.channel;
        voice.enabled = 0;

        do {
          loop = 0;

          if (voice.tick) {
            voice.tick--;
          } else {
            stream.position = voice.frqseqPtr + voice.frqseqPos;

            do {
              value = stream.readByte();
              if (value == -31) break;
              loop = 3;

              if (variant == 3 && coso) {
                if (value == -27) {
                  value = -30;
                } else if (value == -26) {
                  value = -28;
                }
              }

              switch (value) {
                case -32:
                  voice.frqseqPos = (stream.readUnsignedByte() & 63);
                  stream.position = voice.frqseqPtr + voice.frqseqPos;
                  break;
                case -30:
                  sample = samples[stream.readUnsignedByte()];
                  voice.sample = -1;

                  voice.loopPtr = sample.loopPtr;
                  voice.repeat  = sample.repeat;
                  voice.enabled = 1;

                  chan.enabled = 0;
                  chan.pointer = sample.pointer;
                  chan.length  = sample.length;

                  voice.volseqPos  = 0;
                  voice.volCounter = 1;
                  voice.slide = 0;
                  voice.frqseqPos += 2;
                  break;
                case -29:
                  voice.vibSpeed = stream.readByte();
                  voice.vibDepth = stream.readByte();
                  voice.frqseqPos += 3;
                  break;
                case -28:
                  sample = samples[stream.readUnsignedByte()];
                  voice.loopPtr = sample.loopPtr;
                  voice.repeat  = sample.repeat;

                  chan.pointer = sample.pointer;
                  chan.length  = sample.length;

                  voice.slide = 0;
                  voice.frqseqPos += 2;
                  break;
                case -27:
                  if (variant < 2) break;
                  sample = samples[stream.readUnsignedByte()];
                  chan.enabled  = 0;
                  voice.enabled = 1;

                  if (variant == 2) {
                    pos1 = stream.readUnsignedByte() * sample.length;

                    voice.loopPtr = sample.loopPtr + pos1;
                    voice.repeat  = sample.repeat;

                    chan.pointer = sample.pointer + pos1;
                    chan.length  = sample.length;

                    voice.frqseqPos += 3;
                  } else {
                    voice.sldPointer = sample.pointer;
                    voice.sldEnd = sample.pointer + sample.length;
                    value = stream.readUnsignedShort();

                    if (value == 0xffff) {
                      voice.sldLoopPtr = sample.length;
                    } else {
                      voice.sldLoopPtr = value << 1;
                    }

                    voice.sldLen     = stream.readUnsignedShort() << 1;
                    voice.sldDelta   = stream.readShort() << 1;
                    voice.sldActive  = 0;
                    voice.sldCounter = 0;
                    voice.sldSpeed   = stream.readUnsignedByte();
                    voice.slide      = 1;
                    voice.sldDone    = 0;

                    voice.frqseqPos += 9;
                  }
                  voice.volseqPos  = 0;
                  voice.volCounter = 1;
                  break;
                case -26:
                  if (variant < 3) break;

                  voice.sldLen     = stream.readUnsignedShort() << 1;
                  voice.sldDelta   = stream.readShort() << 1;
                  voice.sldActive  = 0;
                  voice.sldCounter = 0;
                  voice.sldSpeed   = stream.readUnsignedByte();
                  voice.sldDone    = 0;

                  voice.frqseqPos += 6;
                  break;
                case -25:
                  if (variant == 1) {
                    voice.frqseqPtr = frqseqs + (stream.readUnsignedByte() << 6);
                    voice.frqseqPos = 0;

                    stream.position = voice.frqseqPtr;
                    loop = 3;
                  } else {
                    value = stream.readUnsignedByte();

                    if (value != voice.sample) {
                      sample = samples[value];
                      voice.sample = value;

                      voice.loopPtr = sample.loopPtr;
                      voice.repeat  = sample.repeat;
                      voice.enabled = 1;

                      chan.enabled = 0;
                      chan.pointer = sample.pointer;
                      chan.length  = sample.length;
                    }

                    voice.volseqPos  = 0;
                    voice.volCounter = 1;
                    voice.slide = 0;
                    voice.frqseqPos += 2;
                  }
                  break;
                case -24:
                  voice.tick = stream.readUnsignedByte();
                  voice.frqseqPos += 2;
                  loop = 1;
                  break;
                case -23:
                  if (variant < 2) break;
                  sample = samples[stream.readUnsignedByte()];
                  voice.sample = -1;
                  voice.enabled = 1;

                  pos2 = stream.readUnsignedByte();
                  pos1 = stream.position;
                  chan.enabled = 0;

                  stream.position = samplesData + sample.pointer + 4;
                  value = (stream.readUnsignedShort() * 24) + (stream.readUnsignedShort() << 2);
                  stream.position += (pos2 * 24);

                  voice.loopPtr = stream.readUnsignedInt() & 0xfffffffe;
                  chan.length   = (stream.readUnsignedInt() & 0xfffffffe) - voice.loopPtr;
                  voice.loopPtr += (sample.pointer + value + 8);
                  chan.pointer  = voice.loopPtr;
                  voice.repeat  = 2;

                  stream.position = pos1;
                  pos1 = voice.loopPtr + 1;
                  amiga.memory[pos1] = amiga.memory[voice.loopPtr];

                  voice.volseqPos  = 0;
                  voice.volCounter = 1;
                  voice.slide = 0;
                  voice.frqseqPos += 3;
                  break;
                default:
                  voice.transpose = value;
                  voice.frqseqPos++;
                  loop = 0;
              }
            } while (loop > 2);
          }
        } while (loop > 0);

        if (voice.slide) {
          if (!voice.sldDone) {
            if (--voice.sldCounter < 0) {
              voice.sldCounter = voice.sldSpeed;

              if (voice.sldActive) {
                value = voice.sldLoopPtr + voice.sldDelta;

                if (value < 0) {
                  voice.sldDone = 1;
                  value = voice.sldLoopPtr - voice.sldDelta;
                } else {
                  pos1 = voice.sldPointer + voice.sldLen + value;

                  if (pos1 > voice.sldEnd) {
                    voice.sldDone = 1;
                    value = voice.sldLoopPtr - voice.sldDelta;
                  }
                }
                voice.sldLoopPtr = value;
              } else {
                voice.sldActive = 1;
              }

              voice.loopPtr = voice.sldPointer + voice.sldLoopPtr;
              voice.repeat  = voice.sldLen;
              chan.pointer  = voice.loopPtr;
              chan.length   = voice.repeat;
            }
          }
        }

        do {
          loop = 0;

          if (voice.volSustain) {
            voice.volSustain--;
          } else {
            if (--voice.volCounter) break;
            voice.volCounter = voice.volSpeed;

            do {
              stream.position = voice.volseqPtr + voice.volseqPos;
              value = stream.readByte();
              if (value <= -25 && value >= -31) break;

              switch (value) {
                case -24:
                  voice.volSustain = stream.readUnsignedByte();
                  voice.volseqPos += 2;
                  loop = 1;
                  break;
                case -32:
                  voice.volseqPos = (stream.readUnsignedByte() & 63) - 5;
                  loop = 3;
                  break;
                default:
                  voice.volume = value;
                  voice.volseqPos++;
                  loop = 0;
              }
            } while (loop > 2);
          }
        } while (loop > 0);

        value = voice.transpose;
        if (value >= 0) value += (voice.note + voice.trackTransp);
        value &= 127;

        if (coso) {
          if (value > 83) value = 0;
          period = PERIODS[value];
          value <<= 1;
        } else {
          value <<= 1;
          stream.position = periods + value;
          period = stream.readUnsignedShort();
        }

        if (voice.vibDelay) {
          voice.vibDelay--;
        } else {
          if (variant > 3) {
            if (voice.vibrato & 32) {
              value = voice.vibDelta + voice.vibSpeed;

              if (value > voice.vibDepth) {
                voice.vibrato &= ~32;
                value = voice.vibDepth;
              }
            } else {
              value = voice.vibDelta - voice.vibSpeed;

              if (value < 0) {
                voice.vibrato |= 32;
                value = 0;
              }
            }

            voice.vibDelta = value;
            value = (value - (voice.vibDepth >> 1)) * period;
            period += (value >> 10);
          } else if (variant > 2) {
            value = voice.vibSpeed;

            if (value < 0) {
              value &= 127;
              voice.vibrato ^= 1;
            }

            if (!(voice.vibrato & 1)) {
              if (voice.vibrato & 32) {
                voice.vibDelta += value;
                pos1 = voice.vibDepth << 1;

                if (voice.vibDelta > pos1) {
                  voice.vibrato &= ~32;
                  voice.vibDelta = pos1;
                }
              } else {
                voice.vibDelta -= value;

                if (voice.vibDelta < 0) {
                  voice.vibrato |= 32;
                  voice.vibDelta = 0;
                }
              }
            }

            period += (value - voice.vibDepth);
          } else {
            if (voice.vibrato >= 0 || !(voice.vibrato & 1)) {
              if (voice.vibrato & 32) {
                voice.vibDelta += voice.vibSpeed;
                pos1 = voice.vibDepth << 1;

                if (voice.vibDelta >= pos1) {
                  voice.vibrato &= ~32;
                  voice.vibDelta = pos1;
                }
              } else {
                voice.vibDelta -= voice.vibSpeed;

                if (voice.vibDelta < 0) {
                  voice.vibrato |= 32;
                  voice.vibDelta = 0;
                }
              }
            }

            pos1 = voice.vibDelta - voice.vibDepth;

            if (pos1) {
              value += 160;

              while (value < 256) {
                pos1 += pos1;
                value += 24;
              }

              period += pos1;
            }
          }
        }

        if (variant < 3) voice.vibrato ^= 1;

        if (voice.info & 32) {
          value = voice.infoPrev;

          if (variant > 3) {
            if (value < 0) {
              voice.portaDelta += (-value);
              value = voice.portaDelta * period;
              period += (value >> 10);
            } else {
              voice.portaDelta += value;
              value = voice.portaDelta * period;
              period -= (value >> 10);
            }
          } else {
            if (value < 0) {
              voice.portaDelta += (-value << 11);
              period += (voice.portaDelta >> 16);
            } else {
              voice.portaDelta += (value << 11);
              period -= (voice.portaDelta >> 16);
            }
          }
        }

        if (variant > 3) {
          value = (voice.volFade * voice.volume) / 100;
        } else {
          value = voice.volume;
        }

        chan.period = period;
        chan.volume = value;

        if (voice.enabled) {
          chan.enabled = 1;
          chan.pointer = voice.loopPtr;
          chan.length  = voice.repeat;
        }

        voice = voice.next;
      }
    }

    override protected function initialize():void {
      var voice:JHVoice = voices[0];
      super.initialize();

      song  = songs[playSong];
      speed = song.speed;
      tick  = (coso || variant > 1) ? 1 : speed;

      while (voice) {
        voice.initialize();
        voice.channel = amiga.channels[voice.index];
        voice.trackPtr = song.pointer + (voice.index * 3);

        if (coso) {
          voice.trackPos   = 0;
          voice.patternPos = 8;
        } else {
          stream.position = voice.trackPtr;
          voice.patternPtr = patterns + (stream.readUnsignedByte() * patternLen);
          voice.trackTransp = stream.readByte();
          voice.volTransp = stream.readByte();

          voice.frqseqPtr = base;
          voice.volseqPtr = base;
        }

        voice = voice.next;
      }
    }

    override protected function loader(stream:ByteArray):void {
      var headers:int, i:int, id:int, len:int, pos:int, sample:AmigaSample, song:JHSong, songsData:int, tracks:int, value:int;

      base = periods = 0;
      coso = int(stream.readMultiByte(4, ENCODING) == "COSO");

      if (coso) {
        for (i = 0; i < 7; ++i) value += stream.readInt();

        if (value == 16942) {
          stream.position = 47;
          value += stream.readUnsignedByte();
        }

        switch (value) {
          case 22666:
          case 18842:
          case 30012:
          case 22466:
          case 3546:
            variant = 1;
            break;
          case 16948:
          case 18332:
          case 13698:
            variant = 2;
            break;
          case 18546:   //Wings of Death
          case 13926:
          case 8760:
          case 17242:
          case 11394:
          case 14494:
          case 14392:
          case 13576:  //Dragonflight
          case 6520:
            variant = 3;
            break;
          default:
            variant = 4;
        }

        version = 2;
        stream.position = 4;

        frqseqs     = stream.readUnsignedInt();
        volseqs     = stream.readUnsignedInt();
        patterns    = stream.readUnsignedInt();
        tracks      = stream.readUnsignedInt();
        songsData   = stream.readUnsignedInt();
        headers     = stream.readUnsignedInt();
        samplesData = stream.readUnsignedInt();

        stream.position = 0;
        stream.writeInt(0x1000000);
        stream.writeInt(0xe1);
        stream.writeShort(0xffff);

        len = ((samplesData - headers) / 10) - 1;
        lastSong = (headers - songsData) / 6;
      } else {
        while (stream.bytesAvailable > 12) {
          value = stream.readUnsignedShort();

          switch (value) {
            case 0x0240:                                                        //andi.w #x,d0
              value = stream.readUnsignedShort();

              if (value == 0x007f) {                                            //andi.w #$7f,d0
                stream.position += 2;
                periods = stream.position + stream.readUnsignedShort();
              }
              break;
            case 0x7002:                                                        //moveq #2,d0
            case 0x7003:                                                        //moveq #3,d0
              channels = value & 0xff;
              value = stream.readUnsignedShort();
              if (value == 0x7600) value = stream.readUnsignedShort();          //moveq #0,d3

              if (value == 0x41fa) {                                            //lea x,a0
                stream.position += 4;
                base = stream.position + stream.readUnsignedShort();
              }
              break;
            case 0x5446:                                                        //"TF"
              value = stream.readUnsignedShort();

              if (value == 0x4d58) {                                            //"MX"
                id = stream.position - 4;
                stream.position = stream.length;
              }
              break;
          }
        }

        if (!id || !base || !periods) return;
        version = 1;

        stream.position = id + 4;
        frqseqs = pos = id + 32;
        value = stream.readUnsignedShort();
        volseqs = (pos += (++value << 6));

        value = stream.readUnsignedShort();
        patterns = (pos += (++value << 6));
        value = stream.readUnsignedShort();
        stream.position += 2;
        patternLen = stream.readUnsignedShort();
        tracks = (pos += (++value * patternLen));

        stream.position -= 4;
        value = stream.readUnsignedShort();
        songsData = (pos += (++value * 12));

        stream.position = id + 16;
        lastSong = stream.readUnsignedShort();
        headers = (pos += (++lastSong * 6));

        len = stream.readUnsignedShort();
        samplesData = pos + (len * 30);
      }

      stream.position = headers;
      samples = new Vector.<AmigaSample>(len, true);
      value = 0;

      for (i = 0; i < len; ++i) {
        sample = new AmigaSample();
        if (!coso) sample.name = stream.readMultiByte(18, ENCODING);

        sample.pointer = stream.readUnsignedInt();
        sample.length  = stream.readUnsignedShort() << 1;
        if (!coso) sample.volume  = stream.readUnsignedShort();
        sample.loopPtr = stream.readUnsignedShort() + sample.pointer;
        sample.repeat  = stream.readUnsignedShort() << 1;

        if (sample.loopPtr & 1) sample.loopPtr--;
        value += sample.length;
        samples[i] = sample;
      }

      stream.position = samplesData;
      amiga.store(stream, value);

      stream.position = songsData;
      songs = new Vector.<JHSong>();
      value = 0;

      for (i = 0; i < lastSong; ++i) {
        song = new JHSong();
        song.pointer = stream.readUnsignedShort();
        song.length  = stream.readUnsignedShort() - song.pointer + 1;
        song.speed   = stream.readUnsignedShort();

        song.pointer = (song.pointer * 12) + tracks;
        song.length *= 12;
        if (song.length > 12) songs[value++] = song;
      }

      songs.fixed = true;
      lastSong = songs.length - 1;

      if (!coso) {
        stream.position = 0;
        variant = 1;

        while (stream.position < id) {
          value = stream.readUnsignedShort();

          if (value == 0xb03c || value == 0x0c00) {                             //cmp.b #x,d0 | cmpi.b #x,d0
            value = stream.readUnsignedShort();

            if (value == 0x00e5 || value == 0x00e6 || value == 0x00e9) {        //effects
              variant = 2;
              break;
            }
          } else if (value == 0x4efb) {                                         //jmp $(pc,d0.w)
            variant = 3;
            break;
          }
        }
      }

      this.stream = stream;
    }

    private const
      PERIODS : Vector.<int> = Vector.<int>([
        1712,1616,1524,1440,1356,1280,1208,1140,1076,1016,
         960, 906, 856, 808, 762, 720, 678, 640, 604, 570,
         538, 508, 480, 453, 428, 404, 381, 360, 339, 320,
         302, 285, 269, 254, 240, 226, 214, 202, 190, 180,
         170, 160, 151, 143, 135, 127, 120, 113, 113, 113,
         113, 113, 113, 113, 113, 113, 113, 113, 113, 113,
        3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,
        1920,1812,6848,6464,6096,5760,5424,5120,4832,4560,
        4304,4064,3840,3624]);
  }
}