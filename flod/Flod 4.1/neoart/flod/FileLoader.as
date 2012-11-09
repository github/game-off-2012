/*
  Flod 4.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod 4.1 - 2012/04/16

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
package neoart.flod {
  import flash.utils.*;
  import neoart.flip.*;
  import neoart.flod.core.*;
  import neoart.flod.deltamusic.*;
  import neoart.flod.digitalmugician.*;
  import neoart.flod.fred.*;
  import neoart.flod.futurecomposer.*;
  import neoart.flod.hippel.*;
  import neoart.flod.hubbard.*;
  import neoart.flod.sidmon.*;
  import neoart.flod.soundfx.*;
  import neoart.flod.soundmon.*;
  import neoart.flod.trackers.*;
  import neoart.flod.fasttracker.*;
  import neoart.flod.whittaker.*;

  public final class FileLoader {
    private var
      player : CorePlayer,
      index  : int,
      amiga  : Amiga,
      mixer  : Soundblaster;

    public function FileLoader() {
      amiga = new Amiga();
      mixer = new Soundblaster();
    }

    public function get tracker():String {
      return (player) ? TRACKERS[index + player.version] : TRACKERS[0];
    }

    public function load(stream:ByteArray):CorePlayer {
      var archive:ZipFile, id:String, value:int;

      stream.endian = "littleEndian";
      stream.position = 0;

      if (stream.readUnsignedInt() == 67324752) {
        archive = new ZipFile(stream);
        stream = archive.uncompress(archive.entries[0]);
      }

      if (!stream) return null;

      if (player && !(player is STPlayer)) {
        player.load(stream);
        if (player.version) return player;
      }

      if (stream.length > 336) {
        stream.position = 38;
        id = stream.readMultiByte(20, CorePlayer.ENCODING);

        if (id == "FastTracker v2.00   " ||
            id == "FastTracker v 2.00  " ||
            id == "Sk@le Tracker"        ||
            id == "MadTracker 2.0"       ||
            id == "MilkyTracker        " ||
            id == "DigiBooster Pro 2.18" ||
            id.indexOf("OpenMPT") != -1) {

          player = new F2Player(mixer);
          player.load(stream);

          if (player.version) {
            index = FASTTRACKER;
            return player;
          }
        }
      }

      stream.endian = "bigEndian";

      if (stream.length > 2105) {
        stream.position = 1080;
        id = stream.readMultiByte(4, CorePlayer.ENCODING);

        if (id == "M.K." || id == "FLT4") {
          player = new MKPlayer(amiga);
          player.load(stream);

          if (player.version) {
            index = NOISETRACKER;
            return player;
          }
        } else if (id == "FEST") {
          player = new HMPlayer(amiga);
          player.load(stream);

          if (player.version) {
            index = HISMASTER;
            return player;
          }
        }
      }

      if (stream.length > 2105) {
        stream.position = 1080;
        id = stream.readMultiByte(4, CorePlayer.ENCODING);

        if (id == "M.K." || id == "M!K!") {
          player = new PTPlayer(amiga);
          player.load(stream);

          if (player.version) {
            index = PROTRACKER;
            return player;
          }
        }
      }

      if (stream.length > 1685) {
        stream.position = 60;
        id = stream.readMultiByte(4, CorePlayer.ENCODING);

        if (id != "SONG") {
          stream.position = 124;
          id = stream.readMultiByte(4, CorePlayer.ENCODING);
        }

        if (id == "SONG" || id == "SO31") {
          player = new FXPlayer(amiga);
          player.load(stream);

          if (player.version) {
            index = SOUNDFX;
            return player;
          }
        }
      }

      if (stream.length > 4) {
        stream.position = 0;
        id = stream.readMultiByte(4, CorePlayer.ENCODING);

        if (id == "ALL ") {
          player = new D1Player(amiga);
          player.load(stream);

          if (player.version) {
            index = DELTAMUSIC;
            return player;
          }
        }
      }

      if (stream.length > 3018) {
        stream.position = 3014;
        id = stream.readMultiByte(4, CorePlayer.ENCODING);

        if (id == ".FNL") {
          player = new D2Player(amiga);
          player.load(stream);

          if (player.version) {
            index = DELTAMUSIC;
            return player;
          }
        }
      }

      if (stream.length > 30) {
        stream.position = 26;
        id = stream.readMultiByte(3, CorePlayer.ENCODING);

        if (id == "BPS" || id == "V.2" || id == "V.3") {
          player = new BPPlayer(amiga);
          player.load(stream);

          if (player.version) {
            index = BPSOUNDMON;
            return player;
          }
        }
      }

      if (stream.length > 4) {
        stream.position = 0;
        id = stream.readMultiByte(4, CorePlayer.ENCODING);

        if (id == "SMOD" || id == "FC14") {
          player = new FCPlayer(amiga);
          player.load(stream);

          if (player.version) {
            index = FUTURECOMP;
            return player;
          }
        }
      }

      if (stream.length > 10) {
        stream.position = 0;
        id = stream.readMultiByte(9, CorePlayer.ENCODING);

        if (id == " MUGICIAN") {
          player = new DMPlayer(amiga);
          player.load(stream);

          if (player.version) {
            index = DIGITALMUG;
            return player;
          }
        }
      }

      if (stream.length > 86) {
        stream.position = 58;
        id = stream.readMultiByte(28, CorePlayer.ENCODING);

        if (id == "SIDMON II - THE MIDI VERSION") {
          player = new S2Player(amiga);
          player.load(stream);

          if (player.version) {
            index = SIDMON;
            return player;
          }
        }
      }

      if (stream.length > 2830) {
        stream.position = 0;
        value = stream.readUnsignedShort();

        if (value == 0x4efa) {
          player = new FEPlayer(amiga);
          player.load(stream);

          if (player.version) {
            index = FREDED;
            return player;
          }
        }
      }

      if (stream.length > 5220) {
        player = new S1Player(amiga);
        player.load(stream);

        if (player.version) {
          index = SIDMON;
          return player;
        }
      }

      stream.position = 0;
      value = stream.readUnsignedShort();
      stream.position = 0;
      id = stream.readMultiByte(4, CorePlayer.ENCODING);

      if (id == "COSO" || value == 0x6000 || value == 0x6002 || value == 0x600e || value == 0x6016) {
        player = new JHPlayer(amiga);
        player.load(stream);

        if (player.version) {
          index = HIPPEL;
          return player;
        }
      }

      stream.position = 0;
      value = stream.readUnsignedShort();

      player = new DWPlayer(amiga);
      player.load(stream);

      if (player.version) {
        index = WHITTAKER;
        return player;
      }

      stream.position = 0;
      value = stream.readUnsignedShort();

      if (value == 0x6000) {
        player = new RHPlayer(amiga);
        player.load(stream);

        if (player.version) {
          index = HUBBARD;
          return player;
        }
      }

      if (stream.length > 1625) {
        player = new STPlayer(amiga);
        player.load(stream);

        if (player.version) {
          index = SOUNDTRACKER;
          return player;
        }
      }

      stream.clear();
      index = 0;
      return player = null;
    }

    private static const
      SOUNDTRACKER = 0,
      NOISETRACKER = 4,
      PROTRACKER   = 9,
      HISMASTER    = 12,
      SOUNDFX      = 13,
      BPSOUNDMON   = 17,
      DELTAMUSIC   = 20,
      DIGITALMUG   = 22,
      FUTURECOMP   = 24,
      SIDMON       = 26,
      WHITTAKER    = 28,
      FREDED       = 29,
      HIPPEL       = 30,
      HUBBARD      = 32,
      FASTTRACKER  = 33,

      TRACKERS = [
        "Unknown Format",
        "Ultimate SoundTracker",
        "D.O.C. SoundTracker 9",
        "Master SoundTracker",
        "D.O.C. SoundTracker 2.0/2.2",
        "SoundTracker 2.3",
        "SoundTracker 2.4",
        "NoiseTracker 1.0",
        "NoiseTracker 1.1",
        "NoiseTracker 2.0",
        "ProTracker 1.0",
        "ProTracker 1.1/2.1",
        "ProTracker 1.2/2.0",
        "His Master's NoiseTracker",
        "SoundFX 1.0/1.7",
        "SoundFX 1.8",
        "SoundFX 1.945",
        "SoundFX 1.994/2.0",
        "BP SoundMon V1",
        "BP SoundMon V2",
        "BP SoundMon V3",
        "Delta Music 1.0",
        "Delta Music 2.0",
        "Digital Mugician",
        "Digital Mugician 7 Voices",
        "Future Composer 1.0/1.3",
        "Future Composer 1.4",
        "SidMon 1.0",
        "SidMon 2.0",
        "David Whittaker",
        "FredEd",
        "Jochen Hippel",
        "Jochen Hippel COSO",
        "Rob Hubbard",
        "FastTracker II",
        "Sk@leTracker",
        "MadTracker 2.0",
        "MilkyTracker",
        "DigiBooster Pro 2.18",
        "OpenMPT"];
  }
}