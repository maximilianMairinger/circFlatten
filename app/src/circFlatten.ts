

// walk every level of the object and filter out the keys to another object. Leave all primitive objects. Then after dealing with the primitives
// walk the nested object. Do this recursively. Add the object to a refSet so that it doesn't get walked twice. Loop over the keys of every object 
// and concat the keys with the parent key. 
// If a key is contains the delimiter escape it with a backslash.
const flattenRefSet = new WeakSet()
export function flatten(ob: object, delimiter = ".") {
  let { ret, deeper } = cloneAndIgnoreDeeperCircRef(ob)
  while (deeper !== undefined) deeper = deeper()

  return simpleFlatten(ret, delimiter)
}

function simpleFlatten(ob: object, delimiter: string) {
  const ret: any = {}
  for (const key in ob) {
    const val = ob[key]
    const newKey = key.split("\\").join("\\\\").split(delimiter).join("\\" + delimiter)
    if (typeof val === "object" && val !== null) {
      if (Object.keys(val).length === 0) continue
      const deeper = simpleFlatten(val, delimiter)
      for (const deeperKey in deeper) {
        ret[newKey + delimiter + deeperKey] = deeper[deeperKey]
      }
    }
    else ret[newKey] = val
  }
  return ret
}

function cloneAndIgnoreDeeperCircRef(ob: object) {
  if (flattenRefSet.has(ob)) return { ret: {} }
  flattenRefSet.add(ob)
  const myRet: any = {}
  let goDeeper = {}
  for (const key in ob) {
    if (key === "__proto__") continue
    const val = ob[key]
    if (typeof val === "object" && val !== null) {
      goDeeper[key] = val
    }
    else myRet[key] = val
  }

  return Object.keys(goDeeper).length === 0 ? {ret: myRet} : {ret: myRet, deeper: () => {
    let goEvenDeeper = [] as Function[]
    for (const key in goDeeper) {
      const val = goDeeper[key]
      const { deeper, ret } = cloneAndIgnoreDeeperCircRef(val)
      if (deeper) goEvenDeeper.push(deeper)
      myRet[key] = ret
    }
    const evenDeeperF = () => {
      const goStillEvenDeeper = [] as Function[]
      for (const go of goEvenDeeper) {
        const nextGo = go()
        if (nextGo) goStillEvenDeeper.push(nextGo)
      }
      goEvenDeeper = goStillEvenDeeper
      return goEvenDeeper.length === 0 ? undefined : evenDeeperF
    }
    return goEvenDeeper.length === 0 ? undefined : evenDeeperF
  }}

}

export default flatten


function escapedKeyToKeyArr(key: string, delimiter = ".") {
  let cur = ""
  let ret = [] as string[]
  let i = 0
  while (i < key.length) {
    if (key[i] === "\\") {
      if (key[i + 1] === "\\") {
        cur += "\\"
        i += 2
      }
      else if (key[i + 1] === delimiter) {
        cur += delimiter
        i += 2
      }
      else {
        cur += key[i]
        i++
      }
    }
    else if (key[i] === delimiter) {
      ret.push(cur)
      cur = ""
      i++
    }
    else {
      cur += key[i]
      i++
    }
  }
  ret.push(cur)
  return ret
}

export function unflatten(ob: {[key in string]: unknown}, delimiter = ".") {
  const ret: any = {}
  for (const key in ob) {
    const val = ob[key]
    const keys = escapedKeyToKeyArr(key, delimiter)
    
    if (keys.includes("__proto__")) continue
    let cur = ret
    for (let i = 0; i < keys.length-1; i++) {
      const curKey = keys[i] 
      if (cur[curKey] === undefined) cur[curKey] = {}
      cur = cur[curKey]
    }
    cur[keys[keys.length-1]] = val
  }
  return ret
}
