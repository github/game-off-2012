using UnityEngine;
using System.Collections;

public class HealthAndLifeRelated : MonoBehaviour
{
    public int MaxHealth = 50;
    public int CurrentHealth = 50;
    public bool TakesFallDamage = true;
    public bool Alive = true;
    public bool IsThePlayer = true;

    public double FallDamageMultiplier = 90/(9.81*2.5);

    //Private
    private float _aliveTimeInSeconds = 0;
    private int _lastTick = 0;
    private GameManager _gameManager;

	void Start ()
	{
	    var manager = GameObject.FindGameObjectWithTag("Manager");
        if (manager != null)
        {
            _gameManager = (GameManager)manager.GetComponent("GameManager");
            if(_gameManager.Score > 0)
            {
                _aliveTimeInSeconds =_gameManager.LifeSpan;
            }
        }
	}
	
	void Update ()
	{
	    if (!Alive) return;
	    _aliveTimeInSeconds += Time.deltaTime;
        if(_gameManager != null)
        {
            _gameManager.LifeSpan = _aliveTimeInSeconds;
        }
	    var currentTick = Mathf.FloorToInt(_aliveTimeInSeconds);
	    if(_lastTick != currentTick && currentTick % 3 == 0)
	    {
	        _lastTick = currentTick;
	        RegenerateHealth(5);
            if (_gameManager != null)
                _gameManager.Score += 1;
	    }
	}

    void Die()
    {
        Alive = false;
        Application.LoadLevel("Death");
    }

    void RegenerateHealth(int howMuch)
    {
        if (CurrentHealth >= MaxHealth) return;
        CurrentHealth = Mathf.Clamp(CurrentHealth + howMuch, 0, MaxHealth);
    }

    void OnCollisionEnter(Collision collision)
    {
        if (!TakesFallDamage || !Alive) return;
        if (collision.gameObject.tag == "Ground")
        {
            if (collision.relativeVelocity.y >= 5)
            {
                //collision.relativeVelocity.y is an indication of how fast they were falling when they hit the ground
                CurrentHealth -= (int)(MaxHealth * ((collision.relativeVelocity.y * FallDamageMultiplier) * .01)); //This calculuation probably needs to be made better
                CurrentHealth = Mathf.Clamp(CurrentHealth, 0, MaxHealth);
                if (CurrentHealth <= 0) //Should never be less than because of the Clamp, but oh well.
                {
                    Die();
                }
            }
        }
    }
}
