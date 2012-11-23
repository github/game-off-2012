/*********************************************************************
 * EASING EQUATIONS
 * 
 * Open source under the BSD License.
 * Copyright � 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following 
 * conditions are met:
 * 
 * - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer 
 *   in the documentation and/or other materials provided with the distribution.
 * - Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software 
 *   without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT 
 * NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE 
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY 
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
using UnityEngine;
using System.Collections;


public class OTEaseElasticIn : OTEase
{
    private float _2PI = Mathf.PI * 2;
    float p = 0;
    float a = 0;
    
    public override float ease(float t, float b, float c, float d)
    {
        float s;

        if (t == 0) return b;  
        if ((t/=d)==1) 
            return b+c;  
        if (p==0) p=d*.3f;
		if (a==0 || a < Mathf.Abs(c)) 
        { 
            a=c; s = p/4; 
        }
		else 
            s = p/_2PI * Mathf.Asin (c/a);

		return -(a*Mathf.Pow(2,10*(t-=1)) * Mathf.Sin( (t*d-s)*_2PI/p )) + b;
    }

    
    public OTEaseElasticIn()
    {
        this.a = 0;
        this.p = 0;
    }

    
    public OTEaseElasticIn(float a, float p)
    {
        this.a = a;
        this.p = p;
    }

}
