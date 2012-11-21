/* Flod (replay) version 2.0
   2009/08/15
   Christian Corti
   Neoart Costa Rica

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 	 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 	 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
 	 IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

package neoart.flod {
  import flash.events.*;
  import flash.media.*;
  import flash.utils.*;

  public class ModProcessorEx extends ModProcessor {
    public var data:Vector.<ModData>;
    public var index:int;
    public var record:Boolean;

    protected var info:ModData;
    protected var wave:ByteArray;

    public function ModProcessorEx() {
      super();
      wave = new ByteArray();
    }

    public function get available():Boolean {
      return Boolean(wave.length > 2);
    }

    public function get output():ByteArray {
      var wav:ByteArray = new ByteArray();
      wav.endian = "littleEndian";
      wav.writeUTFBytes("RIFF");
      wav.writeInt(wave.length + 44);
      wav.writeUTFBytes("WAVEfmt ");
      wav.writeInt(16);
      wav.writeShort(1);
      wav.writeShort(2);
      wav.writeInt(44100);
      wav.writeInt(44100 << 1);
      wav.writeShort(2);
      wav.writeShort(8);
      wav.writeUTFBytes("data");
      wav.writeInt(wave.length);
      wav.writeBytes(wave);
      wav.position = 0;
      return wav;
    }

    public function toggleChannel(id:int):void {
      if (id < 0 || id >= numChannels) return;
      if (!channels || !channels[id]) return;
      channels[id].mute = !(channels[id].mute);
    }

    override public function load(stream:ByteArray, extended:Boolean = true):Boolean {
      return super.load(stream, true);
    }

    override public function play(soundProcessor:Sound = null):Boolean {
      if (soundChannelPos == 0) {
        wave.clear();
        wave.writeByte(128);
        wave.writeByte(128);
        resetData();
      }
      return super.play(soundProcessor);
    }

    public function duration():int {
      var com:ModCommand, i:int, j:int, l:int = song.length - 1, p:int = song.numPatterns - 1, totalSamples:int,
          loopCounter:Vector.<int> = new Vector.<int>(numChannels, true),
              loopRow:Vector.<int> = new Vector.<int>(numChannels, true);

      reset();
      setTempo(song.tempo);

      while (position <= l) {
        j = ((song.positions[position] * patternLength) + row) * numChannels;
        for (i = 0; i < numChannels; ++i) {
          com = song.patterns[j + i];

          if (com.effect == ModFlod.POSITION_JUMP) {
            if ((position == l && com.param != l) || (song.positions[position] == p && com.param != p)) {
              complete = true;
            } else {
              position = com.param - 1;
              breakPosition = 0;
              jumpPosition = true;
            }
          } else if (com.effect == ModFlod.PATTERN_BREAK) {
            if (song.title == "bloood") break;
            breakPosition = (com.px * 10) + com.py;
            jumpPosition = true;
            if (breakPosition >= patternLength) {
              breakPosition = 0;
              jumpPosition = false;
            }

          } else if (com.effect == ModFlod.SET_SPEED) {
            if (com.param > 0x1f)
              setTempo(com.param);
            else if (com.param > 0)
              speed = com.param;
            else complete = true;

          } else if (com.xeffect == ModFlod.PATTERN_LOOP) {
            if (com.xparam == 0) {
              loopRow[i] = row;
            } else {
              if (loopCounter[i] == 0) {
                loopCounter[i] = com.xparam;
              } else {
                loopCounter[i]--;
              }
              if (loopCounter[i] != 0) {
                breakPosition = loopRow[i];
                breakPattern = true;
              }
            }
          } else if (com.xeffect == ModFlod.PATTERN_DELAY) {
            if (delayPattern == 0) delayPattern = com.xparam + 1;
          }
        }
        if (complete) break;
        row++;
        if (delayPattern != 0)
          if (--delayPattern != 0) row--;

        if (breakPattern) {
          breakPattern = false;
          row = breakPosition;
          breakPosition = 0;
        }
        jumpPosition ||= Boolean(row >= patternLength);

        if (jumpPosition) {
          row = breakPosition;
          breakPosition = 0;
          jumpPosition = false;
          position++;
        }
        totalSamples += (samplesTick * speed);
      }
      reset();
      return totalSamples;
    }

    override protected function mixer(e:SampleDataEvent):void {
      var bufferSize:int = BUFFER_SIZE, i:int, j:int, mixed:int, toMix:int, mixPos:int,
          sample:ModSample, size:int, volL:Number, volR:Number, volume:Number, waveData:Number, waveSpeed:Number;

      while (mixed < bufferSize) {
        if (samplesLeft == 0) {
          if (++timer < speed) {
            updateFx();
          } else {
            timer = 0;
            info = data[index];
            info.row = row;
            info.position = position;
            if (complete) {
              sound.removeEventListener(SampleDataEvent.SAMPLE_DATA, mixer);
              bufferSize = mixPos + samplesLeft;
              break;
            }
            process();
            info.samplesTick = samplesTick;
            info.speed = speed;
            info.tempo = tempo;
            if (++index >= patternLength) index = 0;
          }
          if (jumpPosition) {
            row = breakPosition;
            breakPosition = 0;
            jumpPosition = false;

            if (++position >= song.length) {
              if (!loopSong) complete = true;
              position = song.restart;
            }
          }
          samplesLeft = samplesTick;
        }
        toMix = samplesLeft;
        if ((mixed + toMix) > bufferSize) toMix = bufferSize - mixed;
        size = mixPos + toMix;

        for (i = 0; i < numChannels; ++i) {
          channel = channels[i];
          sample = channel.voiceSample;
          if (sample.length == 0) continue;
          volume = VOLUMES[channel.voiceVolume];
          waveSpeed = periodSpeed / channel.voicePeriod;

          if (channel.panning < 0) {
            volL = volume * (1 + stereo);
            volR = volume * (1 - stereo);
          } else {
            volL = volume * (1 - stereo);
            volR = volume * (1 + stereo);
          }
          if (timer == 0) {
            if (toMix == samplesLeft) {
              info.periods[i] = channel.command.period;
              info.volumes[i] = volL;
              info.volumes[i + 4] = volR;
            }
          }

          for (j = mixPos; j < size; ++j) {
            if (channel.phase < 0) {
              channel.phase++;
              bufferL[j] += 0;
              bufferR[j] += 0;
              continue;
            }
            channel.phase += waveSpeed;
            if (channel.phase >= channel.sampleLen) {
              sample = channel.voiceSample = channel.sample;
              channel.phase = sample.loopStart;
              channel.sampleLen = sample.loopStart + sample.repeatLen;
              if (sample.length == 0) break;
            }

            if (!channel.mute) {
              waveData = sample.wave[int(channel.phase)];
              bufferL[j] += waveData * volL;
              bufferR[j] += waveData * volR;
            }
          }
        }
        mixed += toMix;
        mixPos = size;
        samplesLeft -= toMix;
      }

      if (forceFilter == FILTER_FORCE_OFF) {
        if (record) {
          for (i = 0; i < bufferSize; ++i) {
            waveData = bufferL[i];
            wave.writeByte(128 + (waveData * 128));
            e.data.writeFloat(waveData);
            bufferL[i] = 0;

            waveData = bufferR[i];
            wave.writeByte(128 + (waveData * 128));
            e.data.writeFloat(waveData);
            bufferR[i] = 0;
          }
        } else {
          for (i = 0; i < bufferSize; ++i) {
            e.data.writeFloat(bufferL[i]);
            bufferL[i] = 0;
            e.data.writeFloat(bufferR[i]);
            bufferR[i] = 0;
          }
        }
      } else {
        if (record) {
          for (i = 0; i < bufferSize; ++i) {
            waveData = filter(bufferL[i], filterL);
            wave.writeByte(128 + (waveData * 128));
            e.data.writeFloat(waveData);
            bufferL[i] = 0;

            waveData = filter(bufferR[i], filterR);
            wave.writeByte(128 + (waveData * 128));
            e.data.writeFloat(waveData);
            bufferR[i] = 0;
          }
        } else {
          for (i = 0; i < bufferSize; ++i) {
            e.data.writeFloat(filter(bufferL[i], filterL));
            bufferL[i] = 0;
            e.data.writeFloat(filter(bufferR[i], filterR));
            bufferR[i] = 0;
          }
        }
      }
    }

    protected function resetData():void {
      index = 0;
      data = new Vector.<ModData>(patternLength, true);
      for (var i:int = 0; i < patternLength; ++i)
        data[i] = new ModData(numChannels);
    }
  }
}