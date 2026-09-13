import { Heap } from '@app/heap'
import Courses from './courses.table'

const Lessons = Heap.Table('t_school_lessons_N4RD', {
  course: Heap.RefLink(Courses, { customMeta: { title: 'Курс' } }),
  title: Heap.String({ customMeta: { title: 'Название урока' } }),
  description: Heap.String({ customMeta: { title: 'Короткое описание' } }),
  content: Heap.String({ customMeta: { title: 'Текст урока (конспект)' } }),
  videoUrl: Heap.Optional(Heap.String({ customMeta: { title: 'Ссылка на видео (YouTube, VK, Rutube, mp4)' } })),
  durationMinutes: Heap.Number({ customMeta: { title: 'Длительность, минут' } }),
  isFree: Heap.Boolean({ customMeta: { title: 'Открытый урок (доступен без записи)' } }),
  sortOrder: Heap.Number({ customMeta: { title: 'Порядок в курсе' } }),
}, { customMeta: { title: 'Уроки', description: 'Уроки курсов' } })

export default Lessons
