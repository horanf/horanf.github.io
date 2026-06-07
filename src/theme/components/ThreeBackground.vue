<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, toRef } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  isDark: boolean
}>()

const isDark = toRef(props, 'isDark')

const containerRef = ref<HTMLDivElement | null>(null)

// Three.js instances
let scene: THREE.Scene
let camera: THREE.OrthographicCamera
let renderer: THREE.WebGLRenderer
let material: THREE.ShaderMaterial
let animationFrameId = 0

// State variables
const mouse = new THREE.Vector2(0.5, 0.5)
const targetMouse = new THREE.Vector2(0.5, 0.5)
let currentDark = isDark.value ? 1.0 : 0.0
let targetDark = currentDark
let isVisible = true

// Uniforms object (stored separately for type-safe access)
const uniforms = {
  u_time: { value: 0.0 },
  u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
  u_dark: { value: currentDark },
}
// GLSL Shaders
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_dark;

  varying vec2 vUv;

  // Dark mode colors — 秋海棠红系 (deep warm reds)
  // Deep crimson (#5c0e0a) -> dark rose (#6e1528) -> burnt amber (#5e2a0a)
  const vec3 darkColor1 = vec3(92.0/255.0, 14.0/255.0, 10.0/255.0);
  const vec3 darkColor2 = vec3(110.0/255.0, 21.0/255.0, 40.0/255.0);
  const vec3 darkColor3 = vec3(94.0/255.0, 42.0/255.0, 10.0/255.0);

  // Light mode colors — 秋海棠红系 (soft warm pinks/corals)
  // Warm pink (#f0b5b3) -> coral (#f08b8b) -> peach amber (#f0c4a0)
  const vec3 lightColor1 = vec3(240.0/255.0, 181.0/255.0, 179.0/255.0);
  const vec3 lightColor2 = vec3(240.0/255.0, 139.0/255.0, 139.0/255.0);
  const vec3 lightColor3 = vec3(240.0/255.0, 196.0/255.0, 160.0/255.0);

  // Procedural noise function (fbm-like)
  float noise(vec2 p) {
    float t = u_time * 0.15;
    vec2 q = vec2(
      sin(p.x * 3.0 + t) + cos(p.y * 2.0 + t * 0.8),
      sin(p.y * 3.0 + t * 1.2) + cos(p.x * 2.0 - t)
    );
    return sin(q.x * 2.0 + p.y + t) * cos(q.y * 2.0 + p.x - t) * 0.5 + 0.5;
  }

  void main() {
    // Aspect ratio correction
    vec2 uv = vUv;
    uv.x *= u_resolution.x / u_resolution.y;

    // Subtle mouse distortion
    vec2 m = u_mouse * 2.0 - 1.0;
    vec2 p = uv + m * 0.05;

    // Generate two noise layers
    float n1 = noise(p);
    float n2 = noise(p + vec2(1.0));

    // Blend palettes
    vec3 cDark = mix(mix(darkColor1, darkColor2, n1), darkColor3, n2);
    vec3 cLight = mix(mix(lightColor1, lightColor2, n1), lightColor3, n2);

    // Mix based on theme
    vec3 finalColor = mix(cLight, cDark, u_dark);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

const initThree = () => {
  if (!containerRef.value) return

  // Scene setup
  scene = new THREE.Scene()
  
  // Use OrthographicCamera for a flat fullscreen plane
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0)
  containerRef.value.appendChild(renderer.domElement)

  // Fullscreen plane
  const geometry = new THREE.PlaneGeometry(2, 2)
  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    depthWrite: false,
    depthTest: false,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.frustumCulled = false
  scene.add(mesh)
}

const animate = (time: number) => {
  if (!isVisible) return

  // Smoothly interpolate dark mode uniform
  targetDark = isDark.value ? 1.0 : 0.0
  currentDark += (targetDark - currentDark) * 0.05
  
  // Smoothly interpolate mouse position
  mouse.x += (targetMouse.x - mouse.x) * 0.05
  mouse.y += (targetMouse.y - mouse.y) * 0.05

  if (material) {
  uniforms.u_time.value = time * 0.001
  uniforms.u_dark.value = currentDark
  uniforms.u_mouse.value.copy(mouse)
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }

  animationFrameId = requestAnimationFrame(animate)
}

const handleResize = () => {
  if (!renderer || !material) return
  renderer.setSize(window.innerWidth, window.innerHeight)
  uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight)
}

const handleMouseMove = (event: MouseEvent) => {
  // Normalize mouse position to 0-1
  targetMouse.x = event.clientX / window.innerWidth
  targetMouse.y = 1.0 - (event.clientY / window.innerHeight)
}

const handleVisibilityChange = () => {
  isVisible = !document.hidden
  if (isVisible) {
    // Resume animation loop
    cancelAnimationFrame(animationFrameId)
    animationFrameId = requestAnimationFrame(animate)
  }
}

// Watch theme change to trigger target transition immediately
watch(isDark, (val) => {
  targetDark = val ? 1.0 : 0.0
})

onMounted(() => {
  initThree()
  
  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true })
  
  // Start animation loop
  animationFrameId = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  
  cancelAnimationFrame(animationFrameId)

  // Cleanup Three.js resources
  if (material) material.dispose()
  if (scene) {
    scene.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
      }
    })
  }
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
    const domElement = renderer.domElement
    if (domElement.parentNode) {
      domElement.parentNode.removeChild(domElement)
    }
  }
})
</script>

<template>
  <div ref="containerRef" class="begonia-three-bg"></div>
</template>

<style scoped>
.begonia-three-bg {
  position: fixed;
  inset: 0;
  z-index: -10;
  pointer-events: none;
}
</style>
