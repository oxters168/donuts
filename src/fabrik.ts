import p5 from "p5"

export function fabrikSolve2D(
    target: p5.Vector,
    r_list: number[],
    angles: number[],
    origin: p5.Vector = createVector(),
    maxSteps: number = 16,
    minDist: number = 0.01
): number[] {
    const currentAngles: number[] = [...angles]
    const backwardPass = (startPos: p5.Vector, positions: p5.Vector[]) => {
        positions[positions.length - 1] = startPos
        for (let i = positions.length - 1; i >= 0; i--) {

        }
    }
    return currentAngles
}