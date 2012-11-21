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
  import flash.utils.*;

  public class ModSample {
    public var name:String;
    public var length:int;
    public var finetune:int;
    public var volume:int;
    public var loopStart:int;
    public var repeatLen:int;
    public var realLength:int;
    public var wave:Vector.<Number>;

    public function initialize(stream:ByteArray):void {
      name       = stream.readMultiByte(22, ModFlod.ENCODING);
      length     = stream.readUnsignedShort() << 1;
      finetune   = stream.readUnsignedByte();
      volume     = stream.readUnsignedByte();
      loopStart  = stream.readUnsignedShort();
      repeatLen  = stream.readUnsignedShort() << 1;
      realLength = length;
    }

    public function normalize(sample:ByteArray):void {
      if (sample.bytesAvailable < length) length = sample.bytesAvailable;
      if (length == 0) return;

      var i:int, pos:int = sample.position, silent:int = 4;
      pos += length;
      if (repeatLen < 2) repeatLen = 2;

      if (ModSong.version > ModFlod.SOUNDTRACKER_24) {
        if (loopStart != 0) {
          loopStart <<= 1;
          if ((loopStart + repeatLen) > length) repeatLen = length - loopStart;
          length = loopStart + repeatLen;
        } else {
          silent = 2;
        }
      } else if (ModSong.version < ModFlod.ULTIMATE_ST2) {
        if (loopStart > 0) {
          if (loopStart < length) sample.position += loopStart;
          loopStart = 0;
          if (repeatLen > length) repeatLen = length;
            else length = repeatLen;
          silent = 0;
        } else if (repeatLen > 2) {
          repeatLen = length;
        }
      } else {
        if (repeatLen > 2) {
          if (loopStart < length) sample.position += loopStart;
          loopStart = 0;
          if (repeatLen > length) repeatLen = length;
            else length = repeatLen;
          silent = 0;
        }
      }

      wave = new Vector.<Number>(length, true);
      for (i = 0; i < length; ++i) wave[i] = sample.readByte() * 0.0078125;
      for (i = 0; i < silent; ++i) wave[i] = 0;
      sample.position = pos;
    }
  }
}