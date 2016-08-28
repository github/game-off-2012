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

  public class ModCommand {
    public var period:int;
    public var note:int;
    public var sample:int;
    public var effect:int;
    public var param:int;
    public var xeffect:int;
    public var xparam:int;
    public var noEffect:Boolean;
    public var noParams:Boolean;
    public var text:String;

    public function get px():int {
      return param >> 4;
    }

    public function get py():int {
      return param & 0x0f;
    }

    public function initialize(stream:ByteArray):void {
      var b1:int = stream.readUnsignedByte(),
          b2:int = stream.readUnsignedByte(),
          b3:int = stream.readUnsignedByte(),
          b4:int = stream.readUnsignedByte();

      period = ((b1 & 0x0f) << 8) | b2;
      sample = ((b1 & 0xf0) | ((b3 & 0xf0) >> 4)) & 0x1f;
      effect = b3 & 0x0f;
      param  = b4;

      if ((b4 = param >> 4) != 0) {
        if (effect == ModFlod.EX_EFFECT) {
          xeffect = b4;
          xparam = param & 0x0f;
        }
      }
      for (var i:int = 0; i < 37; ++i)
        if (period >= ModFlod.PERIODS[i]) break;

      note = i;
      if (effect == 0 && xparam == 0 && param == 0) noEffect = true;
      if (period == 0 && sample == 0 && noEffect)   noParams = true;
    }
  }
}