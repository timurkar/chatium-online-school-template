import { requireAccountRole } from '@app/auth'
import { Money } from '@app/heap'
import Courses from '../../../school/tables/courses.table'
import { getAdminCourse } from '../../../school/server/course-data'
import { courseBody } from '../../server/course-schema'
import { SCHOOL } from '../../../school/shared/config'

export const courseUpdateRoute = app.post('/')
  .query(s => ({ id: s.string() }))
  .body(courseBody)
  .handle(async (ctx, req) => {
    requireAccountRole(ctx, 'Staff')
    const b = req.body
    const existing = await Courses.getById(ctx, req.query.id)
    await Courses.update(ctx, {
      id: existing.id,
      title: b.title.trim(),
      description: b.description.trim(),
      fullDescription: b.fullDescription.trim(),
      whatYouLearn: b.whatYouLearn.map(x => x.trim()).filter(Boolean),
      emoji: b.emoji?.trim() || '📘',
      imageHash: b.imageHash?.trim() || null,
      price: new Money(b.price, SCHOOL.currency),
      oldPrice: b.oldPrice && b.oldPrice > b.price ? new Money(b.oldPrice, SCHOOL.currency) : null,
      level: b.level,
      durationWeeks: b.durationWeeks,
      teacherName: b.teacherName.trim(),
      teacherTitle: b.teacherTitle.trim(),
      teacherEmoji: b.teacherEmoji?.trim() || '🧑‍🏫',
      status: b.status,
      featured: b.featured,
      sortOrder: b.sortOrder ?? existing.sortOrder,
    })
    return getAdminCourse(ctx, existing.id)
  })
