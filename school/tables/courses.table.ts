import { Heap } from '@app/heap'

const Courses = Heap.Table('t_school_courses_N4RD', {
  title: Heap.String({ customMeta: { title: 'Название' }, searchable: { langs: ['ru', 'en'] } }),
  description: Heap.String({ customMeta: { title: 'Короткое описание' }, searchable: { langs: ['ru', 'en'] } }),
  fullDescription: Heap.String({ customMeta: { title: 'Подробное описание' } }),
  whatYouLearn: Heap.Array(Heap.String({ customMeta: { title: 'Пункт' } }), { customMeta: { title: 'Чему научитесь' } }),
  emoji: Heap.String({ customMeta: { title: 'Эмодзи-обложка' } }),
  imageHash: Heap.Optional(Heap.String({ customMeta: { title: 'Хеш обложки в хранилище' } })),
  price: Heap.Money({ customMeta: { title: 'Цена (0 — бесплатно)' } }),
  oldPrice: Heap.Optional(Heap.Money({ customMeta: { title: 'Старая цена' } })),
  level: Heap.Enum(
    { beginner: 'beginner', intermediate: 'intermediate', advanced: 'advanced' } as const,
    { customMeta: { title: 'Уровень' } },
  ),
  durationWeeks: Heap.Number({ customMeta: { title: 'Длительность, недель' } }),
  teacherName: Heap.String({ customMeta: { title: 'Преподаватель' } }),
  teacherTitle: Heap.String({ customMeta: { title: 'Должность преподавателя' } }),
  teacherEmoji: Heap.String({ customMeta: { title: 'Эмодзи преподавателя' } }),
  status: Heap.Enum({ active: 'active', draft: 'draft' } as const, { customMeta: { title: 'Статус' } }),
  featured: Heap.Boolean({ customMeta: { title: 'Показывать на главной' } }),
  sortOrder: Heap.Number({ customMeta: { title: 'Порядок' } }),
}, { customMeta: { title: 'Курсы', description: 'Курсы онлайн-школы' } })

export default Courses
