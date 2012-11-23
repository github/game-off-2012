using UnityEngine;
using System.Collections;
using System.Collections.Generic;
 
public class OTTextSprite : OTSprite
{
	
	public string text;
	public TextAsset textFile;	
	public int wordWrap = 0;
	public bool justify = false;
				
    private string _text;
    private TextAsset _textFile;
	private int _wordWrap = 0;
	private bool _justify = false;
	
	long _bytesLines = 0;
	List<OTTextAlinea> _parsed = new List<OTTextAlinea>();
	
	Vector3[] verts = new Vector3[] {};
	Vector2[] _uv = new Vector2[] {};
	int[] tris = new int[] {};
	

	long GetBytes()
	{
		if (textFile!=null)
			return _textFile.bytes.Length;
		else
			return text.Length;
	}

	string GetDY()
	{
		OTSpriteAtlas atlas = (spriteContainer as OTSpriteAtlas);	
		if (atlas == null) return  "";
		string dy = atlas.GetMeta("dy");
		if (dy=="")
		{
			if (atlas.atlasData.Length>0)
			{
				OTAtlasData d = atlas.DataByName(""+((byte)'J'));
				if (d==null)
					d = atlas.DataByName("J");
				if (d==null)
					d = atlas.atlasData[0];				
				if (d!=null)
					dy = ""+(d.offset.y + d.size.y);
			}
			else
				dy = "50";
		}
		return dy;
	}
		
	void ParseText()
	{
		_bytesLines = GetBytes();
		char[] chars = text.ToCharArray();
		if (textFile!=null)
			chars = textFile.text.ToCharArray();

		for (int p=0; p<_parsed.Count; p++)		
			_parsed[p].Clean();		
		_parsed.Clear();
		
		int dy = System.Convert.ToUInt16(GetDY());
		int yPosition = 0;
		OTSpriteAtlas atlas = (spriteContainer as OTSpriteAtlas);		
		OTTextAlinea alinea = new OTTextAlinea(yPosition);		
		foreach(char c in chars) {
								
			if (c=='\r') continue;
			if (c=='\n')
			{
				alinea.End();
				_parsed.Add(alinea);
				yPosition -= dy;				
				alinea = new OTTextAlinea(yPosition);				
				continue;
			}			
			OTAtlasData data = atlas.DataByName(""+c);
			OTContainer.Frame frame = atlas.FrameByName(""+c);						

			if (data==null || frame.name=="")
			{
				string charName = ((int)c).ToString();
				data = atlas.DataByName(charName);
				frame = atlas.FrameByName(charName);			
			}

			if (data==null || frame.name=="")
			{
				data = atlas.DataByName(""+c+".png");
				frame = atlas.FrameByName(""+c+".png");			
			}			
						
			if (data==null || frame.name=="")
			{
				byte b = System.Text.Encoding.ASCII.GetBytes("?")[0];
				data = atlas.DataByName(""+b);
				frame = atlas.FrameByName(""+b);			
			}
			
			if (data==null || frame.name=="")
			{
				data = atlas.DataByName("32");
				frame = atlas.FrameByName("32");			
			}
			
			if (data!=null && frame.name == data.name)
			{
				if (data.name!="32")
				{					
					Vector3[] verts = new Vector3[] { 
						new Vector3(frame.offset.x, -frame.offset.y,0),
						new Vector3(frame.offset.x+frame.size.x, -frame.offset.y,0),
						new Vector3(frame.offset.x+frame.size.x, -frame.offset.y-frame.size.y,0),
						new Vector3(frame.offset.x, -frame.offset.y - frame.size.y,0)					
					};
					alinea.Add(((char)c).ToString(), data, verts, frame.uv);
				}								
				else
				  alinea.NextWord(data);
			}						
		}
		alinea.End();
		_parsed.Add(alinea);												
		
		if (wordWrap > 0)
			for (int p=0; p<_parsed.Count; p++)
			{
				_parsed[p].WordWrap(wordWrap, dy);				
				for (int pp = p+1; pp<_parsed.Count; pp++)
					_parsed[pp].lines[0].yPosition -= (dy * (_parsed[p].lines.Count-1));
			}
		
	}
	
    protected override Mesh GetMesh()
    {						
		if (_spriteContainer==null || (_spriteContainer!=null && !_spriteContainer.isReady))
			return null;
		
		ParseText();
			
		verts = new Vector3[] {};
		_uv = new Vector2[] {};
		tris = new int[] {};
				
		Mesh mesh = InitMesh();

		mesh.vertices = verts;
        mesh.uv = _uv;		
        mesh.triangles = tris;				

        mesh.RecalculateBounds();
        mesh.RecalculateNormals();
								
		// calculate maximum width
		int wi = 0;
		for (int p = 0; p<_parsed.Count; p++)
			for (int l=0; l<_parsed[p].lines.Count; l++)
				if (_parsed[p].lines[l].width>wi)
						wi = _parsed[p].lines[l].width;
		
		
		for (int p = 0; p<_parsed.Count; p++)
			for (int l=0; l<_parsed[p].lines.Count; l++)
			{
				Vector3[] lineVerts = _parsed[p].lines[l].GetVerts(wi,pivotPoint, (l==_parsed[p].lines.Count-1)?false:justify);
				Vector2[] lineUV = _parsed[p].lines[l].uv;

				int vIdx = verts.Length;
				int uIdx = _uv.Length;
				int tIdx = tris.Length;
			
				System.Array.Resize<Vector3>(ref verts, verts.Length + lineVerts.Length);
				lineVerts.CopyTo(verts,vIdx);
				System.Array.Resize<int>(ref tris, tris.Length + (6 * _parsed[p].lines[l].charCount));
				for (int tr = 0; tr< _parsed[p].lines[l].charCount; tr++)
				{
					new int[] {
						vIdx, vIdx+1, vIdx+2,
						vIdx+2, vIdx+3, vIdx
					}.CopyTo(tris, tIdx);
					vIdx += 4;
					tIdx += 6;
				}
		
			 	System.Array.Resize<Vector2>(ref _uv, _uv.Length + lineUV.Length );			
				lineUV.CopyTo(_uv, uIdx);
			
			
			}		
		
        mesh.vertices = verts;
        mesh.triangles = tris;				
        mesh.uv = _uv;		
		
        mesh.RecalculateBounds();
		
		Bounds bo = mesh.bounds;
		Matrix4x4 mx = new Matrix4x4();

		Vector2 ext = bo.extents;
		Vector2 cen = -bo.center;
		
		Vector2 vdx = cen +
			new Vector2( (ext.x * 2) * -pivotPoint.x ,
					 (ext.y * 2) * -pivotPoint.y);
								
		mx.SetTRS( vdx ,Quaternion.identity,Vector3.one);		
		for (int i=0; i<verts.Length; i++)
			verts[i] = mx.MultiplyPoint3x4(verts[i]);
								
        mesh.vertices = verts;
				
        return mesh;
    }
	
	protected override void AfterMesh()
	{
		base.AfterMesh();
		if (transform.parent!=null && transform.parent.GetComponent("OTSpriteBatch")!=null)
			transform.parent.SendMessage("SpriteAfterMesh",this,SendMessageOptions.DontRequireReceiver);
		
		if (collider!=null && collider is BoxCollider)
		{
			BoxCollider b = (collider as BoxCollider);
			b.center = mesh.bounds.center;
			b.size = mesh.bounds.extents*2;
		}
		
		
	}
			
    //-----------------------------------------------------------------------------
    // overridden subclass methods
    //-----------------------------------------------------------------------------	
    
    protected override void CheckSettings()
    {		
		if (_spriteContainer!=null && _spriteContainer.isReady)
		{			
			if (_spriteContainer_ != spriteContainer)
				meshDirty = true;
		}
		else
		{
			if (spriteContainer==null && _spriteContainer_!=null)
				meshDirty = true;
		}
				
        base.CheckSettings();			
    }

    
    protected override string GetTypeName()
    {
        return "Text";
    }
			
    protected override void HandleUV()
    {
        if (spriteContainer != null && spriteContainer.isReady)
        {
        }
    }
	
	protected override void Clean()
	{		
		adjustFrameSize = false;
		base.Clean();	
		offset = Vector2.zero;
	}

    //-----------------------------------------------------------------------------
    // class methods
    //-----------------------------------------------------------------------------				
    
    protected override void Awake()
    {
        base.Awake();
		_text = text;
		_textFile = textFile;
		_wordWrap = wordWrap;
		_justify = justify;
		
		if (lastContainer!=null && _spriteContainer == null)
		{
			_spriteContainer = lastContainer;
			_tintColor = lastColor;
			_materialReference = lastMatRef;
			_depth = lastDepth;
		}
		
    }

    protected override void Start()
    {
        base.Start();
    }
	
	public static OTContainer lastContainer = null;
	public static Color lastColor;
	public static string lastMatRef;
	public static int lastDepth;
	
	
	
    // Update is called once per frame
    protected override void Update()
    {
		if (spriteContainer==null || (spriteContainer!=null && !spriteContainer.isReady))
			return;
				
		if (Application.isEditor)
		{
			lastContainer = spriteContainer;
			lastColor = tintColor;
			lastMatRef = materialReference;
			lastDepth = depth;
			
			if (wordWrap<0) wordWrap = 0;
			
		}		
		
		if (_text!=text || _textFile!=textFile || _bytesLines != GetBytes() || 
			_wordWrap!=wordWrap || _justify!=justify )
		{
			_text = text;
			_textFile = textFile;
			_wordWrap = wordWrap;
			_justify = justify;
			meshDirty = true;
		}
				
        base.Update();
    }
}


class OTTextAlinea
{
	public List<OTTextLine> lines = new List<OTTextLine>();
		
	public OTTextAlinea(int yPosition)
	{
		lines.Add(new OTTextLine(yPosition, true));
	}
	
	public void Clean()
	{
		for (int l=0; l<lines.Count; l++)
			lines[l].Clean();
		lines.Clear();
	}
	
	public void Add(string c, OTAtlasData data, Vector3[] verts, Vector2[] uv)
	{
		lines[lines.Count-1].Add(c, data, verts, uv);
	}
	
	public void NextWord(OTAtlasData space)
	{
		lines[lines.Count-1].NextWord(space);
	}
	
	public void End()
	{
		lines[lines.Count-1].End();
	}
	
	
	public void WordWrap(int wrapWidth, int dy)
	{
		List<OTTextLine> _lines = new List<OTTextLine>();
		for (int l=0; l<lines.Count; l++)
			_lines.AddRange(lines[l].WordWrap(wrapWidth, dy));		
		
		if (_lines.Count>1)
		{
			lines.Clear();
			lines.AddRange(_lines);
		}		
	}
		
}

class OTTextLine
{
	public int charCount;
	public int yPosition;
	
	
	public string text
	{
		get
		{
			string res = "";
			for (int w=0; w<words.Count; w++)
			{
				res += words[w].text;
				if (w<words.Count-1)
					res +=" ";
			}
			return res;
		}
	}
	
	public Vector2[] uv
	{
		get
		{
			Vector2[] _uv = new Vector2[]{};
			for (int w=0; w<words.Count; w++)
			{
				Vector2[] wUV = words[w].uv;
				System.Array.Resize<Vector2>(ref _uv, _uv.Length + wUV.Length);
				wUV.CopyTo(_uv, _uv.Length - wUV.Length);
			}
			return _uv;
		}
	}

	public Vector3[] GetVerts(int maxWidth, Vector2 pivot, bool justify)
	{
		int tt = 0;		
		float twx = 0;
		float spacing = 0;
		if (words.Count>1)
			spacing = (maxWidth - width)/(words.Count-1);
		if (maxWidth>0 && !justify)
			twx = (float)(maxWidth - width) * (pivot.x + 0.5f);
				
		Vector3[] _verts = new Vector3[]{};
		for (int w=0; w<words.Count; w++)
		{
			Vector3[] wVerts = words[w].verts;
	
			if (tt>0 || twx > 0 || yPosition!=0)
			{
				Matrix4x4 mx = new Matrix4x4();
				mx.SetTRS(new Vector3(tt+twx,yPosition,0), Quaternion.identity, Vector3.one);
				for (int i=0; i<wVerts.Length; i++)
					wVerts[i] = mx.MultiplyPoint3x4(wVerts[i]);
			}

			tt += words[w].width + words[w].space;
			if (justify)
				tt+=(int)spacing;
				
			System.Array.Resize<Vector3>(ref _verts, _verts.Length + wVerts.Length);
			wVerts.CopyTo(_verts, _verts.Length - wVerts.Length);
		}
		return _verts;		
	}
		
	public int width = 0;
	public List<OTTextWord> words = new List<OTTextWord>();
	public void Clean()
	{
		width = 0;
		charCount = 0;
		for (int w=0; w<words.Count; w++)
			words[w].Clean();
		words.Clear();
	}
	
	OTTextWord word;
	public OTTextLine(int yPosition, bool createWord)
	{
		this.yPosition = yPosition;
		word = null;
		if (createWord)
			Word();
	}

	
	void Word()
	{
		words.Add(new OTTextWord());
		word = words[words.Count-1];
	}
	
	public void NextWord(OTAtlasData space)
	{
		word.End(space);
		Word();
	}

	public void End()
	{
		if (word!=null)
			word.End(null);		
		width = 0;
		charCount = 0;
		for (int i=0; i<words.Count; i++)
		{
			width += (words[i].width + words[i].space);
			charCount += words[i].atlasData.Count;
		}
	}
		
	public void Add(string c, OTAtlasData data, Vector3[] verts, Vector2[] uv )
	{
		word.Add(c, data, verts, uv);
	}
	
	public List<OTTextLine> WordWrap(int wrapWidth, int dy)
	{				
		List<OTTextLine> wLines = new List<OTTextLine>();
		if (words.Count>0)
		{
			OTTextLine line = new OTTextLine(yPosition, false);
			wLines.Add(line);
			int ww = 0; int yp = yPosition;
			for (int w=0; w<words.Count; w++)
			{
				line.words.Add(words[w]);
				if (w < words.Count-1)
				{
					ww += words[w].width;
					if (ww >= wrapWidth || ww + words[w].space >= wrapWidth || ww + words[w+1].width > wrapWidth)
					{
						// wrap
						ww = 0;
						yp -= dy;
						line.End();
						line = new OTTextLine(yp, false);
						wLines.Add(line);
					}
					else
						ww += words[w].space;
				}
			}
			line.End();
		}		
		return wLines;
	}
	
}

class OTTextWord
{	
	public int width = 0;
	public string text = "";
	public List<OTAtlasData> atlasData = new List<OTAtlasData>();		
	public List<int> txList = new List<int>();		
	public int space = 0;
	public Vector3[] verts = new Vector3[] {};
	public Vector2[] uv = new Vector2[] {};
	
	public void Clean()
	{
		atlasData.Clear();
		txList.Clear();
		System.Array.Resize(ref verts, 0);
		System.Array.Resize(ref uv, 0);
	}
	
	public void Add(string c, OTAtlasData data, Vector3[] verts, Vector2[] uv)
	{
		text+=c;
		
		int tx = 0;
		string dx = data.GetMeta("dx");
		if (dx=="")
			tx = (int)(data.offset.x + data.size.x);
		else
			tx = System.Convert.ToUInt16(dx);
		txList.Add(tx);
		atlasData.Add(data);
		
		int tt = 0;
		for (int i=0; i<txList.Count-1; i++)
			tt+=txList[i];
		
		Matrix4x4 mx = new Matrix4x4();
		mx.SetTRS(new Vector3(tt,0,0), Quaternion.identity, Vector3.one);
		for (int i=0; i<verts.Length; i++)
			verts[i] = mx.MultiplyPoint3x4(verts[i]);
	
		System.Array.Resize<Vector3>(ref this.verts, this.verts.Length + verts.Length);
		verts.CopyTo(this.verts, this.verts.Length - verts.Length);		
		System.Array.Resize<Vector2>(ref this.uv, this.uv.Length + uv.Length);
		uv.CopyTo(this.uv, this.uv.Length - uv.Length);				
	}
	
	public void End(OTAtlasData space)
	{
		width = 0;
		string dx = "";
				
		for (int i=0; i<atlasData.Count; i++)
		{
			dx = atlasData[i].GetMeta("dx");
			if (dx=="")
				width += (int)(atlasData[i].offset.x + atlasData[i].size.x);
			else
				width += System.Convert.ToUInt16(dx);
		}
		
		if (space!=null)
		{
			dx = space.GetMeta("dx");
			if (dx=="")
				this.space = (int)(space.offset.x + space.size.x);
			else
				this.space = System.Convert.ToUInt16(dx);			
			if (this.space == 0)
				this.space = 30;				
		}
		
	}
	
}
