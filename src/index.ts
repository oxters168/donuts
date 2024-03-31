import p5 from 'p5'

export const sketch = (p: p5) => {
  // let colorlist = ['gold', 'yellow', 'turquoise', 'red']
  let colorlist = ["#FF000088", "#00FF0088", "#0000FF88", "#FFFF0088"]

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.background(255)
    simulate()

    // noFill()
    // strokeWeight(-1)
    // stroke('gold')
    p.noStroke()
    p.fill('gold')
    p.ellipse(50, 50, 100, 100)
    p.noFill()
    p.stroke('black')
    p.strokeWeight(-1)
    p.ellipse(50, 50, 100, 100)
  }

  function donutator(x, y, r1, r2, f) {
    for (let i = 0; i < 360; i += 15) {
      const color = colorlist[(i / 15) % 4]
      f(color, x + r1 * Math.sin(i * (Math.PI / 180)), y + r1 * Math.cos(i * (Math.PI / 180)), r2 * 2)
    }
  }

  function stochastic_donator(x, y, r1, r2, f) {
    const theta = p.random(0.0, 2 * Math.PI) // dono if works
    const color = colorlist[Math.round(p.random(0, 3))]
    console.log("trees")
    // console.log(f)
    f(color, x + r1 * Math.sin(theta), y + r1 * Math.cos(theta), r2)
  }

  function circulator(color, x, y, r) {
    p.noFill()
    p.strokeWeight(-1)
    p.stroke(color)
    p.ellipse(x, y, r * 2, r * 2)
  }

  function markovian(f, n_trials) {
    const x1 = 0.5 * p.windowWidth
    const y1 = 0.5 * p.windowHeight
    for (let i = 0; i < n_trials; i++)
      f(null, x1, y1, 0)
  }

  function nater(f, l) {
    l.reverse()
    console.log(l)
    const funcs = [circulator]
    for (let i = 0; i < l.length - 1; i++) {
      console.log("cheese")
      funcs.push((color, x, y, r) => f(x, y, l[i + 1], l[i], funcs[i]))
    }
    return funcs[funcs.length - 1]
  }

  function recnator(f, l) {
    if (l.length == 1)
      return circulator
    else
      return (color, x, y, r) =>
        f(x, y, l[0], l[1], recnator(f, l.slice(1)))
  }

  function getCenterSize(r_list) {
    var centerSize = 0
    if (r_list.length > 2) {
      r_list.sort((a, b) => Math.sign(a - b))
      const maxValue = r_list[r_list.length - 2]
      var smallerSum = 0
      for (let i = r_list.length - 3; i >= 0; i--)
        smallerSum += r_list[i]
      centerSize = maxValue - smallerSum
    } else if (r_list.length == 2) {
      centerSize = Math.abs(r_list[0] - r_list[1])
    }
    
    return centerSize
  }
  function fillCenter(x, y, r_list) {
    p.fill("#000000CC")
    p.noStroke()
    const inner = getCenterSize(r_list)
    p.ellipse(x, y, inner * 2, inner * 2)
  }
  function simulate() {
    const shi = Math.min(p.windowHeight, p.windowWidth)
    const r_list = [shi * 0.01, shi * 0.2, shi * 0.1, shi * 0.05]
    // const r_list = [shi * 0.01, shi * 0.2]
    // const r1 = shi * 0.1
    // const r2 = shi * 0.2
    // const r3 = shi * 0.01
    // const r4 = shi * 0.05
    const x1 = 0.5 * p.windowWidth
    const y1 = 0.5 * p.windowHeight
    // donutator(x1, y1, r1, r2, (color, x, y, r) =>
    //   donutator(x, y, r2, r3, circulator)
    // )
    // recnator(donutator, [r1, r2, r3])(null, x1, y1, 0)
    markovian(recnator(stochastic_donator, r_list), 100000)
    fillCenter(x1, y1, r_list)
  }

  // function draw() {
  //   noStroke()

  // }
}
// setup()
export const myp5 = new p5(sketch, document.body)
// https://github.com/Gaweph/p5-typescript-starter