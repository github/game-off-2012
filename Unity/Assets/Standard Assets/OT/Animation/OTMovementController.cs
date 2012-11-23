using UnityEngine;
using System.Collections;
/// <summary>
/// <b><a href="http://www.wyrmtale.com/products/unity3d-components/orthello-pro" target="_blank" >PRO</a></b> 
/// : Base movement controller class
/// </summary>
public class OTMovementController : OTController {

    
    protected Vector2 previousPosition;

	public bool isMoving = true;

    /// <summary>
    /// Constructor
    /// </summary>
    /// <param name="owner">Owner object that will be moved</param>
    /// <param name="name">Name of this controller</param>
    public OTMovementController(Object owner, string name)
        : base(owner, name)
    {
    }

    
    protected virtual void MoveStart()
    {
    }

    
    protected virtual void Move()
    {
    }

	/// <summary>
	/// Start moving
	/// </summary>
	public void Start()
	{
		isMoving = true;
		_time = 0;
	}
	
	/// <summary>
	/// Resume moving
	/// </summary>
	public void Resume()
	{
		isMoving = true;
	}
	
	/// <summary>
	/// Stop moving
	/// </summary>
	public void Stop()
	{
		isMoving = false;
	}	
	
    
    protected override void Update()
    {
		if (!isMoving) return;
		
        if (time == 0)
            MoveStart();
        Move();
        if (owner is OTObject)
            previousPosition = (owner as OTObject).position;
        else
        if (owner is GameObject)
            previousPosition = (owner as GameObject).transform.position;
    }

}
