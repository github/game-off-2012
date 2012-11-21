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

  public class ModProcessor {
    public const AMIGA_500: int = 0;
    public const AMIGA_1200:int = 1;

    public const FILTER_AUTOMATIC:int = 0;
    public const FILTER_FORCE_OFF:int = 1;
    public const FILTER_FORCE_ON: int = 2;

    public var sound:Sound;
    public var soundChannel:SoundChannel;
    public var soundChannelPos:Number = 0.0;
    public var song:ModSong;

    public var amigaModel:int = AMIGA_1200;
    public var externalReplay:Boolean;
    public var forceFilter:int = FILTER_FORCE_OFF;
    public var loopSong:Boolean;
    public var stereo:Number = 1.0;
    public var isPlaying:Boolean;
    public var isPaused:Boolean;

    protected var bufferL:Vector.<Number>;
    protected var bufferR:Vector.<Number>;
    protected var filterL:Vector.<Number>;
    protected var filterR:Vector.<Number>;
    protected var samplesTick:int;
    protected var samplesLeft:int;
    protected var complete:Boolean;

    protected var channel:ModChannel;
    protected var channels:Vector.<ModChannel>;
    protected var numChannels:int;
    protected var tempo:int;
    protected var speed:int = ModFlod.DEFAULT_SPEED;
    protected var timer:int = speed;
    protected var tempoCia:int = ModFlod.PAL_CIATEMPO;
    protected var tempoVbl:Number = ModFlod.PAL_VBLTEMPO;
    protected var periodSpeed:Number = ModFlod.PAL_SPEED;

    protected var ledFilter:Boolean;
    protected var patternLength:int;
    protected var position:int;
    protected var row:int;
    protected var jumpPosition:Boolean;
    protected var breakPattern:Boolean;
    protected var breakPosition:int;
    protected var delayPattern:int;

    protected const BUFFER_SIZE:int = 8192;
    protected const MIN_PERIOD: int = 113;
    protected const MAX_PERIOD: int = 856;

    protected const A51_FILTER:Number = 0.4860348337215757;
    protected const A52_FILTER:Number = 0.9314955486749749;
    protected const LED_FILTER:Number = 0.5213345843532200;

    protected const VOLUMES:Vector.<Number> = Vector.<Number>([
            0, 0.00390625, 0.0078125, 0.01171875, 0.015625, 0.01953125, 0.0234375, 0.02734375,
      0.03125, 0.03515625, 0.0390625, 0.04296875, 0.046875, 0.05078125, 0.0546875, 0.05859375,
       0.0625, 0.06640625, 0.0703125, 0.07421875, 0.078125, 0.08203125, 0.0859375, 0.08984375,
      0.09375, 0.09765625, 0.1015625, 0.10546875, 0.109375, 0.11328125, 0.1171875, 0.12109375,
        0.125, 0.12890625, 0.1328125, 0.13671875, 0.140625, 0.14453125, 0.1484375, 0.15234375,
      0.15625, 0.16015625, 0.1640625, 0.16796875, 0.171875, 0.17578125, 0.1796875, 0.18359375,
       0.1875, 0.19140625, 0.1953125, 0.19921875, 0.203125, 0.20703125, 0.2109375, 0.21484375,
      0.21875, 0.22265625, 0.2265625, 0.23046875, 0.234375, 0.23828125, 0.2421875, 0.24609375,
        0.25]);

    public function ModProcessor() {
      bufferL = new Vector.<Number>(BUFFER_SIZE, true);
      bufferR = new Vector.<Number>(BUFFER_SIZE, true);
      filterL = new Vector.<Number>(5, true);
      filterR = new Vector.<Number>(5, true);
    }

    public function load(stream:ByteArray, extended:Boolean = false):Boolean {
      song = new ModSong(stream, extended);
      numChannels = song.numChannels;
      patternLength = song.patternLength;
      channels = new Vector.<ModChannel>(numChannels, true);

      for (var i:int = 0; i < numChannels; ++i)
        channels[i] = new ModChannel(i, song.samples[0]);
      return song.supported;
    }

    public function play(soundProcessor:Sound = null):Boolean {
      if (!song || !song.supported) return false;
      if (soundChannelPos == 0) {
        reset();
        setTempo(song.tempo);
        for (var i:int = 0; i < numChannels; ++i)
          channels[i].reset(song.samples[0]);
      }
      sound = soundProcessor ? soundProcessor : new Sound();
      sound.addEventListener(SampleDataEvent.SAMPLE_DATA, mixer);
      soundChannel = sound.play(soundChannelPos);
      soundChannelPos = 0;
	  isPlaying = true;
	  isPaused = false;
      return true;
    }

    public function pause():void
	{
      if (!song || !song.supported) return;
	  
	  if (isPlaying)
	  {
		  soundChannelPos = soundChannel.position;
		  soundChannel.stop();
		  sound.removeEventListener(SampleDataEvent.SAMPLE_DATA, mixer);
		  isPlaying = false;
		  isPaused = true;
	  }
    }
    
	public function resume():void
	{
      if (!song || !song.supported) return;
	  
	  if (isPaused)
	  {
		  sound.addEventListener(SampleDataEvent.SAMPLE_DATA, mixer);
		  soundChannel = sound.play(soundChannelPos);
		  isPlaying = true;
		  isPaused = false;
	  }
    }

    public function stop():void {
      if (!song || !song.supported) return;
      soundChannel.stop();
      sound.removeEventListener(SampleDataEvent.SAMPLE_DATA, mixer);
      soundChannelPos = 0;
	  isPlaying = false;
    }

    public function set ntsc(val:Boolean):void {
      if (val) {
        tempoCia = ModFlod.NTSC_CIATEMPO;
        tempoVbl = ModFlod.NTSC_VBLTEMPO;
        periodSpeed = ModFlod.NTSC_SPEED;
      } else {
        tempoCia = ModFlod.PAL_CIATEMPO;
        tempoVbl = ModFlod.PAL_VBLTEMPO;
        periodSpeed = ModFlod.PAL_SPEED;
      }
    }

    protected function reset():void {
      samplesLeft = 0;
      speed = timer = ModFlod.DEFAULT_SPEED;
      position = row = 0;
      jumpPosition = false;
      breakPattern = false;
      breakPosition = 0;
      delayPattern  = 0;
      complete = false;
    }

    protected function mixer(e:SampleDataEvent):void {
      var bufferSize:int = BUFFER_SIZE, i:int, j:int, mixed:int, toMix:int, mixPos:int, sample:ModSample,
          size:int, volL:Number, volR:Number, volume:Number, waveData:Number, waveSpeed:Number;

      while (mixed < bufferSize) {
        if (samplesLeft == 0) {
          if (++timer < speed) {
            updateFx();
          } else {
            timer = 0;
            if (complete) {
              sound.removeEventListener(SampleDataEvent.SAMPLE_DATA, mixer);
              bufferSize = mixPos + samplesLeft;
              break;
            }
            process();
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
        for (i = 0; i < bufferSize; ++i) {
          e.data.writeFloat(bufferL[i]);
          bufferL[i] = 0;
          e.data.writeFloat(bufferR[i]);
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

    protected function process():void {
      var com:ModCommand, i:int, j:int, sample:ModSample;

      if (delayPattern == 0) {
        j = ((song.positions[position] * patternLength) + row) * numChannels;

        for (i = 0; i < numChannels; ++i) {
          channel = channels[i];
          com = channel.command;
          if (com.noParams) channel.voicePeriod = channel.period;
          com = channel.command = song.patterns[j + i];

          if (com.sample) {
            sample = channel.sample = song.samples[com.sample];
            channel.finetune = sample.finetune;
            channel.voiceVolume = channel.volume = sample.volume;
          }
          if (com.period == 0) {
            updateMoreFx();
            continue;
          }

          if (com.xeffect == ModFlod.SET_FINETUNE)
            channel.finetune = com.xparam;
          else if (com.effect == ModFlod.TONE_PORTAMENTO ||
                   com.effect == ModFlod.TONE_PORTA_VOLUME_SLIDE) {
            channel.portaPeriod = ModFlod.PERIODS[channel.finetune + com.note];
            if (channel.period == channel.portaPeriod) channel.portaPeriod = 0;
            updateMoreFx();
            continue;
          }
          channel.note = com.note;
          channel.period = ModFlod.PERIODS[channel.finetune + com.note];

          if (com.xeffect == ModFlod.NOTE_DELAY) {
            updateMoreFx();
            continue;
          }
          if (channel.vibratoRetrig) channel.vibratoPos = 0;
          if (channel.tremoloRetrig) channel.tremoloPos = 0;

          channel.phase = 0;
          channel.sampleLen = channel.sample.length;
          channel.wavePos = channel.sample.loopStart;

          channel.voicePeriod = channel.period;
          channel.voiceSample = channel.sample;
          updateMoreFx();
        }
      } else {
        updateFx();
      }
      row++;

      if (delayPattern != 0)
        if (--delayPattern != 0) row--;

      if (breakPattern) {
        breakPattern = false;
        row = breakPosition;
        breakPosition = 0;
      }
      jumpPosition ||= Boolean(row >= patternLength);
    }

    protected function updateFx():void {
      var com:ModCommand, i:int;

      for (i = 0; i < numChannels; ++i) {
        channel = channels[i];
        com = channel.command;
        if (channel.invertSpeed) channel.invertLoop();

        if (com.noEffect) {
          channel.voicePeriod = channel.period;
          continue;
        }
        switch (com.effect) {
          case ModFlod.ARPEGGIO:
            switch (timer % 3) {
              case 1:
                channel.voicePeriod = ModFlod.PERIODS[channel.finetune + (channel.note + com.px)];
                continue;
              case 2:
                channel.voicePeriod = ModFlod.PERIODS[channel.finetune + (channel.note + com.py)];
                continue;
            }
            channel.voicePeriod = channel.period;
            continue;

          case ModFlod.PORTAMENTO_UP:
            channel.period -= com.param;
            if (channel.period < MIN_PERIOD) channel.period = MIN_PERIOD;
            channel.voicePeriod = channel.period;
            continue;

          case ModFlod.PORTAMENTO_DOWN:
            channel.period += com.param;
            if (channel.period > MAX_PERIOD) channel.period = MAX_PERIOD;
            channel.voicePeriod = channel.period;
            continue;

          case ModFlod.TONE_PORTAMENTO:
            if (com.param != 0) channel.portaSpeed = com.param;
            if (channel.portaPeriod != 0) channel.tonePortamento();
            continue;

          case ModFlod.VIBRATO:
            if (com.py != 0) channel.vibratoDepth = com.py;
            if (com.px != 0) channel.vibratoSpeed = com.px;
            channel.vibrato();
            continue;

          case ModFlod.TONE_PORTA_VOLUME_SLIDE:
            if (channel.portaPeriod != 0) channel.tonePortamento();
            channel.volumeSlide();
            continue;

          case ModFlod.VIBRATO_VOLUME_SLIDE:
            channel.vibrato();
            channel.volumeSlide();
            continue;

          case ModFlod.EX_EFFECT:
            updateExtendedFx();
            continue;
        }
        channel.voicePeriod = channel.period;

        switch (com.effect) {
          case ModFlod.TREMOLO:
            if (com.py != 0) channel.tremoloDepth = com.py;
            if (com.px != 0) channel.tremoloSpeed = com.px;
            channel.tremolo();
            continue;

          case ModFlod.VOLUME_SLIDE:
            channel.volumeSlide();
            continue;
        }
      }
    }

    protected function updateMoreFx():void {
      var com:ModCommand = channel.command;
      if (externalReplay) { if (channel.invertSpeed) channel.invertLoop(); }

      switch (com.effect) {
        case ModFlod.SAMPLE_OFFSET:
          if (com.param != 0) channel.sampleOffset = com.param << 8;
          if (channel.sampleOffset > channel.sampleLen) channel.phase = channel.sampleLen;
            else channel.phase = channel.sampleOffset;
          return;

        case ModFlod.POSITION_JUMP:
          if (!loopSong) {
            var l:int = song.length - 1, p:int = song.numPatterns - 1;
            if ((position == l && com.param != l) || (song.positions[position] == p && com.param != p)) {
              complete = true;
              return;
            }
          }
          position = com.param - 1;
          breakPosition = 0;
          jumpPosition = true;
          return;

        case ModFlod.PATTERN_BREAK:
          breakPosition = (com.px * 10) + com.py;
          jumpPosition = true;
          if (breakPosition >= patternLength) {
            breakPosition = 0;
            jumpPosition = false;
          }
          return;

        case ModFlod.EX_EFFECT:
          updateExtendedFx();
          return;

        case ModFlod.SET_SPEED:
          timer = 0;
          if (com.param > 0x1f)
            setTempo(com.param);
          else if (com.param > 0)
            speed = com.param;
          else complete = true;
          return;

        case ModFlod.SET_VOLUME:
          channel.volume = com.param;
          if (channel.volume < 0) channel.volume = 0;
            else if (channel.volume > 64) channel.volume = 64;
          channel.voiceVolume = channel.volume;
          return;
      }
      channel.voicePeriod = channel.period;
    }

    protected function updateExtendedFx():void {
      var com:ModCommand = channel.command;

      switch (com.xeffect) {
        case ModFlod.SET_FILTER:
          ledFilter = Boolean(com.xparam != 0);
          return;

        case ModFlod.FINE_SLIDE_UP:
          if (timer == 0) {
            channel.period -= com.xparam;
            if (channel.period < MIN_PERIOD) channel.period = MIN_PERIOD;
            channel.voicePeriod = channel.period;
          }
          return;

        case ModFlod.FINE_SLIDE_DOWN:
          if (timer == 0) {
            channel.period += com.xparam;
            if (channel.period > MAX_PERIOD) channel.period = MAX_PERIOD;
            channel.voicePeriod = channel.period;
          }
          return;

        case ModFlod.GLISSANDO_CONTROL:
          channel.glissando = Boolean(com.xparam != 0);
          return;

        case ModFlod.VIBRATO_CONTROL:
          channel.vibratoWave = com.xparam;
          channel.vibratoRetrig = Boolean(channel.vibratoWave < 4);
          return;

        case ModFlod.SET_FINETUNE:
          channel.finetune = com.xparam & 0x0f;
          return;

        case ModFlod.PATTERN_LOOP:
          if (timer == 0) {
            if (com.xparam == 0) {
              channel.loopRow = row;
            } else {
              if (channel.loopCounter == 0) {
                channel.loopCounter = com.xparam;
              } else {
                channel.loopCounter--;
              }
              if (channel.loopCounter != 0) {
                breakPosition = channel.loopRow;
                breakPattern = true;
              }
            }
          }
          return;

        case ModFlod.TREMOLO_CONTROL:
          channel.tremoloWave = com.xparam;
          channel.tremoloRetrig = Boolean(channel.tremoloWave < 4);
          return;

        case ModFlod.KARPLUS_STRONG:
          channel.karplusStrong();
          return;

        case ModFlod.RETRIG_NOTE:
          if (com.param != 0) {
            if (timer != 0 || com.period == 0) {
              if (timer % com.xparam == 0) channel.phase = 0;
            }
          }
          return;

        case ModFlod.FINE_VOLUME_UP:
          if (timer == 0) {
            channel.volume += com.xparam;
            if (channel.volume > 64) channel.volume = 64;
            channel.voiceVolume = channel.volume;
          }
          return;

        case ModFlod.FINE_VOLUME_DOWN:
          if (timer == 0) {
            channel.volume -= com.xparam;
            if (channel.volume < 0) channel.volume = 0;
            channel.voiceVolume = channel.volume;
          }
          return;

        case ModFlod.NOTE_CUT:
          if (timer >= com.xparam)
            channel.voiceVolume = channel.volume = 0;
          return;

        case ModFlod.NOTE_DELAY:
          if (timer == com.xparam) {
            if (com.period != 0) {
              channel.phase = -35;
              channel.sampleLen = channel.sample.length;
              channel.wavePos = channel.sample.loopStart;
              channel.voicePeriod = channel.period;
              channel.voiceSample = channel.sample;
            }
          }
          return;

        case ModFlod.PATTERN_DELAY:
          if (timer == 0) {
            if (delayPattern == 0) delayPattern = com.xparam + 1;
          }
          return;

        case ModFlod.INVERT_LOOP:
          if (timer == 0) {
            channel.invertSpeed = com.xparam;
            if (channel.invertSpeed) channel.invertLoop();
          }
          return;
      }
    }

    protected function setTempo(bpm:int):void {
      if (ModSong.version < ModFlod.PROTRACKER_10) samplesTick = (240 - bpm) * tempoVbl;
        else samplesTick = tempoCia / bpm;
      tempo = bpm;
    }

    protected function filter(input:Number, state:Vector.<Number>):Number {
      var output:Number, value:Number = LED_FILTER, delta:Number = 1 - value;

      switch (amigaModel) {
        case AMIGA_1200:
          output = input;
          if (ledFilter || forceFilter) {
            state[1] = value * output   + delta * state[1] + 1e-18 - 1e-18;
            state[2] = value * state[1] + delta * state[2] + 1e-18 - 1e-18;
            state[3] = value * state[2] + delta * state[3] + 1e-18 - 1e-18;
            output = state[3];
          }
          break;

        case AMIGA_500:
          state[0] = A51_FILTER * input    + (1 - A51_FILTER) * state[0] + 1e-18 - 1e-18;
          state[1] = A52_FILTER * state[0] + (1 - A52_FILTER) * state[1] + 1e-18 - 1e-18;
          output = state[1];

          if (ledFilter || forceFilter) {
            state[2] = value * output   + delta * state[2] + 1e-18 - 1e-18;
            state[3] = value * state[2] + delta * state[3] + 1e-18 - 1e-18;
            state[4] = value * state[3] + delta * state[4] + 1e-18 - 1e-18;
            output = state[4];
          }
          break;
      }
      if (output > 1.0) output = 1.0;
        else if (output < -1.0) output = -1.0;
      return output;
    }
  }
}