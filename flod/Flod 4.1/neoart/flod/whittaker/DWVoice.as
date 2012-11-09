/*
  Flod 4.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod 4.0 - 2012/02/22

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
package neoart.flod.whittaker {
  import neoart.flod.core.*;

  public final class DWVoice {
    internal var
      index         : int,
      bitFlag       : int,
      next          : DWVoice,
      channel       : AmigaChannel,
      sample        : DWSample,
      trackPtr      : int,
      trackPos      : int,
      patternPos    : int,
      frqseqPtr     : int,
      frqseqPos     : int,
      volseqPtr     : int,
      volseqPos     : int,
      volseqSpeed   : int,
      volseqCounter : int,
      halve         : int,
      speed         : int,
      tick          : int,
      busy          : int,
      flags         : int,
      note          : int,
      period        : int,
      transpose     : int,
      portaDelay    : int,
      portaDelta    : int,
      portaSpeed    : int,
      vibrato       : int,
      vibratoDelta  : int,
      vibratoSpeed  : int,
      vibratoDepth  : int;

    public function DWVoice(index:int, bitFlag:int) {
      this.index = index;
      this.bitFlag = bitFlag;
    }

    internal function initialize():void {
      channel       = null;
      sample        = null;
      trackPtr      = 0;
      trackPos      = 0;
      patternPos    = 0;
      frqseqPtr     = 0;
      frqseqPos     = 0;
      volseqPtr     = 0;
      volseqPos     = 0;
      volseqSpeed   = 0;
      volseqCounter = 0;
      halve         = 0;
      speed         = 0;
      tick          = 1;
      busy          = -1;
      flags         = 0;
      note          = 0;
      period        = 0;
      transpose     = 0;
      portaDelay    = 0;
      portaDelta    = 0;
      portaSpeed    = 0;
      vibrato       = 0;
      vibratoDelta  = 0;
      vibratoSpeed  = 0;
      vibratoDepth  = 0;
    }
  }
}