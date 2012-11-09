/*
  Flod 4.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod 4.1 - 2012/04/09

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 	OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
package neoart.flod.core {
  import flash.events.*;
  import flash.utils.*;

  public final class Amiga extends CoreMixer {
    public static const
      MODEL_A500  : int = 0,
      MODEL_A1200 : int = 1;
    public var
      filter   : AmigaFilter,
      model    : int = MODEL_A1200,
      memory   : Vector.<int>,
      channels : Vector.<AmigaChannel>,
      loopPtr  : int,
      loopLen  : int = 4;
    internal var
      clock    : Number = 0.0,
      master   : Number = 0.00390625;

    public function Amiga() {
      super();
      bufferSize = 8192;
      filter = new AmigaFilter();
      channels = new Vector.<AmigaChannel>(4, true);

      channels[0] = new AmigaChannel(0);
      channels[0].next = channels[1] = new AmigaChannel(1);
      channels[1].next = channels[2] = new AmigaChannel(2);
      channels[2].next = channels[3] = new AmigaChannel(3);
    }

    public function set volume(value:int):void {
      if (value > 0) {
        if (value > 64) value = 64;
        master = (value / 64) * 0.00390625;
      } else {
        master = 0.0;
      }
    }

    public function store(stream:ByteArray, len:int, pointer:int = -1):int {
      var add:int, i:int, pos:int = stream.position, start:int = memory.length, total:int;

      if (pointer > -1) stream.position = pointer;
      total = stream.position + len;

      if (total >= stream.length) {
        add = total - stream.length;
        len = stream.length - stream.position;
      }

      for (i = start, len += start; i < len; ++i)
        memory[i] = stream.readByte();

      memory.length += add;
      if (pointer > -1) stream.position = pos;
      return start;
    }

    override internal function initialize():void {
      super.initialize();
      wave.clear();
      filter.initialize();

      if (!memory.fixed) {
        loopPtr = memory.length;
        memory.length += loopLen;
        memory.fixed = true;
      }

      channels[0].initialize();
      channels[1].initialize();
      channels[2].initialize();
      channels[3].initialize();
    }

    //js function restore
    override internal function reset():void {
      memory = new Vector.<int>();
    }

    override internal function fast(e:SampleDataEvent):void {
      var chan:AmigaChannel, data:ByteArray = e.data, i:int, lvol:Number, mixed:int, mixLen:int, mixPos:int, rvol:Number, sample:Sample, size:int = bufferSize, speed:Number, toMix:int, value:Number;

      if (completed) {
        if (!remains) return;
        size = remains;
      }

      while (mixed < size) {
        if (!samplesLeft) {
          player.process();
          samplesLeft = samplesTick;

          if (completed) {
            size = mixed + samplesTick;

            if (size > bufferSize) {
              remains = size - bufferSize;
              size = bufferSize;
            }
          }
        }

        toMix = samplesLeft;
        if ((mixed + toMix) >= size) toMix = size - mixed;
        mixLen = mixPos + toMix;
        chan = channels[0];

        while (chan) {
          sample = buffer[mixPos];

          if (chan.audena && chan.audper > 60) {
            if (chan.mute) {
              chan.ldata = 0.0;
              chan.rdata = 0.0;
            }

            speed = chan.audper / clock;

            value = chan.audvol * master;
            lvol = value * (1 - chan.level);
            rvol = value * (1 + chan.level);

            for (i = mixPos; i < mixLen; ++i) {
              if (chan.delay) {
                chan.delay--;
              } else if (--chan.timer < 1.0) { 
                if (!chan.mute) {
                  value = memory[chan.audloc] * 0.0078125;
                  chan.ldata = value * lvol;
                  chan.rdata = value * rvol;
                }

                chan.audloc++;
                chan.timer += speed;

                if (chan.audloc >= chan.audcnt) {
                  chan.audloc = chan.pointer;
                  chan.audcnt = chan.pointer + chan.length;
                }
              }

              sample.l += chan.ldata;
              sample.r += chan.rdata;
              sample = sample.next;
            }
          } else {
            for (i = mixPos; i < mixLen; ++i) {
              sample.l += chan.ldata;
              sample.r += chan.rdata;
              sample = sample.next;
            }
          }
          chan = chan.next;
        }

        mixPos = mixLen;
        mixed += toMix;
        samplesLeft -= toMix;
      }

      sample = buffer[0];

      if (player.record) {
        for (i = 0; i < size; ++i) {
          filter.process(model, sample);

          wave.writeShort(int(sample.l * (sample.l < 0 ? 32768 : 32767)));
          wave.writeShort(int(sample.r * (sample.r < 0 ? 32768 : 32767)));

          data.writeFloat(sample.l);
          data.writeFloat(sample.r);

          sample.l = sample.r = 0.0;
          sample = sample.next;
        }
      } else {
        for (i = 0; i < size; ++i) {
          filter.process(model, sample);

          data.writeFloat(sample.l);
          data.writeFloat(sample.r);

          sample.l = sample.r = 0.0;
          sample = sample.next;
        }
      }
    }
  }
}