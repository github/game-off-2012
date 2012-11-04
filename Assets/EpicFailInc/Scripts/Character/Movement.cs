using UnityEngine;
using System.Collections;

public class Movement : MonoBehaviour
{
    public float PlayerSpeed = 3;
    public int MaxVelocity = 10;

    private Vector3 _targetVelocity;

	// Use this for initialization
	void Start ()
	{
	    _targetVelocity = new Vector3(0, 0, MaxVelocity);
	}

    void FixedUpdate()
    {
        float moveInput = Input.GetAxis("Horizontal");// * Time.deltaTime * PlayerSpeed;
        if (moveInput > 0) moveInput = 1;
        else if (moveInput < 0) moveInput = -1;
        else moveInput = 0;
        if (moveInput != 0)
        {
            transform.localRotation = new Quaternion(0, moveInput < 0 ? 180 : 0, 0, 0); //Stops user from rotating, allows for changing directions
        }
        var requiredAcceleration = _targetVelocity.z - Mathf.Abs(rigidbody.velocity.z);
        var forceToAdd = new Vector3(rigidbody.velocity.x, rigidbody.velocity.y, Mathf.Clamp(requiredAcceleration * PlayerSpeed * moveInput * -1, -_targetVelocity.z, _targetVelocity.z));
        rigidbody.AddForce(forceToAdd);

        //transform.Translate(0,0,-(Mathf.Abs(moveInput)));
    }

    //void FixedUpdate()
    //{
    //    float horizontal = Input.GetAxis("Horizontal");
    //    float vertical = Input.GetAxis("Vertical");
    //    //Vector3 forward = cameraTransform.TransformDirection(Vector3.forward);
    //    forward.y = 0F;
    //    forward.Normalize();
    //    Vector3 right = new Vector3(forward.z, 0F, -forward.x);
    //    Vector3 tempTargetPos = (forward * vertical) + (right * horizontal);
    //    tempTargetPos.Normalize();
    //    if (tempTargetPos != Vector3.zero)
    //        targetPosition = tempTargetPos;

    //    //if the target is grounded, apply speed and forces
    //    if (grounded)
    //    {
    //        Vector3 targetVelocity = tempTargetPos * speed;
    //        Vector3 velocityChange = targetVelocity - rigidbody.velocity;
    //        velocityChange.x = Mathf.Clamp(velocityChange.x, -speed, speed);
    //        velocityChange.z = Mathf.Clamp(velocityChange.z, -speed, speed);
    //        velocityChange.y = 0;
    //        rigidbody.AddForce(velocityChange, ForceMode.VelocityChange);
    //    }
    //}
}
