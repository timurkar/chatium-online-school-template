<template>
  <article class="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition">
    <a :href="courseRoute.query({ id: course.id }).url()" class="block relative">
      <CourseCover :image-hash="course.imageHash" :emoji="course.emoji" :title="course.title" :seed="course.id" wrapper-class="aspect-[16/10]" emoji-class="text-7xl group-hover:scale-110 transition-transform duration-300" />
      <div class="absolute top-3 left-3 flex gap-1.5">
        <span class="px-2 py-0.5 rounded-full bg-white/90 text-slate-800 text-xs font-semibold">{{ course.levelLabel }}</span>
        <span v-if="course.isFree" class="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-bold">Бесплатно</span>
      </div>
    </a>
    <div class="p-5 flex flex-col flex-1 gap-3">
      <a :href="courseRoute.query({ id: course.id }).url()" class="text-lg font-bold leading-snug hover:underline line-clamp-2">{{ course.title }}</a>
      <p class="text-sm text-slate-500 line-clamp-2">{{ course.description }}</p>
      <div class="flex items-center gap-3 text-xs text-slate-500">
        <span class="inline-flex items-center gap-1"><Icon name="book" size="w-3.5 h-3.5" /> {{ course.lessonsCount }} {{ pluralize(course.lessonsCount, 'урок', 'урока', 'уроков') }}</span>
        <span class="inline-flex items-center gap-1"><Icon name="clock" size="w-3.5 h-3.5" /> {{ course.durationWeeks }} {{ pluralize(course.durationWeeks, 'неделя', 'недели', 'недель') }}</span>
      </div>
      <div class="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div class="flex items-center gap-2 min-w-0">
          <span class="w-8 h-8 rounded-full bg-slate-100 grid place-items-center text-lg shrink-0">{{ course.teacherEmoji }}</span>
          <span class="text-sm text-slate-600 truncate">{{ course.teacherName }}</span>
        </div>
        <div class="text-right shrink-0">
          <div class="font-bold" :class="course.isFree ? 'text-emerald-600' : ''">{{ course.priceFormatted }}</div>
          <div v-if="course.oldPriceFormatted" class="text-xs text-slate-400 line-through">{{ course.oldPriceFormatted }}</div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import Icon from './Icon.vue'
import CourseCover from './CourseCover.vue'
import { pluralize } from '../shared/format'
import { courseRoute } from '../course'

defineProps<{ course: any }>()
</script>
