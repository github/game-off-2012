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
package neoart.flod.sidmon {
  import neoart.flod.core.*;

  public final class S2Voice {
    internal var
      index          : int,
      next           : S2Voice,
      channel        : AmigaChannel,
      step           : S2Step,
      row            : SMRow,
      instr          : S2Instrument,
      sample         : S2Sample,
      enabled        : int,
      pattern        : int,
      instrument     : int,
      note           : int,
      period         : int,
      volume         : int,
      original       : int,
      adsrPos        : int,
      sustainCtr     : int,
      pitchBend      : int,
      pitchBendCtr   : int,
      noteSlideTo    : int,
      noteSlideSpeed : int,
      waveCtr        : int,
      wavePos        : int,
      arpeggioCtr    : int,
      arpeggioPos    : int,
      vibratoCtr     : int,
      vibratoPos     : int,
      speed          : int;

    public function S2Voice(index:int) {
      this.index = index;
    }

    internal function initialize():void {
      step           = null;
      row            = null;
      instr          = null;
      sample         = null;
      enabled        = 0;
      pattern        = 0;
      instrument     = 0;
      note           = 0;
      period         = 0;
      volume         = 0;
      original       = 0;
      adsrPos        = 0;
      sustainCtr     = 0;
      pitchBend      = 0;
      pitchBendCtr   = 0;
      noteSlideTo    = 0;
      noteSlideSpeed = 0;
      waveCtr        = 0;
      wavePos        = 0;
      arpeggioCtr    = 0;
      arpeggioPos    = 0;
      vibratoCtr     = 0;
      vibratoPos     = 0;
      speed          = 0;
    }
  }
}