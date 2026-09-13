import { Money } from '@app/heap'
import Courses from './tables/courses.table'
import Lessons from './tables/lessons.table'
import { DEMO_COURSES } from './server/seed-data'
import { SCHOOL } from './shared/config'

/**
 * GET /seed — наполняет школу демо-курсами. Идемпотентно: если курсы уже есть, ничего не делает,
 * поэтому роут открыт без авторизации — удобно для первого запуска шаблона.
 */
export const seedRoute = app.get('/', async ctx => {
  const existing = await Courses.countBy(ctx)
  if (existing > 0) return { seeded: false, reason: `Уже есть ${existing} курсов` }

  let lessonsCreated = 0
  for (const [index, c] of DEMO_COURSES.entries()) {
    const course = await Courses.create(ctx, {
      title: c.title,
      description: c.description,
      fullDescription: c.fullDescription,
      whatYouLearn: c.whatYouLearn,
      emoji: c.emoji,
      price: new Money(c.price, SCHOOL.currency),
      oldPrice: c.oldPrice ? new Money(c.oldPrice, SCHOOL.currency) : undefined,
      level: c.level,
      durationWeeks: c.durationWeeks,
      teacherName: c.teacherName,
      teacherTitle: c.teacherTitle,
      teacherEmoji: c.teacherEmoji,
      status: 'active',
      featured: c.featured ?? false,
      sortOrder: index + 1,
    })
    for (const [li, l] of c.lessons.entries()) {
      await Lessons.create(ctx, {
        course: course.id,
        title: l.title,
        description: l.description,
        content: l.content,
        videoUrl: l.video,
        durationMinutes: l.minutes,
        isFree: l.free ?? false,
        sortOrder: li + 1,
      })
      lessonsCreated++
    }
  }
  return { seeded: true, courses: DEMO_COURSES.length, lessons: lessonsCreated }
})
