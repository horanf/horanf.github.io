<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const iframeRef = ref<HTMLIFrameElement>()
const iframeHeight = ref(0)
const loading = ref(true)

function syncHeight() {
  const iframe = iframeRef.value
  if (!iframe?.contentDocument?.body)
    return
  iframeHeight.value = iframe.contentDocument.documentElement.scrollHeight
}

function onIframeLoad() {
  const iframe = iframeRef.value
  if (!iframe?.contentWindow)
    return

  syncHeight()
  loading.value = false

  // Observe content size changes (e.g. font loading, image loading)
  const ro = new ResizeObserver(syncHeight)
  ro.observe(iframe.contentDocument!.documentElement)
  onBeforeUnmount(() => ro.disconnect())
}

onMounted(() => {
  // Fallback: if load event already fired
  if (iframeRef.value?.contentDocument?.readyState === 'complete') {
    onIframeLoad()
  }
})
</script>

<template>
  <div class="cv-container">
    <div v-if="loading" class="text-center py-20 text-neutral-400">
      Loading...
    </div>

    <iframe
      ref="iframeRef"
      src="/cv/fanghaoran_CV.html"
      :style="{ height: iframeHeight ? `${iframeHeight}px` : '100vh' }"
      :class="{ invisible: loading }"
      class="cv-iframe"
      frameborder="0"
      scrolling="no"
      @load="onIframeLoad"
    />
  </div>
</template>

<style scoped>
.cv-container {
  margin: -45px -24px;
}

.cv-iframe {
  width: 100%;
  border: none;
  display: block;
  overflow: hidden;
}

.invisible {
  visibility: hidden;
  position: absolute;
}
</style>
