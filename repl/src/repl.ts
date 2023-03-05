import { flatten, unflatten } from "../../app/src/circFlatten"
//const testElem = document.querySelector("#test")


const ob = {
  "a": 1,
  "b.c": 2,
  "b.d.d": 3,
  "b.d.ob.0": 2    
}


console.log(unflatten(ob))
