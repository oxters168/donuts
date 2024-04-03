import p5 from "p5"


export let colorlist = ['gold', 'yellow', 'turquoise', 'red'] as null as p5.Color[]
// let colorlist = ["#FF000088", "#00FF0088", "#0000FF88", "#FFFF0088"] as null as p5.Color[]


export type DrawAt = (v: p5.Vector) => void

export type DrawAround = (radius: number, draw: DrawAt) => DrawAt
  
