import p5 from 'p5'
import _ from 'lodash/fp'
type Draw = (v: p5.Vector) => void
type Donut = {
  innerRadius: number
  thickness: number
}



type Nator = (radius: number, draw: Draw) => Draw
export const sketch = (p: p5) => {
  let colorlist = ['gold', 'yellow', 'turquoise', 'red'] as null as p5.Color[]
  // let colorlist = ["#FF000088", "#00FF0088", "#0000FF88", "#FFFF0088"] as null as p5.Color[]

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    p.background(255)
    simulate()
    
    // drawHQDonut({innerRadius: 5, thickness: 10})(p.createVector())
    // p.strokeWeight(50)
    // p.fill("yellow")
    // p.stroke("black")
    // p.circle(0, 0, 100)
  }



  // function circleDonut(radius: number, d: Donut) : Donut {
  //   if (radius > d.innerRadius + d.thickness) {
  //     return {innerRadius: radius - (d.innerRadius + d.thickness)}
  //   }
  // }
  function circleDonut(radius: number, d: Donut): Donut {
    if (radius > d.innerRadius + d.thickness) {
      return {
        innerRadius: radius - (d.innerRadius + d.thickness),
        thickness: (d.innerRadius + d.thickness) * 2
      }
    } else if (radius < d.innerRadius) {
      return {
        innerRadius: d.innerRadius - radius,
        thickness: d.thickness + radius * 2
      }
    } else {
      return {
        innerRadius: 0,
        thickness: d.thickness + d.innerRadius + radius
      }
    }
  }
  function makeDonut(r1: number, r2: number): Donut {
    return {
      innerRadius: p.abs(r1 - r2),
      thickness: r1 + r2 - p.abs(r1 - r2)
    }
  }

  function donutator(radius: number, draw: Draw): Draw {
    return (pos) => {
      for (let i = 0; i < 360; i += 1) {
        draw(p5.Vector.fromAngle(i * (p.PI / 180), radius).add(pos))
      }
    }
  }
  function drawHQDonut(donut: Donut, color?: p5.Color): Draw {
    return donutator(donut.innerRadius + donut.thickness / 2, (pos) => {
      p.noStroke()
      p.fill(color ? color : colorlist[Math.round(p.random(0,3))])
      p.circle(pos.x, pos.y, donut.thickness / 2)
    })
  }

  function drawDonut(donut: Donut, color?: p5.Color): Draw {
    return (pos) => {
      p.stroke(color ? color : colorlist[Math.round(p.random(0,3))])
      p.noFill()
      p.strokeWeight(p.max(donut.thickness, 1.0))
      p.circle(pos.x, pos.y, (donut.innerRadius + donut.thickness/2.0)*2.0)
    }
  }

  function stochastic_circulator(radius: number, draw: Draw): Draw {
    return (pos) => {
      const theta = p.random(0.0, 2 * Math.PI) // dono if works
      draw(p5.Vector.fromAngle(theta, radius).add(pos))
    }
  }

  // function circulator(color: p5.Color, r: number) : Draw {
  //   return v => {
  //     p.noFill()
  //     p.strokeWeight(-1)
  //     p.stroke(color)
  //     p.ellipse(v.x, v.y, r * 2, r * 2)
  //   }
  // }

  function markovian(f: Draw, n_trials: number) {
    const middle = p.createVector(0,0)
    for (let i = 0; i < n_trials; i++)
      f(middle)
  }

  function recnator(f: Nator, l: number[]) : Draw {
    if (l.length == 1) {
      return drawHQDonut({innerRadius: l[0], thickness: 0})
    } else if (l.length == 2)
      return drawHQDonut(makeDonut(l[0], l[1]))
    else
      return (pos) =>
        f(l[0], recnator(f, l.slice(1)))(pos)
  }

  function getCenterSize(r_list) {
    var centerSize = 0
    if (r_list.length > 2) {
      const r_list2 = [...r_list]
      r_list2.sort((a, b) => Math.sign(a - b))
      const maxValue = r_list2[r_list2.length - 2]
      var smallerSum = 0
      for (let i = r_list2.length - 3; i >= 0; i--)
        smallerSum += r_list2[i]
      centerSize = maxValue - smallerSum
    } else if (r_list.length == 2) {
      centerSize = Math.abs(r_list[0] - r_list[1])
    }
    
    return centerSize
  }
  function fillCenter(v: p5.Vector, r_list: number[]) {
    p.fill("#000000CC")
    p.noStroke()
    const inner = getCenterSize(r_list)
    p.ellipse(v.x, v.y, inner * 2, inner * 2)
  }
  function drawTotalDonut(r_list: number[]) {
    const initialDonut: Donut = {innerRadius: _.last(r_list), thickness: 0.0}
    const finalDonut = _.reduceRight(circleDonut, initialDonut)(r_list)
    const fixedDonut = {innerRadius: finalDonut.innerRadius, thickness: r_list.reduce((a, b) => a + b) - finalDonut.innerRadius}
    drawHQDonut(finalDonut, "#00000088" as null as p5.Color)(p.createVector())
  }

  function drawCircleOutline(position: p5.Vector, radius: number, color?: p5.Color) {
    p.noFill()
    p.strokeWeight(1)
    p.stroke(color ? color : colorlist[Math.round(p.random(0,3))])
    p.circle(position.x, position.y, radius)
  }
  function circulator(radius: number, angleStep: number, f: Draw) {
    const totalAngle = 360
    for (let i = 0; i < totalAngle; i += angleStep)
      f(p5.Vector.fromAngle(p.radians(i), radius))
  }
  function naiveReacherDraw(origin: p5.Vector, r_list: number[], color?: p5.Color) {
    const angleStep = 5
    if (r_list.length > 1)
      circulator(_.first(r_list), angleStep, (pos) => naiveReacherDraw(pos.add(origin), r_list.slice(1)))
    else
      drawCircleOutline(origin, _.first(r_list), color)
  }
  function simulate() {
    const shi = Math.min(p.windowHeight, p.windowWidth)
    const r_list = _.map((x : number) => shi * x)([0.1, 0.2, 0.05])
    // const midPoint : p5.Vector = p.createVector(0.5 * p.windowWidth, 0.5 * p.windowHeight)
    // donutator({ center: midPoint, }, circulator("red", 10))
    // drawDonut({r: r_list[0], thickness: r_list[1]})(p.createVector(0,0))
    // stochastic_circulator(r_list[0], drawDonut({r: r_list[1], thickness: r_list[2]}))(p.createVector(0,0))
    // recnator(donutator, [r1, r2, r3])(null, x1, y1, 0)
    // markovian(recnator(stochastic_circulator, r_list), 1000)
    naiveReacherDraw(p.createVector(), r_list, 'black' as null as p5.Color)
    drawTotalDonut(r_list)
    // fillCenter(midPoint, r_list)
  }

  // function draw() {
  //   noStroke()

  // }
}
// setup()
export const myp5 = new p5(sketch, document.body)
// https://github.com/Gaweph/p5-typescript-starter