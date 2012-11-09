/*
  Flod 4.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod 4.0 - 2012/02/12

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
package neoart.flod.hubbard {
  import neoart.flod.core.*;

  public final class RHVoice {
    internal var
      index      : int,
      bitFlag    : int,
      next       : RHVoice,
      channel    : AmigaChannel,
      sample     : RHSample,
      trackPtr   : int,
      trackPos   : int,
      patternPos : int,
      tick       : int,
      busy       : int,
      flags      : int,
      note       : int,
      period     : int,
      volume     : int,
      portaSpeed : int,
      vibratoPtr : int,
      vibratoPos : int,
      synthPos   : int;

    public function RHVoice(index:int, bitFlag:int) {
      this.index = index;
      this.bitFlag = bitFlag;
    }

    internal function initialize():void {
      channel    = null;
      sample     = null;
      trackPtr   = 0;
      trackPos   = 0;
      patternPos = 0;
      tick       = 1;
      busy       = 1;
      flags      = 0;
      note       = 0;
      period     = 0;
      volume     = 0;
      portaSpeed = 0;
      vibratoPtr = 0;
      vibratoPos = 0;
      synthPos   = 0;
    }
  }
}