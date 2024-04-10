import { gsap } from "https://cdn.skypack.dev/gsap@3.11.4";

//
// params
//

const MAX_CIRCLE_COUNT = 200
const MAX_ATTEMPT_COUNT = 10
const SF_MAX_RADIUS = 0.2

//
// main
//

let ctx
let ref
let tween

const canvas = document.querySelector('canvas')
const circles = [] // [x,y,r,rx,ry][]

function init() {
  canvas.width = innerWidth
  canvas.height = innerHeight
  ref = Math.min(canvas.width, canvas.height) / 2.5
  ctx = canvas.getContext('2d')
  ctx.translate(canvas.width / 2, canvas.height / 2)
  set_circles()
  tween?.kill()
  tween = gsap.from(circles, {
    0: 0, 1: 0, 2: 0,
    stagger: { amount: 2.5 },
    ease: 'bounce',
    onUpdate: () => {
      ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
      circles.forEach(draw_circle)
    }
  })
}

function set_circles() {
  circles.length = 0
  for (let i = 0; i < MAX_CIRCLE_COUNT; ++i) {
    const circle = spawn()
    circle && circles.push(circle)
  }
}

const dist = (c0, c1) => Math.hypot(c0[0] - c1[0], c0[1] - c1[1])
const is_separated = (c0, c1) => dist(c0, c1) > (c0[2] + c1[2])
const can_grow = (c0) => circles.every(c1 => is_separated(c0, c1))

function spawn() {
  for (let j = 0; j < MAX_ATTEMPT_COUNT; ++j) {
    const r = Math.random() ** (1 / 2) * (ref)
    const a = Math.random() * (Math.PI * 2)
    const x = r * Math.cos(a) // x
    const y = r * Math.sin(a) // y
    const c = [x, y, 0, 0, 0] // 0-radius circ
    if (can_grow(c)) {
      grow(c)
      c[3] = 0.1 + Math.random() * 0.8 // rx factor
      c[4] = 0.1 + Math.random() * 0.8 // ry factor
      return c
    }
  }
  return null
}

function grow(c) { // [x,y,r]
  while (
    c[2] < (SF_MAX_RADIUS * ref) &&
    Math.hypot(c[0], c[1]) < (ref - c[2]) &&
    can_grow(c)
  ) c[2] += 1 // incr r
}

function draw_circle([x, y, r, rx, ry]) {
  const R = Math.max(0.1, r - ctx.lineWidth)

  ctx.globalCompositeOperation = 'source-over'
  ctx.beginPath()
  ctx.ellipse(x, y, R, R, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.ellipse(x, y, R * rx, R * ry, 0, 0, Math.PI * 2)
  ctx.fill()
}

addEventListener('resize', init)
addEventListener('pointerdown', init)
init()