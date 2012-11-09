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

  This is a simple demo showing how to use the FileLoader class to play a module, in any of the supported
  formats, loaded from the server.

  Warning: the server must be able to handle the correct file extension, if it can't just rename the file
  to filename.wav and it should work...
*/
package {
  import flash.display.*;
  import flash.events.*;
  import flash.net.*;
  import neoart.flod.*;
  import neoart.flod.core.*;

  public final class Demo5 extends Sprite {
    private var
      url    : URLLoader,
      loader : FileLoader,
      player : CorePlayer;

    public function Demo5() {
      loader = new FileLoader();

      url = new URLLoader();
      url.dataFormat = URLLoaderDataFormat.BINARY;
      url.addEventListener(Event.COMPLETE, completeHandler);
      url.load(new URLRequest("filename.mod"));
    }

    private function completeHandler(e:Event):void {
      url.removeEventListener(Event.COMPLETE, completeHandler);
      player = loader.load(url.data);
      if (player && player.version) player.play();
    }
  }
}