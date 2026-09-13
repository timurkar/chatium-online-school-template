<template>
  <div class="relative overflow-hidden bg-slate-100" :class="wrapperClass">
    <img v-if="imageHash" :src="getThumbnailUrl(ctx, imageHash, width)" :alt="title" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
    <div v-else class="absolute inset-0 grid place-items-center bg-gradient-to-br" :class="gradient">
      <span class="select-none drop-shadow-sm" :class="emojiClass">{{ emoji }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getThumbnailUrl } from '@app/storage'

const props = withDefaults(
  defineProps<{ imageHash?: string | null; emoji: string; title: string; seed?: string; width?: number; wrapperClass?: string; emojiClass?: string }>(),
  { imageHash: null, seed: '', width: 800, wrapperClass: 'aspect-[16/10] rounded-2xl', emojiClass: 'text-6xl' },
)

const gradients = [
  'from-indigo-500 to-violet-600',
  'from-sky-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-400 to-orange-500',
  'from-fuchsia-500 to-purple-600',
  'from-cyan-500 to-blue-600',
  'from-lime-500 to-green-600',
]

const gradient = computed(() => {
  const key = props.seed || props.title
  let hash = 0
  for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return gradients[hash % gradients.length]
})
</script>
