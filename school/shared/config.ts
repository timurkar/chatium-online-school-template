// @shared

/** Настройки школы: название, контакты, валюта. Используются и на сервере, и в Vue. */
export const SCHOOL = {
  name: 'Lumen',
  tagline: 'Онлайн-школа, где учатся делом',
  description:
    'Практические курсы по дизайну, разработке и маркетингу. Короткие уроки, живые примеры и наставники, которые отвечают на вопросы.',
  currency: 'RUB' as const,
  phone: '+7 (900) 000-00-00',
  email: 'hello@lumen.school',
  telegram: '@lumen_school',
}

export const LEVELS = {
  beginner: 'Для начинающих',
  intermediate: 'Средний уровень',
  advanced: 'Продвинутый',
} as const

export type Level = keyof typeof LEVELS

export const ENROLLMENT_STATUSES = {
  pending: 'Заявка',
  active: 'Учится',
  completed: 'Завершил',
  cancelled: 'Отменена',
} as const

export type EnrollmentStatus = keyof typeof ENROLLMENT_STATUSES

export const COURSE_STATUSES = {
  active: 'Опубликован',
  draft: 'Черновик',
} as const

export type CourseStatus = keyof typeof COURSE_STATUSES
