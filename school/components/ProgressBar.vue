<template>
  <div>
    <div v-if="showLabel" class="flex justify-between text-xs text-slate-500 mb-1">
      <span>{{ done }} из {{ total }} уроков</span>
      <span class="font-semibold text-slate-700">{{ percent }}%</span>
    </div>
    <div class="h-2 rounded-full bg-slate-100 overflow-hidden">
      <div class="h-full rounded-full transition-all duration-500" :class="percent >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'" :style="{ width: percent + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ done: number; total: number; showLabel?: boolean }>(), { showLabel: true })
const percent = computed(() => (props.total > 0 ? Math.round((props.done / props.total) * 100) : 0))
</script>
