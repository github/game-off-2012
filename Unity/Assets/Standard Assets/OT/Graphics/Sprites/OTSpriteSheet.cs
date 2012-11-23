using UnityEngine;
using System.Collections;
 
/// <summary>
/// Is a sprite container with image frames with the same width and height.
/// </summary>
public class OTSpriteSheet : OTContainer
{
    
    public Vector2 _framesXY = Vector2.one;
    
    public Vector2 _sheetSize = Vector2.zero;
    
    public Vector2 _frameSize = Vector2.zero;
    /// <summary>
    /// Spritesheet's texture
    /// </summary>
    public Texture texture;

    Vector2 _framesXY_ = Vector2.one;
    Vector2 _sheetSize_ = Vector2.zero;
    Vector2 _frameSize_ = Vector2.zero;
	Texture _texture;

    /// <summary>
    /// Number of frames horizontally (x) and vertically (y)
    /// </summary>
    /// <remarks>
    /// The columns (x) are the horizontal number of frames. The rows (y) are the vertical
    /// number of frames. This size will determine the texture scaling and offsetting for this
    /// container's frames.
    /// <br></br><br></br>
    /// Each frame of a SpriteSheet always has the same width and height.
    /// </remarks>
    public Vector2 framesXY
    {
        get
        {
            return _framesXY;
        }
        set
        {
            _framesXY = value;
            dirtyContainer = true;
        }
    }

    /// <summary>
    /// Original sheet size
    /// </summary>
    /// <remarks>
    /// This setting is optional and only used in combination with frameSize when
    /// the frames do not exactly fill up the texture horizontally and/or vertically.
    /// <br></br><br></br>
    /// Sometimes a sheet has some left over space to the right or bottom of the
    /// texture that was used. By setting the original sheetSize and the frameSize, 
    /// the empty left-over space can be calculated and taken into account when
    /// setting the texture scaling and frame texture offsetting.
    /// </remarks>
    public Vector2 sheetSize
    {
        get
        {
            return _sheetSize;
        }
        set
        {
            _sheetSize = value;
            dirtyContainer = true;
        }
    }

    /// <summary>
    /// Original frame size
    /// </summary>
    /// <remarks>
    /// This setting is optional and only used in combination with sheetSize when
    /// the frames do not exactly fill up the texture horizontally and/or vertically.
    /// <br></br><br></br>
    /// Sometimes a sheet has some left over space to the right or bottom of the
    /// texture that was used. By setting the original sheetSize and the frameSize, 
    /// the empty left-over space can be calculated and taken into account when
    /// setting the texture scaling and frame texture offsetting.
    /// </remarks>
    public Vector2 frameSize
    {
        get
        {
            return _frameSize;
        }
        set
        {
            _frameSize = value;
            dirtyContainer = true;
        }
    }

    
    override public Texture GetTexture()
    {
        return texture;
    }

    
    override protected Frame[] GetFrames()
    {
        if (framesXY.x == 0 || framesXY.y == 0)
            return new Frame[] { };

        Frame[] frames = new Frame[(int)framesXY.x * (int)framesXY.y];


        Vector2 drop = Vector2.zero;
        if (!Vector2.Equals(Vector2.zero, sheetSize) && !Vector2.Equals(Vector2.zero, frameSize))
        {
            drop = new Vector2(
                (sheetSize.x - (frameSize.x * framesXY.x)) / sheetSize.x,
                (sheetSize.y - (frameSize.y * framesXY.y)) / sheetSize.y);
        }

        for (int f = 0; f < frames.Length; f++)
        {
            float scx = (1 - drop.x) / framesXY.x;
            float scy = (1 - drop.y) / framesXY.y;

            Frame frame = new Frame();

            int tY = (int)Mathf.Floor(f / framesXY.x);
            int tX = f - (int)(tY * framesXY.x);

            frame.uv = new Vector2[4];
            float sx = tX * scx;
            float sy = drop.y + (framesXY.y - 1 - tY) * scy;
            frame.uv[0] = new Vector2(sx, sy + scy);
            frame.uv[1] = new Vector2(sx + scx, sy + scy);
            frame.uv[2] = new Vector2(sx + scx, sy);
            frame.uv[3] = new Vector2(sx, sy);

            // in a spritesheet each frame has exact the same size so no
            // scaling and no offsetting;
            if (!Vector2.Equals(frameSize, Vector2.zero))
                frame.size = frameSize;
            else
            {
                if (texture != null)
                    frame.size = new Vector2(texture.width / framesXY.x, texture.height / framesXY.y);
            }
            frame.offset = Vector2.zero;
            frame.imageSize = frameSize;
            frame.rotation = 0;
            frame.name = "frame" + f;

            frames[f] = frame;
        }
        return frames;
    }


    
    new protected void Start()
    {
        _framesXY_ = framesXY;
        _sheetSize_ = sheetSize;
        _frameSize_ = frameSize;
		_texture = texture;
        base.Start();
    }

    
    new protected void Update()
    {
        if (!Vector2.Equals(_framesXY, _framesXY_))
        {
            _framesXY_ = _framesXY;
            dirtyContainer = true;
        }
        if (!Vector2.Equals(_sheetSize, _sheetSize_))
        {
            _sheetSize_ = _sheetSize;
            dirtyContainer = true;
        }
        if (!Vector2.Equals(_frameSize, _frameSize_))
        {
            _frameSize_ = _frameSize;
            dirtyContainer = true;
        }
		if (_texture != texture)
		{
			_texture = texture;
            dirtyContainer = true;			
		}		
        base.Update();
    }


}