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
  import flash.utils.*;

  public class SBSample {
    public var
      name      : String = "",
      bits      : int = 8,
      volume    : int,
      length    : int,
      data      : Vector.<Number>,
      loopMode  : int,
      loopStart : int,
      loopLen   : int;

    public function store(stream:ByteArray):void {
      var delta:int, i:int, len:int = length, pos:int, sample:Number, total:int, value:int;
      if (!loopLen) loopMode = 0;
      pos = stream.position;

      if (loopMode) {
        len = loopStart + loopLen;
        data = new Vector.<Number>(len + 1, true);
      } else {
        data = new Vector.<Number>(length + 1, true);
      }

      if (bits == 8) {
        total = pos + len;

        if (total > stream.length)
          len = stream.length - pos;

        for (i = 0; i < len; ++i) {
          value = stream.readByte() + delta;

          if (value < -128) value += 256;
            else if (value > 127) value -= 256;

          data[i] = value * 0.0078125;
          delta = value;
        }
      } else {
        total = pos + (len << 1);

        if (total > stream.length)
          len = (stream.length - pos) >> 1;

        for (i = 0; i < len; ++i) {
          value = stream.readShort() + delta;

          if (value < -32768) value += 65536;
            else if (value > 32767) value -= 65536;

          data[i] = value * 0.00003051758;
          delta = value;
        }
      }

      total = pos + length;

      if (!loopMode) {
        data[length] = 0.0;
      } else {
        length = loopStart + loopLen;

        if (loopMode == 1) {
          data[len] = data[loopStart];
        } else {
          data[len] = data[int(len - 1)];
        }
      }

      if (len != length) {
        sample = data[int(len - 1)];
        for (i = len; i < length; ++i) data[i] = sample;
      }

      if (total < stream.length) stream.position = total;
        else stream.position = stream.length - 1;
    }
  }
}