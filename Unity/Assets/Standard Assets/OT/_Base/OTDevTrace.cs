using UnityEngine;
using System.Collections;

[ExecuteInEditMode]
public class OTDevTrace : MonoBehaviour {
	
	public enum TraceOnOff { On , Off };
	
	public TraceOnOff tracing = TraceOnOff.Off;
	public bool traceMaterials = false;
	
	void Update()
	{
		if (tracing == TraceOnOff.On && (OTDebug.messageGroup=="" || !Application.isPlaying))
		{		
			OTDebug.messageGroup = "ot";
			if (traceMaterials)
				OTDebug.messageGroup += ",ot-mat";
		}
	}
}
