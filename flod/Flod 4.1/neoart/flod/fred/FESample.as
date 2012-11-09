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

  public final class FESample {
    internal var
      pointer       : int,
      loopPtr       : int,
      length        : int,
      relative      : int,
      type          : int,
      synchro       : int,
      envelopeVol   : int,
      attackSpeed   : int,
      attackVol     : int,
      decaySpeed    : int,
      decayVol      : int,
      sustainTime   : int,
      releaseSpeed  : int,
      releaseVol    : int,
      arpeggio      : Vector.<int>,
      arpeggioLimit : int,
      arpeggioSpeed : int,
      vibratoDelay  : int,
      vibratoDepth  : int,
      vibratoSpeed  : int,
      pulseCounter  : int,
      pulseDelay    : int,
      pulsePosL     : int,
      pulsePosH     : int,
      pulseSpeed    : int,
      pulseRateNeg  : int,
      pulseRatePos  : int,
      blendCounter  : int,
      blendDelay    : int,
      blendRate     : int;

    public function FESample() {
      arpeggio = new Vector.<int>(16, true);
    }
  }
}