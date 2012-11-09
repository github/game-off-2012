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
package neoart.flod.deltamusic {
  import neoart.flod.core.*;

  public final class D1Voice {
    internal var
      index         : int,
      next          : D1Voice,
      channel       : AmigaChannel,
      sample        : D1Sample,
      trackPos      : int,
      patternPos    : int,
      status        : int,
      speed         : int,
      step          : AmigaStep,
      row           : AmigaRow,
      note          : int,
      period        : int,
      arpeggioPos   : int,
      pitchBend     : int,
      tableCtr      : int,
      tablePos      : int,
      vibratoCtr    : int,
      vibratoDir    : int,
      vibratoPos    : int,
      vibratoPeriod : int,
      volume        : int,
      attackCtr     : int,
      decayCtr      : int,
      releaseCtr    : int,
      sustain       : int;

    public function D1Voice(index:int) {
      this.index = index;
    }

    internal function initialize():void {
      sample        = null;
      trackPos      = 0;
      patternPos    = 0;
      status        = 0;
      speed         = 1;
      step          = null;
      row           = null;
      note          = 0;
      period        = 0;
      arpeggioPos   = 0;
      pitchBend     = 0;
      tableCtr      = 0;
      tablePos      = 0;
      vibratoCtr    = 0;
      vibratoDir    = 0;
      vibratoPos    = 0;
      vibratoPeriod = 0;
      volume        = 0;
      attackCtr     = 0;
      decayCtr      = 0;
      releaseCtr    = 0;
      sustain       = 1;
    }
  }
}