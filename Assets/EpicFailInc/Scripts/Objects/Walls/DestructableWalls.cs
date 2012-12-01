using UnityEngine;
using System.Collections;

public class DestructableWalls : MonoBehaviour
{
    public GameObject Fire;

    public void Destruct()
    {
        Fire.SetActiveRecursively(true);
        StartCoroutine(BurnDown());
    }

    private IEnumerator BurnDown()
    {

        yield return new WaitForSeconds(1);
        transform.localScale = new Vector3(0,0,0);
        yield return new WaitForSeconds(2);
        Destroy(gameObject);
    }
}
