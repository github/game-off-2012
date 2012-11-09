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
  formats, loaded from the client.

*/
package {
  import flash.display.*;
  import flash.events.*;
  import flash.net.*;
  import neoart.flod.*;
  import neoart.flod.core.*;

  public class Demo1 extends Sprite {
    private var
      file   : FileReference,
      loader : FileLoader,
      player : CorePlayer;

    public function Demo1() {
      loader = new FileLoader();

      stage.addEventListener(MouseEvent.CLICK, function(e:MouseEvent):void {
        file = new FileReference();
        file.addEventListener(Event.CANCEL, cancelHandler);
        file.addEventListener(Event.SELECT, selectHandler);
        file.browse();
      });
    }

    private function cancelHandler(e:Event):void {
      file.removeEventListener(Event.CANCEL, cancelHandler);
      file.removeEventListener(Event.SELECT, selectHandler);
    }

    private function selectHandler(e:Event):void {
      cancelHandler(e);
      if (player) player.stop();
      file.addEventListener(Event.COMPLETE, completeHandler);
      file.load();
    }

    private function completeHandler(e:Event):void {
      file.removeEventListener(Event.COMPLETE, completeHandler);
      player = loader.load(file.data);
      if (player && player.version) player.play();
    }
  }
}