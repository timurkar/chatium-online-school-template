<template>
  <div class="relative overflow-hidden rounded-full bg-slate-200 shrink-0" :class="sizeClass">
    <img v-if="imageHash" :src="getThumbnailUrl(ctx, imageHash, 200, 200)" :alt="name" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
    <div v-else class="absolute inset-0 grid place-items-center text-slate-500 font-semibold" :class="textClass">{{ initials }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getThumbnailUrl } from '@app/storage'

/** Фото человека из хранилища; без фото — инициалы. */
const props = withDefaults(defineProps<{ imageHash?: string | null; name: string; sizeClass?: string; textClass?: string }>(), {
  imageHash: null,
  sizeClass: 'w-10 h-10',
  textClass: 'text-sm',
})
const initials = computed(() => props.name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join(''))
</script>
