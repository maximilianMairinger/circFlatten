import { flatten } from "../../app/src/circFlatten"
//const testElem = document.querySelector("#test")


const ob = {
  a: 1,
  b: {
    c: 2,
    d: {
      q: 3,
      b: undefined
    }
  },
  d: undefined 
}

ob.b.d.b = ob.b
ob.d = ob.b.d

console.log(flatten(ob))
