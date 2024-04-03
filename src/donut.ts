import p5 from "p5"
import { DrawAt, colorlist } from "./drawUtils"
import { circulator } from "./circle"
import _ from "lodash/fp"

export type Donut = {
    innerRadius: number
    thickness: number
}

export function makeDonut(r1: number, r2: number): Donut {
    return {
      innerRadius: abs(r1 - r2),
      thickness: r1 + r2 - abs(r1 - r2)
    }
  }
  

export function drawHQDonut(donut: Donut, color?: p5.Color): DrawAt {
    return circulator(donut.innerRadius + donut.thickness / 2, (pos) => {
        noStroke()
        fill(color ? color : colorlist[Math.round(random(0, 3))])
        circle(pos.x, pos.y, donut.thickness)
    })
}

export function drawDonut(donut: Donut, color?: p5.Color): DrawAt {
    return (pos) => {
        stroke(color ? color : colorlist[Math.round(random(0, 3))])
        noFill()
        strokeWeight(max(donut.thickness, 1.0))
        circle(pos.x, pos.y, (donut.innerRadius+donut.thickness/2.0)*2)
    }
}

export function circleDonut(radius: number, d: Donut): Donut {
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

export function drawTotalDonut(r_list: number[]) {
    const initialDonut: Donut = { innerRadius: 0.0, thickness: 0.0 }
    const finalDonut = _.reduceRight(circleDonut, initialDonut)(r_list)
    // const fixedDonut = { innerRadius: finalDonut.innerRadius, thickness: r_list.reduce((a, b) => a + b) - finalDonut.innerRadius }
    // const finalDonut = circleDonut(r_list[0], initialDonut)
    drawHQDonut(finalDonut, "#00000088" as null as p5.Color)(createVector())
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
function fillDonutCenter(v: p5.Vector, r_list: number[]) {
    fill("#000000CC")
    noStroke()
    const inner = getCenterSize(r_list)
    circle(v.x, v.y, inner * 2)
}