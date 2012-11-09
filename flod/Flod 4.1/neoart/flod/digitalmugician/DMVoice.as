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
package neoart.flod.digitalmugician {
  import neoart.flod.core.*;

  public final class DMVoice {
    internal var
      channel      : AmigaChannel,
      sample       : DMSample,
      step         : AmigaStep,
      note         : int,
      period       : int,
      val1         : int,
      val2         : int,
      finalPeriod  : int,
      arpeggioStep : int,
      effectCtr    : int,
      pitch        : int,
      pitchCtr     : int,
      pitchStep    : int,
      portamento   : int,
      volume       : int,
      volumeCtr    : int,
      volumeStep   : int,
      mixMute      : int,
      mixPtr       : int,
      mixEnd       : int,
      mixSpeed     : int,
      mixStep      : int,
      mixVolume    : int;

    internal function initialize():void {
      sample       = null;
      step         = null;
      note         = 0;
      period       = 0;
      val1         = 0;
      val2         = 0;
      finalPeriod  = 0;
      arpeggioStep = 0;
      effectCtr    = 0;
      pitch        = 0;
      pitchCtr     = 0;
      pitchStep    = 0;
      portamento   = 0;
      volume       = 0;
      volumeCtr    = 0;
      volumeStep   = 0;
      mixMute      = 1;
      mixPtr       = 0;
      mixEnd       = 0;
      mixSpeed     = 0;
      mixStep      = 0;
      mixVolume    = 0;
    }
  }
}