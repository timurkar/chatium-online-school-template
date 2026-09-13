import { Heap } from '@app/heap'
import Courses from './courses.table'

const Enrollments = Heap.Table('t_school_enrollments_N4RD', {
  user: Heap.UserRefLink({ customMeta: { title: 'Студент' } }),
  course: Heap.RefLink(Courses, { customMeta: { title: 'Курс' } }),
  status: Heap.Enum(
    { pending: 'pending', active: 'active', completed: 'completed', cancelled: 'cancelled' } as const,
    { customMeta: { title: 'Статус' } },
  ),
  studentName: Heap.String({ customMeta: { title: 'Имя студента (на момент заявки)' } }),
  studentContact: Heap.String({ customMeta: { title: 'Контакт студента' } }),
  comment: Heap.Optional(Heap.String({ customMeta: { title: 'Комментарий' } })),
  completedLessons: Heap.Array(Heap.String({ customMeta: { title: 'ID урока' } }), { customMeta: { title: 'Пройденные уроки' } }),
  lastLessonId: Heap.Optional(Heap.String({ customMeta: { title: 'Последний открытый урок' } })),
}, { customMeta: { title: 'Записи на курсы', description: 'Заявки и активные записи студентов' } })

export default Enrollments
