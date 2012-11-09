/*
  Flod 4.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod 4.0 - 2012/02/16

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
package neoart.flod.fred {
  import neoart.flod.core.*;

  public final class FEVoice {
    internal var
      index         : int,
      bitFlag       : int,
      next          : FEVoice,
      channel       : AmigaChannel,
      sample        : FESample,
      trackPos      : int,
      patternPos    : int,
      tick          : int,
      busy          : int,
      synth         : int,
      note          : int,
      period        : int,
      volume        : int,
      envelopePos   : int,
      sustainTime   : int,
      arpeggioPos   : int,
      arpeggioSpeed : int,
      portamento    : int,
      portaCounter  : int,
      portaDelay    : int,
      portaFlag     : int,
      portaLimit    : int,
      portaNote     : int,
      portaPeriod   : int,
      portaSpeed    : int,
      vibrato       : int,
      vibratoDelay  : int,
      vibratoDepth  : int,
      vibratoFlag   : int,
      vibratoSpeed  : int,
      pulseCounter  : int,
      pulseDelay    : int,
      pulseDir      : int,
      pulsePos      : int,
      pulseSpeed    : int,
      blendCounter  : int,
      blendDelay    : int,
      blendDir      : int,
      blendPos      : int;

    public function FEVoice(index:int, bitFlag:int) {
      this.index = index;
      this.bitFlag = bitFlag;
    }

    internal function initialize():void {
      channel       = null;
      sample        = null;
      trackPos      = 0;
      patternPos    = 0;
      tick          = 1;
      busy          = 1;
      note          = 0;
      period        = 0;
      volume        = 0;
      envelopePos   = 0;
      sustainTime   = 0;
      arpeggioPos   = 0;
      arpeggioSpeed = 0;
      portamento    = 0;
      portaCounter  = 0;
      portaDelay    = 0;
      portaFlag     = 0;
      portaLimit    = 0;
      portaNote     = 0;
      portaPeriod   = 0;
      portaSpeed    = 0;
      vibrato       = 0;
      vibratoDelay  = 0;
      vibratoDepth  = 0;
      vibratoFlag   = 0;
      vibratoSpeed  = 0;
      pulseCounter  = 0;
      pulseDelay    = 0;
      pulseDir      = 0;
      pulsePos      = 0;
      pulseSpeed    = 0;
      blendCounter  = 0;
      blendDelay    = 0;
      blendDir      = 0;
      blendPos      = 0;
    }
  }
}