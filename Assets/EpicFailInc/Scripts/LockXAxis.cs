using UnityEngine;
using System.Collections;

public class LockXAxis : MonoBehaviour
{
    private float xPosition;
	// Use this for initialization
	void Start ()
	{
	    xPosition = transform.position.x;
	}
	
	// Update is called once per frame
    void Update()
    {
        transform.localPosition = new Vector3(xPosition, transform.position.y, transform.position.z); //Locks user's x axis, prevents destruction of 2D illusion
    }
}
