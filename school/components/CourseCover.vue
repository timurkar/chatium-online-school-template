<template>
  <div class="relative overflow-hidden bg-slate-100" :class="wrapperClass">
    <img v-if="imageHash" :src="getThumbnailUrl(ctx, imageHash, width)" :alt="title" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
    <div v-else class="absolute inset-0 grid place-items-center text-slate-300" :title="title">
      <Icon name="image" :size="iconSize" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getThumbnailUrl } from '@app/storage'
import Icon from './Icon.vue'

/** Обложка курса из хранилища Chatium; без фото — нейтральная заглушка. */
withDefaults(
  defineProps<{ imageHash?: string | null; title: string; width?: number; wrapperClass?: string; iconSize?: string }>(),
  { imageHash: null, width: 800, wrapperClass: 'aspect-[16/10] rounded-2xl', iconSize: 'w-10 h-10' },
)
</script>
