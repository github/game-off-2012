/* Flod (replay) version 2.0
   2009/08/15
   Christian Corti
   Neoart Costa Rica

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 	 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 	 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
 	 IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

package neoart.flod {

  public class ModData {
    public var periods:Vector.<int>;
    public var volumes:Vector.<Number>;
    public var position:int;
    public var row:int;
    public var samplesTick:int;
    public var tempo:int;
    public var speed:int;

    public function ModData(numChannels:int) {
      periods = new Vector.<int>(numChannels, true);
      volumes = new Vector.<Number>(numChannels << 1, true);
    }
  }
}