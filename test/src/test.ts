import { flatten } from "../../app/src/circFlatten"
import "./extend"

describe("flatten", () => {

  test("simple recursion", () => {
    const ob = {
      a: 1,
      b: {
        c: 2,
        d: {
          ob: undefined
        }
      }
    }
    
    ob.b.d.ob = ob
    
    expect(flatten(ob)).eq({
      "a": 1,
      "b.c": 2
    })
    
  })

  test("non recursion", () => {
    const ob = {
      a: 1,
      b: {
        c: 2,
        d: {
          d: 3
        }
      }
    }
    
    expect(flatten(ob)).eq({
      "a": 1,
      "b.c": 2,
      "b.d.d": 3
    })
  })

  test("escaping", () => {
    const ob = {
      "a.a": 1,
      "b.b": {
        "c.c": 2,
        "d.d": {
          "d.d": 3
        }
      }
    }

    expect(flatten(ob)).eq({
      "a\\.a": 1,
      "b\\.b.c\\.c": 2,
      "b\\.b.d\\.d.d\\.d": 3
    })
  })

  test("escaping recursive", () => {
    const ob = {
      "a.a": 1,
      "b.b": {
        "c.c": 2,
        "d.d": {
          "d.d": 3,
          "ob": undefined
        }
      }
    }

    ob["b.b"]["d.d"].ob = ob

    expect(flatten(ob)).eq({
      "a\\.a": 1,
      "b\\.b.c\\.c": 2,
      "b\\.b.d\\.d.d\\.d": 3
    })
  })

  test("empty object shouldnt get reflected", () => {
    const ob = {
      a: 1,
      b: {
        c: 2,
        d: {
          d: 3,
          ob: {}
        }
      }
    }

    expect(flatten(ob)).eq({
      "a": 1,
      "b.c": 2,
      "b.d.d": 3
    })
  })

  test("undefined and null shoudld be reflected", () => {
    const ob = {
      a: 1,
      b: {
        c: 2,
        d: {
          d: 3,
          ob: null
        }
      },
      e: undefined
    }

    expect(flatten(ob)).eq({
      "a": 1,
      "b.c": 2,
      "b.d.d": 3,
      "b.d.ob": null,
      "e": undefined
    })
  })

  test("array should be treated as object", () => {
    const ob = {
      a: 1,
      b: {
        c: 2,
        d: {
          d: 3,
          ob: [2]
        }
      }
    }

    expect(flatten(ob)).eq({
      "a": 1,
      "b.c": 2,
      "b.d.d": 3,
      "b.d.ob.0": 2    
    })
  })

  test("empty array should not be reflected", () => {
    const ob = {
      a: 1,
      b: {
        c: 2,
        d: {
          d: 3,
          ob: []
        }
      }
    }

    expect(flatten(ob)).eq({
      "a": 1,
      "b.c": 2,
      "b.d.d": 3
    })
  })


  test("Recursion finds the shortest path to primitives 1", () => {
    const ob = {
      a: 1,
      b: {
        c: 2,
        d: {
          q: 3,
          b: undefined
        }
      }
    }

    ob.b.d.b = ob.b

    expect(flatten(ob)).eq({
      "a": 1,
      "b.c": 2,
      "b.d.q": 3
    })
  })


  test("Recursion finds the shortest path to primitives 2", () => {
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

    expect(flatten(ob)).eq({
      "a": 1,
      "b.c": 2,
      "d.q": 3
    })

  })


  test("Recursion finds the shortest path to primitives (multiple best case paths)", () => {
    const ob = {
      a: 1,
      b: {
        c: 2,
        d: {
          q: 3,
          b: undefined
        }
      },
      d: undefined,
      e: undefined
    }

    ob.b.d.b = ob.b
    ob.d = ob.b.d
    ob.e = ob.b.d


    expect(flatten(ob)).eq({
      "a": 1,
      "b.c": 2,
      "d.q": 3
    }, {
      "a": 1,
      "b.c": 2,
      "e.q": 3
    })

  })
  
})

