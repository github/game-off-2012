/*
  Flod 4.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod 4.0 - 2012/03/08

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
package neoart.flod.hippel {
  import neoart.flod.core.*;

  public final class JHVoice {
    internal var
      index       : int,
      next        : JHVoice,
      channel     : AmigaChannel,
      enabled     : int,
      cosoCounter : int,
      cosoSpeed   : int,
      trackPtr    : int,
      trackPos    : int,
      trackTransp : int,
      patternPtr  : int,
      patternPos  : int,
      frqseqPtr   : int,
      frqseqPos   : int,
      volseqPtr   : int,
      volseqPos   : int,
      sample      : int,
      loopPtr     : int,
      repeat      : int,
      tick        : int,
      note        : int,
      transpose   : int,
      info        : int,
      infoPrev    : int,
      volume      : int,
      volCounter  : int,
      volSpeed    : int,
      volSustain  : int,
      volTransp   : int,
      volFade     : int,
      portaDelta  : int,
      vibrato     : int,
      vibDelay    : int,
      vibDelta    : int,
      vibDepth    : int,
      vibSpeed    : int,
      slide       : int,
      sldActive   : int,
      sldDone     : int,
      sldCounter  : int,
      sldSpeed    : int,
      sldDelta    : int,
      sldPointer  : int,
      sldLen      : int,
      sldEnd      : int,
      sldLoopPtr  : int;

    public function JHVoice(index:int) {
      this.index = index;
    }

    internal function initialize():void {
      channel     = null;
      enabled     = 0;
      cosoCounter = 0;
      cosoSpeed   = 0;
      trackPtr    = 0
      trackPos    = 12;
      trackTransp = 0;
      patternPtr  = 0;
      patternPos  = 0;
      frqseqPtr   = 0;
      frqseqPos   = 0;
      volseqPtr   = 0;
      volseqPos   = 0;
      sample      = -1;
      loopPtr     = 0;
      repeat      = 0;
      tick        = 0;
      note        = 0;
      transpose   = 0;
      info        = 0;
      infoPrev    = 0;
      volume      = 0;
      volCounter  = 1;
      volSpeed    = 1;
      volSustain  = 0;
      volTransp   = 0;
      volFade     = 100;
      portaDelta  = 0;
      vibrato     = 0;
      vibDelay    = 0;
      vibDelta    = 0;
      vibDepth    = 0;
      vibSpeed    = 0;
      slide       = 0;
      sldActive   = 0;
      sldDone     = 0;
      sldCounter  = 0;
      sldSpeed    = 0;
      sldDelta    = 0;
      sldPointer  = 0;
      sldLen      = 0;
      sldEnd      = 0;
      sldLoopPtr  = 0;
    }
  }
}