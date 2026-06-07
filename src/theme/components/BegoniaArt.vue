<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, toRef } from 'vue'

const props = defineProps<{
  isDark: boolean
}>()

const isDark = toRef(props, 'isDark')

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null

// Deterministic random for consistent trees across resize/theme switch
const initialSeed = Date.now()
let seed = initialSeed
function random() {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

interface BranchNode {
  x: number
  y: number
  endX: number
  endY: number
  cpX: number
  cpY: number
  width: number
  isFlower: boolean
  isLeaf?: boolean
  flowerRadius?: number
  flowerRotation?: number
  children: BranchNode[]
}

const MAX_DEPTH = 7

// Recursively generate the tree structure deterministically
function generateBranch(
  x: number,
  y: number,
  angle: number,
  length: number,
  depth: number,
  width: number
): BranchNode {
  const endX = x + Math.cos(angle) * length
  const endY = y + Math.sin(angle) * length

  // Create a slight curve by offsetting the control point
  const cpOffset = (random() - 0.5) * length * 0.5
  const cpAngle = angle + Math.PI / 2
  const cpX = x + Math.cos(angle) * (length / 2) + Math.cos(cpAngle) * cpOffset
  const cpY = y + Math.sin(angle) * (length / 2) + Math.sin(cpAngle) * cpOffset

  const node: BranchNode = {
    x, y, endX, endY, cpX, cpY, width, isFlower: false, isLeaf: false, children: []
  }

  if (depth < MAX_DEPTH) {
    const count = random() < 0.6 ? 2 : 1
    for (let i = 0; i < count; i++) {
      const angleOffset = (random() - 0.5) * (Math.PI / 2.5) // wider spread
      const newLength = length * (0.7 + random() * 0.15) // 70-85%
      node.children.push(generateBranch(
        endX, endY,
        angle + angleOffset,
        newLength,
        depth + 1,
        Math.max(0.3, width * 0.8)
      ))
    }
  } else {
    if (random() < 0.7) {
      node.isFlower = true
      // Radius 10-18px
      node.flowerRadius = 10 + random() * 8
      node.flowerRotation = random() * Math.PI * 2
    } else {
      node.isLeaf = true
      node.flowerRotation = angle // point in branch direction
    }
  }

  return node
}

// Animation Engine
let tasks: (() => void)[] = []
let isAnimating = false
let animationFrameId = 0

function frame() {
  if (tasks.length === 0) {
    isAnimating = false
    return
  }

  animationFrameId = requestAnimationFrame(frame)

  const nextTasks: (() => void)[] = []
  // Process tasks with a small probability per frame for organic spreading growth
  for (const task of tasks) {
    if (Math.random() < 0.25) {
      task()
    } else {
      nextTasks.push(task)
    }
  }
  tasks = nextTasks
}

function drawSegment(x1: number, y1: number, cpX: number, cpY: number, x2: number, y2: number, width: number) {
  if (!ctx) return
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.quadraticCurveTo(cpX, cpY, x2, y2)
  // Autumn begonia branch colors
  ctx.strokeStyle = isDark.value ? 'rgba(240, 181, 179, 0.18)' : 'rgba(180, 30, 25, 0.22)'
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  ctx.stroke()
}

function drawLeaf(x: number, y: number, angle: number) {
  if (!ctx) return
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)

  const leafColor = isDark.value ? 'rgba(140, 180, 120, 0.12)' : 'rgba(80, 120, 60, 0.15)'
  const length = 4 + random() * 4
  const width = length * 0.4
  
  ctx.fillStyle = leafColor
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(width, length * 0.3, width, length * 0.7, 0, length)
  ctx.bezierCurveTo(-width, length * 0.7, -width, length * 0.3, 0, 0)
  ctx.fill()
  
  ctx.restore()
}

function animateFlower(x: number, y: number, radius: number, rotation: number, step: number) {
  if (!ctx) return
  const maxSteps = 5
  const scale = step / maxSteps

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.scale(scale, scale)

  const baseColor = isDark.value ? 'rgba(240, 139, 139, 0.20)' : 'rgba(236, 43, 36, 0.30)'
  const tipColor = isDark.value ? 'rgba(240, 139, 139, 0.05)' : 'rgba(236, 43, 36, 0.08)'
  
  // 5 asymmetric petals: 2 large, 3 smaller
  const petals = [
    { angle: 0, length: radius * 1.0, width: radius * 0.8 },
    { angle: Math.PI * 0.4, length: radius * 0.7, width: radius * 0.6 },
    { angle: Math.PI * 0.8, length: radius * 0.6, width: radius * 0.5 },
    { angle: Math.PI * 1.2, length: radius * 0.6, width: radius * 0.5 },
    { angle: Math.PI * 1.6, length: radius * 0.8, width: radius * 0.7 },
  ]

  for (const petal of petals) {
    ctx.save()
    ctx.rotate(petal.angle)

    const grad = ctx.createRadialGradient(0, 0, 0, 0, -petal.length * 0.6, petal.length)
    grad.addColorStop(0, baseColor)
    grad.addColorStop(1, tipColor)

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.moveTo(0, 0)
    // Wide bezier curve for rounded petal shape
    ctx.bezierCurveTo(
      -petal.width * 0.6, -petal.length * 0.3,
      -petal.width * 0.5, -petal.length * 0.8,
      0, -petal.length
    )
    ctx.bezierCurveTo(
      petal.width * 0.5, -petal.length * 0.8,
      petal.width * 0.6, -petal.length * 0.3,
      0, 0
    )
    ctx.fill()
    ctx.restore()
  }

  // Prominent yellow center (stamens)
  const stamenColor = isDark.value ? 'rgba(220, 200, 100, 0.30)' : 'rgba(200, 170, 50, 0.40)'
  ctx.fillStyle = stamenColor
  const stamenCount = 4
  for (let i = 0; i < stamenCount; i++) {
    // Inner cluster
    const a = (i * Math.PI * 2) / stamenCount + rotation
    const d = radius * 0.15
    ctx.beginPath()
    ctx.arc(Math.cos(a) * d, Math.sin(a) * d, radius * 0.08, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()

  if (step < maxSteps) {
    tasks.push(() => animateFlower(x, y, radius, rotation, step + 1))
  }
}

function scheduleNode(node: BranchNode) {
  tasks.push(() => {
    if (!node.isFlower && !node.isLeaf) {
      drawSegment(node.x, node.y, node.cpX, node.cpY, node.endX, node.endY, node.width)
      // Queue children to draw after this segment
      for (const child of node.children) { scheduleNode(child) }
    } else if (node.isLeaf) {
      drawLeaf(node.x, node.y, node.flowerRotation ?? 0)
    } else {
      // Start flower blooming sequence
      animateFlower(node.x, node.y, node.flowerRadius ?? 10, node.flowerRotation ?? 0, 1)
    }
  })
}

function startGrowth() {
  if (!ctx || !canvasRef.value) return
  
  cancelAnimationFrame(animationFrameId)
  tasks = []
  
  const w = window.innerWidth
  const h = window.innerHeight
  ctx.clearRect(0, 0, w, h)

  // Reset seed so resize/theme toggle generates identical geometry
  seed = initialSeed
  
  const trees: BranchNode[] = []
  
  // Bottom left origin
  trees.push(generateBranch(
    w * (0.05 + random() * 0.1), h,
    -Math.PI / 2 + (random() * 0.4 - 0.1),
    h * 0.18, 0, 2.0
  ))
  
  // Bottom right origin
  trees.push(generateBranch(
    w * (0.9 + random() * 0.05), h,
    -Math.PI / 2 - (random() * 0.4 - 0.1),
    h * 0.18, 0, 2.0
  ))

  // Occasional branch from middle-left side
  if (random() > 0.4) {
    trees.push(generateBranch(
      0, h * (0.3 + random() * 0.4),
      random() * 0.5 - 0.2,
      w * 0.12, 0, 2.0
    ))
  }
  
  // Occasional branch from top-right
  if (random() > 0.6) {
    trees.push(generateBranch(
      w * (0.7 + random() * 0.2), 0,
      Math.PI / 2 + (random() * 0.4 - 0.2),
      h * 0.15, 0, 2.0
    ))
  }

  // Queue initial branches
  for (const tree of trees) { scheduleNode(tree) }

  if (!isAnimating) {
    isAnimating = true
    frame()
  }
}

function initCanvas() {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  
  // Fix visual size to CSS pixels
  canvas.style.width = `${window.innerWidth}px`
  canvas.style.height = `${window.innerHeight}px`
  
  ctx.scale(dpr, dpr)

  startGrowth()
}

// Event Listeners
let resizeTimeout: ReturnType<typeof setTimeout>
function onResize() {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    initCanvas()
  }, 300)
}

function handleVisibility() {
  if (document.hidden) {
    isAnimating = false
  } else {
    // Resume immediately if unpaused while work remains
    if (tasks.length > 0 && !isAnimating) {
      isAnimating = true
      frame()
    }
  }
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', onResize)
  document.addEventListener('visibilitychange', handleVisibility)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
  clearTimeout(resizeTimeout)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', handleVisibility)
  tasks = []
})

// Redraw entirely upon theme change keeping same structure
watch(isDark, () => {
  startGrowth()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="begonia-art"
  ></canvas>
</template>

<style scoped>
.begonia-art {
  position: fixed;
  inset: 0;
  z-index: -5;
  pointer-events: none;
}
</style>
