/*
  Flod 4.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod 4.0 - 2012/03/10

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.

  ---

  This is a simple demo showing how to use a single player to play an embedded module.

  List of available players and include locations:

    D1Player    Delta Music 1.0               neoart.flod.deltamusic
    D2Player    Delta Music 2.0               neoart.flod.deltamusic
    DMPlayer    Digital Mugician              neoart.flod.digitalmugician
    F2Player    FastTracker II XM             neoart.flod.fasttracker
    FEPlayer    FredEd                        neoart.flod.fred
    FCPlayer    Future Composer               neoart.flod.futurecomposer
    JHPlayer    Jochen Hippel                 neoart.flod.hippel
    RHPlayer    Rob Hubbard                   neoart.flod.hubbard
    S1Player    SidMON                        neoart.flod.sidmon
    S2Player    SidMON II                     neoart.flod.sidmon
    FXPlayer    SoundFX                       neoart.flod.soundfx
    BPPlayer    SoundMon                      neoart.flod.soundmon
    HMPlayer    His Master's NoiseTracker     neoart.flod.trackers
    MKPlayer    NoiseTracker                  neoart.flod.trackers
    PTPlayer    ProTracker                    neoart.flod.trackers
    STPlayer    Ultimate Soundtracker         neoart.flod.trackers
    DWPlayer    David Whittaker               neoart.flod.whittaker
*/
package {
  import flash.display.*;
  import flash.events.*;
  import flash.utils.*;
  import neoart.flod.core.*;
  import neoart.flod.fred.*;

  public final class Demo4 extends Sprite {
    [Embed(source="filename.mod", mimeType="application/octet-stream")]

    private var
      Song   : Class,
      player : FEPlayer;

    public function Demo4() {
      player = new FEPlayer();
      player.load(new Song() as ByteArray);
      if (player.version) player.play();
    }
  }
}