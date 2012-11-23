using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class OTTweenController : OTController
{

    List<OTTween> tweens = new List<OTTween>();

    public OTTweenController(string name)
        : base(null, name)
    {
    }

    public OTTweenController()
        : base()
    {
    }

    public void Add(OTTween tween)
    {
      tweens.Add(tween);
    }


    protected override void Update()
    {
        base.Update();

       	int t = 0;
		while (t<tweens.Count)
		{
			if (tweens[t].Update(deltaTime))
				tweens.Remove(tweens[t]);
			else
				t++;
		}
    }

}
