import _ from 'lodash'
import * as p5Globals from 'p5/global'
import { drawCircle, stochastic_circulator } from './circle'
import { drawDonut, drawTotalDonut, makeDonut } from './donut'
import { DrawAround, DrawAt } from './drawUtils'
import p5 from 'p5'


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
  background(255)
  simulate()

  // drawHQDonut({innerRadius: 5, thickness: 10})(createVector())
  // strokeWeight(50)
  // fill("yellow")
  // stroke("black")
  // circle(0, 0, 100)
}

function markovian(f: DrawAt, n_trials: number) {
  const middle = createVector(0, 0)
  for (let i = 0; i < n_trials; i++)
    f(middle)
}

function recursiveDrawAround(f: DrawAround, l: number[]): DrawAt {
  if (l.length == 1) {
    return drawCircle(l[0])
  } else if (l.length == 2)
    return drawDonut(makeDonut(l[0], l[1]))
  else
    return (pos) =>
      f(l[0], recursiveDrawAround(f, l.slice(1)))(pos)
}

// function naiveReacherDraw(r_list: number[], color?: p5.Color) : DrawAt {
//   const angleStep = 5
//   return (origin: p5.Vector) => {
//     if (r_list.length > 1)
//       circulator(_.first(r_list), naiveReacherDraw(r_list.slice(1)), angleStep)(origin)
//     else
//       drawCircle(_.first(r_list), color)(origin)
//   }
// }

function randomLimbs(maxNumLimbs?: number): number[] {
  if (!maxNumLimbs)
    maxNumLimbs = 5
  const randNumberOfLimbs = round(random(2, maxNumLimbs))
  const arms = _.range(randNumberOfLimbs)
  return _.map(arms, (i: number) => random(0, 0.3/(1+i)))
}

function simulate() {
  const shi = Math.min(windowHeight, windowWidth)
  // const r_list = _.map((x: number) => shi * x)([random(0.0, 0.3), random(0,0.2), random(0, 0.1)])
  // const midPoint : p5.Vector = createVector(0.5 * windowWidth, 0.5 * windowHeight)
  // donutator({ center: midPoint, }, circulator("red", 10))
  // drawDonut({r: r_list[0], thickness: r_list[1]})(createVector(0,0))
  // stochastic_circulator(r_list[0], drawDonut({r: r_list[1], thickness: r_list[2]}))(createVector(0,0))
  // recnator(donutator, [r1, r2, r3])(null, x1, y1, 0)
  const r_list = _.map(randomLimbs(10), (x) => shi*x)
  drawTotalDonut(r_list)
  markovian(recursiveDrawAround(stochastic_circulator, r_list), 1000)
  // naiveReacherDraw(r_list, 'black' as null as p5.Color)(createVector())
  // fillCenter(midPoint, r_list)

  // function draw() {
  //   noStroke()

  // }
}
(window as any).setup = setup