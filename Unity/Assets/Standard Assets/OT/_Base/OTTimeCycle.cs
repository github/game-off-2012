using UnityEngine;
using System;

public class OTTimeCycle
{    
    public delegate void CycleDelegate(OTTimeCycle cycle);
    public delegate void CyclePartDelegate(OTTimeCycle cycle, string name, float position);
    public CycleDelegate onStart = null;
    public CycleDelegate onUpdate = null;
    public CyclePartDelegate onUpdatePart = null;
    public CycleDelegate onComplete = null;
    public OTTimeCyclePart[] parts = new OTTimeCyclePart[] { };

    public float position {
        get{
            if (duration > 0)
                return time / duration;
            else
                return 0;
        }
        set
        {
            time = duration * value;
        }
    }

    public float duration
    {
        get
        {
            return _duration;
        }
        set
        {
            _duration = value;
            if (position >= 1)
                position = 0;
        }
    }

    public float speed {
        get
        {
            return _speed;
        }
        set
        {
            _speed = value;
        }
    }
   
    float time = 0;
    float _speed = 1;
    float _duration = 0;
    int currentPart = 0;
    float currentStart = 0;

    public OTTimeCycle(float duration)
    {
        this.duration = duration;
    }

    public void Update()
    {
        if (duration<=0) return;

        if (time == 0 && onStart != null)
        {
            onStart(this);
            currentPart = 0;
            currentStart = 0;
        }

        if (parts.Length > 0)
        {
            OTTimeCyclePart part = parts[currentPart];
            float pTime = time - currentStart;
            if (pTime > part.length)
            {
                currentStart += part.length;
                pTime -= part.length;
                currentPart++;
                if (currentPart>=parts.Length)
                    currentPart = 0;
                part = parts[currentPart];
            }

            // OT.print("time = " + time + " , ptime = " + pTime + " part = " + currentPart);

            float partPosition = parts[currentPart].ease.ease(pTime, 0, 1, part.length);
            if (onUpdatePart != null)
                onUpdatePart(this, part.name, partPosition);

        }

        if (onUpdate!=null)
            onUpdate(this);

        time += (Time.deltaTime * speed);
        if (time>=duration) 
        {
            if (onComplete!=null)
                onComplete(this);

            time -= duration;
            if (time>0)
            {
                if (onStart != null)
                    onStart(this);
                currentPart = 0;
                currentStart = 0;
            }
        }

    }

}

public class OTTimeCyclePart
{
    public string name;
    public float length;
    public OTEase ease;

    public OTTimeCyclePart(string name, float length, OTEase ease)
    {
        this.name = name;
        this.length = length;
        this.ease = ease;
    }

}
