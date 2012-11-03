using UnityEngine;
using System.Collections;

public class BombGenerator : MonoBehaviour
{
    private float _time;
    private float _timeForGeneration = 2.5f;
    
    public Transform WhatToGenerate;
	
    void Update ()
    {
        _time += Time.deltaTime;
        if (_time >= _timeForGeneration)
        {
            _timeForGeneration = Random.Range(0.1f, 3.1f);
            _time = 0f;
            var temp = (Transform)Instantiate(WhatToGenerate, new Vector3(-1.76f, 8.67f, Random.Range(11f, -11f)), Quaternion.identity);
            temp.GetChild(0).gameObject.active = false;
        }
    }
}
