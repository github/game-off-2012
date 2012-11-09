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
package neoart.flod.futurecomposer {
  import neoart.flod.core.*;

  public final class FCVoice {
    internal var
      index          : int,
      next           : FCVoice,
      channel        : AmigaChannel,
      sample         : AmigaSample,
      enabled        : int,
      pattern        : int,
      soundTranspose : int,
      transpose      : int,
      patStep        : int,
      frqStep        : int,
      frqPos         : int,
      frqSustain     : int,
      frqTranspose   : int,
      volStep        : int,
      volPos         : int,
      volCtr         : int,
      volSpeed       : int,
      volSustain     : int,
      note           : int,
      pitch          : int,
      volume         : int,
      pitchBendFlag  : int,
      pitchBendSpeed : int,
      pitchBendTime  : int,
      portamentoFlag : int,
      portamento     : int,
      volBendFlag    : int,
      volBendSpeed   : int,
      volBendTime    : int,
      vibratoFlag    : int,
      vibratoSpeed   : int,
      vibratoDepth   : int,
      vibratoDelay   : int,
      vibrato        : int;

    public function FCVoice(index:int) {
      this.index = index;
    }

    internal function initialize():void {
      sample         = null;
      enabled        = 0;
      pattern        = 0;
      soundTranspose = 0;
      transpose      = 0;
      patStep        = 0;
      frqStep        = 0;
      frqPos         = 0;
      frqSustain     = 0;
      frqTranspose   = 0;
      volStep        = 0;
      volPos         = 0;
      volCtr         = 1;
      volSpeed       = 1;
      volSustain     = 0;
      note           = 0;
      pitch          = 0;
      volume         = 0;
      pitchBendFlag  = 0;
      pitchBendSpeed = 0;
      pitchBendTime  = 0;
      portamentoFlag = 0;
      portamento     = 0;
      volBendFlag    = 0;
      volBendSpeed   = 0;
      volBendTime    = 0;
      vibratoFlag    = 0;
      vibratoSpeed   = 0;
      vibratoDepth   = 0;
      vibratoDelay   = 0;
      vibrato        = 0;
    }

    internal function volumeBend():void {
      volBendFlag ^= 1;

      if (volBendFlag) {
        volBendTime--;
        volume += volBendSpeed;
        if (volume < 0 || volume > 64) volBendTime = 0;
      }
    }
  }
}