import _ from 'lodash'
import * as p5Globals from 'p5/global'
import { drawCircle, stochastic_circulator } from './circle'
import { drawDonut, drawTotalDonut, makeDonut, naiveReacherDraw } from './donut'
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
function draw() {
  clear()
  simulate()
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
  markovian(recursiveDrawAround(stochastic_circulator, r_list), 100000)
  // naiveReacherDraw(r_list)(createVector())
  // fillCenter(midPoint, r_list)

  // function draw() {
  //   noStroke()

  // }
}
(window as any).setup = setup;
// (window as any).draw = draw;