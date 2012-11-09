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

  public class AmigaPlayer extends CorePlayer {
    public var
      amiga    : Amiga;
    protected var
      standard : int;

    public function AmigaPlayer(amiga:Amiga) {
      this.amiga = amiga || new Amiga();
      super(this.amiga);

      channels = 4;
      endian   = "bigEndian";
      ntsc     = 0;
      speed    = 6;
      tempo    = 125;
    }

    override public function set ntsc(value:int):void {
      standard = value;

      if (value) {
        amiga.clock = 81.1688208;
        amiga.samplesTick = 735;
      } else {
        amiga.clock = 80.4284580;
        amiga.samplesTick = 882;
      }
    }

    override public function set stereo(value:Number):void {
      var chan:AmigaChannel = amiga.channels[0];

      if (value < 0.0) value = 0.0;
        else if (value > 1.0) value = 1.0;

      while (chan) {
        chan.level = value * chan.panning;
        chan = chan.next;
      }
    }

    override public function set volume(value:Number):void {
      if (value < 0.0) value = 0.0;
        else if (value > 1.0) value = 1.0;

      amiga.master = value * 0.00390625;
    }

    override public function toggle(index:int):void {
      amiga.channels[index].mute ^= 1;
    }
  }
}