/*
  Flip 1.2
  2012/03/13
  Christian Corti
  Neoart Costa Rica

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 	OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
package neoart.flip {
  import flash.utils.*;

  public final class ZipEntry {
    public var
      name       : String,
      extra      : ByteArray,
      version    : int,
      flag       : int,
      method     : int,
      time       : uint,
      crc        : uint,
      compressed : uint,
      size       : uint,
      offset     : uint;

    public function get date():Date {
      return new Date(
        ((time >> 25) & 0x7f) + 1980,
        ((time >> 21) & 0x0f) - 1,
         (time >> 16) & 0x1f,
         (time >> 11) & 0x1f,
         (time >>  5) & 0x3f,
         (time & 0x1f) << 1
      );
    }

    public function get isDirectory():Boolean {
      return Boolean(name.charAt(name.length - 1) == "/");
    }
  }
}