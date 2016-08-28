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

  public class ModFlod {
    public static const ENCODING:String = "us-ascii";

    public static const DEFAULT_TEMPO:int = 125;
    public static const DEFAULT_SPEED:int = 6;
    public static const PATTERN_LENGTH:int = 64;
    public static const PATTERN_100:   int = 100;

    public static const PAL_CIATEMPO: int    = 110250
    public static const PAL_VBLTEMPO: Number = 7.584381;
    public static const PAL_SPEED:    Number = 80.42845804;
    public static const NTSC_CIATEMPO:int    = 91875;
    public static const NTSC_VBLTEMPO:Number = 6.3152;
    public static const NTSC_SPEED:   Number = 81.16882086;

    public static const UNSUPPORTED:    int = 0;
    public static const ULTIMATE_ST:    int = 1;
    public static const SOUNDTRACKER:   int = 2;
    public static const ULTIMATE_ST2:   int = 3;
    public static const SOUNDTRACKER_9: int = 4;
    public static const MASTERTRACKER:  int = 5;
    public static const SOUNDTRACKER_20:int = 6;
    public static const SOUNDTRACKER_23:int = 7;
    public static const SOUNDTRACKER_24:int = 8;
    public static const NOISETRACKER_10:int = 9;
    public static const NOISETRACKER_11:int = 10;
    public static const SOUNDTRACKER_25:int = 11;
    public static const NOISETRACKER_12:int = 12;
    public static const STARTREKKER_10: int = 13;
    public static const SOUNDTRACKER_26:int = 14;
    public static const STARTREKKER_12: int = 15;
    public static const PROTRACKER_10:  int = 16;
    public static const PROTRACKER_20:  int = 17;
    public static const PROTRACKER_22:  int = 18;
    public static const PROTRACKER_30:  int = 19;
    public static const MULTITRACKER:   int = 20;

    public static const ARPEGGIO:               int = 0x00;
    public static const PORTAMENTO_UP:          int = 0x01;
    public static const PORTAMENTO_DOWN:        int = 0x02;
    public static const TONE_PORTAMENTO:        int = 0x03;
    public static const VIBRATO:                int = 0x04;
    public static const TONE_PORTA_VOLUME_SLIDE:int = 0x05;
    public static const VIBRATO_VOLUME_SLIDE:   int = 0x06;
    public static const TREMOLO:                int = 0x07;
    public static const UNUSED:                 int = 0x08;
    public static const SAMPLE_OFFSET:          int = 0x09;
    public static const VOLUME_SLIDE:           int = 0x0a;
    public static const POSITION_JUMP:          int = 0x0b;
    public static const SET_VOLUME:             int = 0x0c;
    public static const PATTERN_BREAK:          int = 0x0d;
    public static const EX_EFFECT:              int = 0x0e;
    public static const SET_SPEED:              int = 0x0f;

    public static const SET_FILTER:             int = 0x00;
    public static const FINE_SLIDE_UP:          int = 0x01;
    public static const FINE_SLIDE_DOWN:        int = 0x02;
    public static const GLISSANDO_CONTROL:      int = 0x03;
    public static const VIBRATO_CONTROL:        int = 0x04;
    public static const SET_FINETUNE:           int = 0x05;
    public static const PATTERN_LOOP:           int = 0x06;
    public static const TREMOLO_CONTROL:        int = 0x07;
    public static const KARPLUS_STRONG:         int = 0x08;
    public static const RETRIG_NOTE:            int = 0x09;
    public static const FINE_VOLUME_UP:         int = 0x0a;
    public static const FINE_VOLUME_DOWN:       int = 0x0b;
    public static const NOTE_CUT:               int = 0x0c;
    public static const NOTE_DELAY:             int = 0x0d;
    public static const PATTERN_DELAY:          int = 0x0e;
    public static const INVERT_LOOP:            int = 0x0f;

    public static const PERIODS:Vector.<int> = Vector.<int>([
      856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 453,
      428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240, 226,
      214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120, 113,
      850, 802, 757, 715, 674, 637, 601, 567, 535, 505, 477, 450,
      425, 401, 379, 357, 337, 318, 300, 284, 268, 253, 239, 225,
      213, 201, 189, 179, 169, 159, 150, 142, 134, 126, 119, 113,
      844, 796, 752, 709, 670, 632, 597, 563, 532, 502, 474, 447,
      422, 398, 376, 355, 335, 316, 298, 282, 266, 251, 237, 224,
      211, 199, 188, 177, 167, 158, 149, 141, 133, 125, 118, 112,
      838, 791, 746, 704, 665, 628, 592, 559, 528, 498, 470, 444,
      419, 395, 373, 352, 332, 314, 296, 280, 264, 249, 235, 222,
      209, 198, 187, 176, 166, 157, 148, 140, 132, 125, 118, 111,
      832, 785, 741, 699, 660, 623, 588, 555, 524, 495, 467, 441,
      416, 392, 370, 350, 330, 312, 294, 278, 262, 247, 233, 220,
      208, 196, 185, 175, 165, 156, 147, 139, 131, 124, 117, 110,
      826, 779, 736, 694, 655, 619, 584, 551, 520, 491, 463, 437,
      413, 390, 368, 347, 328, 309, 292, 276, 260, 245, 232, 219,
      206, 195, 184, 174, 164, 155, 146, 138, 130, 123, 116, 109,
      820, 774, 730, 689, 651, 614, 580, 547, 516, 487, 460, 434,
      410, 387, 365, 345, 325, 307, 290, 274, 258, 244, 230, 217,
      205, 193, 183, 172, 163, 154, 145, 137, 129, 122, 115, 109,
      814, 768, 725, 684, 646, 610, 575, 543, 513, 484, 457, 431,
      407, 384, 363, 342, 323, 305, 288, 272, 256, 242, 228, 216,
      204, 192, 181, 171, 161, 152, 144, 136, 128, 121, 114, 108,
      907, 856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480,
      453, 428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240,
      226, 214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120,
      900, 850, 802, 757, 715, 675, 636, 601, 567, 535, 505, 477,
      450, 425, 401, 379, 357, 337, 318, 300, 284, 268, 253, 238,
      225, 212, 200, 189, 179, 169, 159, 150, 142, 134, 126, 119,
      894, 844, 796, 752, 709, 670, 632, 597, 563, 532, 502, 474,
      447, 422, 398, 376, 355, 335, 316, 298, 282, 266, 251, 237,
      223, 211, 199, 188, 177, 167, 158, 149, 141, 133, 125, 118,
      887, 838, 791, 746, 704, 665, 628, 592, 559, 528, 498, 470,
      444, 419, 395, 373, 352, 332, 314, 296, 280, 264, 249, 235,
      222, 209, 198, 187, 176, 166, 157, 148, 140, 132, 125, 118,
      881, 832, 785, 741, 699, 660, 623, 588, 555, 524, 494, 467,
      441, 416, 392, 370, 350, 330, 312, 294, 278, 262, 247, 233,
      220, 208, 196, 185, 175, 165, 156, 147, 139, 131, 123, 117,
      875, 826, 779, 736, 694, 655, 619, 584, 551, 520, 491, 463,
      437, 413, 390, 368, 347, 328, 309, 292, 276, 260, 245, 232,
      219, 206, 195, 184, 174, 164, 155, 146, 138, 130, 123, 116,
      868, 820, 774, 730, 689, 651, 614, 580, 547, 516, 487, 460,
      434, 410, 387, 365, 345, 325, 307, 290, 274, 258, 244, 230,
      217, 205, 193, 183, 172, 163, 154, 145, 137, 129, 122, 115,
      862, 814, 768, 725, 684, 646, 610, 575, 543, 513, 484, 457,
      431, 407, 384, 363, 342, 323, 305, 288, 272, 256, 242, 228,
      216, 203, 192, 181, 171, 161, 152, 144, 136, 128, 121, 114]);
  }
}