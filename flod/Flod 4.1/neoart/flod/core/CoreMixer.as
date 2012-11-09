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
package neoart.flod.core {
  import flash.events.*;
  import flash.utils.*;

  public class CoreMixer {
    public var
      player      : CorePlayer,
      samplesTick : int;
    protected var
      buffer      : Vector.<Sample>,
      samplesLeft : int,
      remains     : int,
      completed   : int,
      wave        : ByteArray;

    public function CoreMixer() {
      wave = new ByteArray();
      wave.endian = "littleEndian";
      bufferSize = 8192;
    }

    public function get bufferSize():int { return buffer.length; }
    public function set bufferSize(value:int):void {
      var i:int, len:int;
      if (value == len || value < 2048) return;

      if (!buffer) {
        buffer = new Vector.<Sample>(value, true);
      } else {
        len = buffer.length;
        buffer.fixed = false;
        buffer.length = value;
        buffer.fixed = true;
      }

      if (value > len) {
        buffer[len] = new Sample();

        for (i = ++len; i < value; ++i)
          buffer[i] = buffer[int(i - 1)].next = new Sample();
      }
    }

    public function get complete():int { return completed; }
    public function set complete(value:int):void {
      completed = value ^ player.loopSong;
    }

    //js function reset
    internal function initialize():void {
      var sample:Sample = buffer[0];

      samplesLeft = 0;
      remains     = 0;
      completed   = 0;

      while (sample) {
        sample.l = sample.r = 0.0;
        sample = sample.next;
      }
    }

    //js function restore
    internal function reset():void { }

    internal function fast(e:SampleDataEvent):void { }

    internal function accurate(e:SampleDataEvent):void { }

    internal function waveform():ByteArray {
      var file:ByteArray = new ByteArray();
      file.endian = "littleEndian";

      file.writeUTFBytes("RIFF");
      file.writeInt(wave.length + 44);
      file.writeUTFBytes("WAVEfmt ");
      file.writeInt(16);
      file.writeShort(1);
      file.writeShort(2);
      file.writeInt(44100);
      file.writeInt(44100 << 2);
      file.writeShort(4);
      file.writeShort(16);
      file.writeUTFBytes("data");
      file.writeInt(wave.length);
      file.writeBytes(wave);

      file.position = 0;
      return file;
    }
  }
}