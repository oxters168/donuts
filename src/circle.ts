import p5 from "p5"
import { DrawAt, colorlist } from "./drawUtils"

export function stochastic_circulator(radius: number, f: DrawAt): DrawAt {
    return (pos) => {
        const theta = random(0.0, 2 * Math.PI) // dono if works
        f(p5.Vector.fromAngle(theta, radius).add(pos))
    }
}

export function drawCircle(radius: number, color?: p5.Color): DrawAt {
    noFill()
    strokeWeight(1)
    stroke(color ? color : colorlist[Math.round(random(0, 3))])
    return (position: p5.Vector) =>
        circle(position.x, position.y, radius)
}

export function circulator(radius: number, f: DrawAt, angleStep?: number): DrawAt {
    if (!angleStep)
        angleStep = 1
    const totalAngle = 360
    return (pos) => {
        for (let i = 0; i < totalAngle; i += angleStep)
            f(p5.Vector.fromAngle(radians(i), radius).add(pos))
    }
}