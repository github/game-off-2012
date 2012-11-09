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

  public final class Inflater {
    internal var
      output   : ByteArray;
    private var
      inpbuf   : ByteArray,
      inpcnt   : int,
      outcnt   : int,
      bitbuf   : int,
      bitcnt   : int,
      flencode : Huffman,
      fdiscode : Huffman,
      dlencode : Huffman,
      ddiscode : Huffman;

    public function Inflater() {
      initialize();
    }

    public function set input(stream:ByteArray):void {
      inpbuf = stream;
      output = new ByteArray();
      inpbuf.endian   = output.endian   = ZipFile.ENDIAN;
      inpbuf.position = output.position = 0;
      inpcnt = outcnt = 0;
    }

    public function inflate():int {
      var err:int, last:int, type:int;

      do {
        last = bits(1);
        type = bits(2);
        err = type == 0 ? stored() :
              type == 1 ? codes(flencode, fdiscode) :
              type == 2 ? dynamic() : 1;

        if (err) throw new Error(ERROR1, 1);
      } while (!last);

      return 0;
    }

    private function bits(need:int):int {
      var buff:int = bitbuf, inplen:uint = inpbuf.length;

      while (bitcnt < need) {
        if (inpcnt == inplen) throw new Error(ERROR2, 2);
        buff |= inpbuf[int(inpcnt++)] << bitcnt;
        bitcnt += 8;
      }

      bitbuf = buff >> need;
      bitcnt -= need;
      return buff & ((1 << need) - 1);
    }

    private function codes(lencode:Huffman, discode:Huffman):int {
      var dis:int, len:int, pos:int, sym:int;

      do {
        sym = decode(lencode);
        if (sym < 0) return sym;

        if (sym < 256) {
          output[int(outcnt++)] = sym;
        } else if (sym > 256) {
          sym -= 257;
          if (sym >= 29) throw new Error(ERROR3, 3);
          len = LENG[sym] + bits(LEXT[sym]);

          sym = decode(discode);
          if (sym < 0) return sym;
          dis = DIST[sym] + bits(DEXT[sym]);
          if (dis > outcnt) throw new Error(ERROR4, 4);

          pos = outcnt - dis;
          while (len--) output[int(outcnt++)] = output[int(pos++)];
        }
      } while (sym != 256);

      return 0;
    }

    private function construct(huff:Huffman, length:Vector.<int>, n:int):int {
      var len:int, left:int = 1, offs:Vector.<int> = new Vector.<int>(16, true), sym:int;

      for (len = 0; len < 16; ++len) huff.count[len] = 0;
      for (sym = 0; sym <  n; ++sym) huff.count[length[sym]]++;
      if (huff.count[0] == n) return 0;

      for (len = 1; len < 16; ++len) {
        left <<= 1;
        left -= huff.count[len];
        if (left < 0) return left;
      }

      for (len = 1; len < 15; ++len)
        offs[int(len + 1)] = offs[len] + huff.count[len];

      for (sym = 0; sym <  n; ++sym)
        if (length[sym] != 0) huff.symbol[int(offs[length[sym]]++)] = sym;

      return left;
    }

    private function decode(huff:Huffman):int {
      var buff:int = bitbuf, code:int, count:int, first:int, index:int, inplen:uint = inpbuf.length, left:int = bitcnt, len:int = 1;

      while (1) {
        while (left--) {
          code |= buff & 1;
          buff >>= 1;
          count = huff.count[len];

          if (code < int(first + count)) {
            bitbuf = buff;
            bitcnt = (bitcnt - len) & 7;
            return huff.symbol[int(index + (code - first))];
          }

          index += count;
          first += count;
          first <<= 1;
          code  <<= 1;
          ++len;
        }

        left = 16 - len;
        if (left == 0) break;
        if (inpcnt == inplen) throw new Error(ERROR2, 2);
        buff = inpbuf[int(inpcnt++)];
        if (left > 8) left = 8;
      }

      return -9;
    }

    private function stored():int {
      var inplen:uint = inpbuf.length, len:int;
      bitbuf = bitcnt = 0;

      if ((inpcnt + 4) > inplen) throw new Error(ERROR2, 2);
      len  = inpbuf[int(inpcnt++)];
      len |= inpbuf[int(inpcnt++)] << 8;

      if (inpbuf[int(inpcnt++)] != ( ~len & 0xff) ||
          inpbuf[int(inpcnt++)] != ((~len >> 8) & 0xff)) throw new Error(ERROR5, 5);

      if ((inpcnt + len) > inplen) throw new Error(ERROR2, 2);
      while (len--) output[int(outcnt++)] = inpbuf[int(inpcnt++)];
      return 0;
    }

    private function initialize():void {
      var length:Vector.<int> = new Vector.<int>(288, true), sym:int;
      flencode = new Huffman(288);
      fdiscode = new Huffman(30);

      for (sym = 0; sym < 144; ++sym) length[sym] = 8;
      for (; sym < 256; ++sym) length[sym] = 9;
      for (; sym < 280; ++sym) length[sym] = 7;
      for (; sym < 288; ++sym) length[sym] = 8;
      construct(flencode, length, 288);

      for (sym = 0; sym < 30; ++sym) length[sym] = 5;
      construct(fdiscode, length, 30);

      dlencode = new Huffman(286);
      ddiscode = new Huffman(30);
    }

    private function dynamic():int {
      var err:int, index:int, len:int, length:Vector.<int> = new Vector.<int>(316, true), nlen:int = bits(5) + 257, ndis:int = bits(5) + 1, ncode:int = bits(4) + 4, max:int = nlen + ndis, sym:int;

      if (nlen > 286 || ndis > 30) throw new Error(ERROR6, 6);
      for (index = 0; index < ncode; ++index) length[ORDER[index]] = bits(3);
      for (; index < 19; ++index) length[ORDER[index]] = 0;

      err = construct(dlencode, length, 19);
      if (err) throw new Error(ERROR7, 7);
      index = 0;

      while (index < max) {
        sym = decode(dlencode);

        if (sym < 16) {
          length[int(index++)] = sym;
        } else {
          len = 0;

          if (sym == 16) {
            if (index == 0) throw new Error(ERROR8, 8);
            len = length[int(index - 1)];
            sym = 3 + bits(2);
          } else if (sym == 17) {
            sym = 3 + bits(3);
          } else {
            sym = 11 + bits(7);
          }

          if ((index + sym) > max) throw new Error(ERROR9, 9);
          while (sym--) length[int(index++)] = len;
        }
      }

      err = construct(dlencode, length, nlen);
      if (err < 0 || (err > 0 && nlen - dlencode.count[0] != 1)) throw new Error(ERROR10, 10);

      err = construct(ddiscode, length.slice(nlen), ndis);
      if (err < 0 || (err > 0 && ndis - ddiscode.count[0] != 1)) throw new Error(ERROR11, 11);

      return codes(dlencode, ddiscode);
    }

    private static const
      ERROR1   : String = "Invalid block type.",
      ERROR2   : String = "Available inflate data did not terminate.",
      ERROR3   : String = "Invalid literal/length or distance code.",
      ERROR4   : String = "Distance is too far back.",
      ERROR5   : String = "Stored block length did not match one's complement.",
      ERROR6   : String = "Too many length or distance codes.",
      ERROR7   : String = "Code lengths codes incomplete.",
      ERROR8   : String = "Repeat lengths with no first length.",
      ERROR9   : String = "Repeat more than specified lengths.",
      ERROR10  : String = "Invalid literal/length code lengths.",
      ERROR11  : String = "Invalid distance code lengths.",

      LENG  : Vector.<int> = Vector.<int>([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258]),
      LEXT  : Vector.<int> = Vector.<int>([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]),
      DIST  : Vector.<int> = Vector.<int>([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577]),
      DEXT  : Vector.<int> = Vector.<int>([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]),
      ORDER : Vector.<int> = Vector.<int>([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);
  }
}