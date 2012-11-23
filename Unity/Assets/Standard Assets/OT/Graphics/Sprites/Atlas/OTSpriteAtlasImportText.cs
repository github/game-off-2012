using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.IO;

/// <summary>
/// Base class for importing a sprite atlas from an XML file
/// </summary>
public class OTSpriteAtlasImportText : OTSpriteAtlasImport
{
 
	List<Dictionary<string, string>> lines = new List<Dictionary<string, string>>();
    /// <summary>
    /// Parses the line.
    /// </summary>
	Dictionary<string,string> ParseLine(string line, Dictionary<string,string> lineData)
	{
		bool inKey = false;
		bool inVal = false;
		string key = "";
		string val = "";
		string valStart = "";
		
		int i=0;
		while (i<line.Length)
		{
			string c = line.Substring(i,1);
			
			if (!inKey)
			{
				if (c!=" " && c!="\t")
				{
					inKey = true;
					key+=c;
				}
			}
			else
			{
				if (!inVal && c=="=")
				{
					inVal = true;
				}
				else
				if (c==" " || c=="\t" )
				{
					if (inVal && (valStart == "\"" || valStart == "\'"))
						val+=c;
					else
					{
						lineData.Add(key,val);
						inKey = false;
						inVal = false;
						key = "";
						val = "";
					}
				}
				else
				if (inVal && (c=="\"" || c=="\'"))
				{
					if (valStart=="")
						valStart = c;
					else
					if (c == valStart)
						valStart = "";
					else
					   val+=c;
				}
				else
				if (inVal)
					val += c;
				else
					key += c;
			}
			i++;
		}
		return lineData;
	}
	
	protected override void LocateAtlasData()
	{
		
		if (atlasDataFile!=null && texture.name == atlasDataFile.name)
			return;		
		
#if UNITY_EDITOR 		
		string path = Path.GetDirectoryName(UnityEditor.AssetDatabase.GetAssetPath(texture))+"/"+texture.name+".txt";
		Object o = (UnityEditor.AssetDatabase.LoadAssetAtPath(path,typeof(TextAsset)));
		if (o == null)
		{
			path = Path.GetDirectoryName(UnityEditor.AssetDatabase.GetAssetPath(texture))+"/"+texture.name+".xml";
			o = (UnityEditor.AssetDatabase.LoadAssetAtPath(path,typeof(TextAsset)));			
		}
		if (o is TextAsset)
			_atlasDataFile = (o as TextAsset);
#endif
	}	
		
	
	int processIndex = 0;
	
	protected string Data(string key)
	{
		if (processIndex<lines.Count)
		{
			if (lines[processIndex].ContainsKey(key))
				return lines[processIndex][key];
		}
		return "";
	}	
	
	protected int IData(string key)
	{
		try
		{
			return System.Convert.ToInt16(Data (key));
		}
		catch(System.Exception)
		{
		}
		return -1;
	}
	
	protected bool Exists(string key)
	{
		if (processIndex<lines.Count)
			return lines[processIndex].ContainsKey(key);
		else
			return false;
	}
	
	protected void First()
	{
		processIndex = 0;
	}
	
	protected bool Next()
	{
		processIndex++;
		return (processIndex<lines.Count);
	}
	
	/// <summary>
    /// Parses this text file
    /// </summary>
    protected bool Parse()
    {
		string[] _lines = new string[]{};
		if (atlasDataFile.text.IndexOf("\r\n")>=0)
			_lines = atlasDataFile.text.Split(new char[] { '\r', '\n' },  System.StringSplitOptions.None);
		else
		if (atlasDataFile.text.IndexOf("\n")>=0)
			_lines = atlasDataFile.text.Split('\n');

		if (_lines.Length>0)
		{
			for (int i=0; i<_lines.Length; i++)
				lines.Add(ParseLine(_lines[i], new Dictionary<string, string>()) );
				
			return true;
		}
			
		
		
		
        return false;
    }
}


