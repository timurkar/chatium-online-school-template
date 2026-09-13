import { requireAccountRole } from '@app/auth'
import Lessons from '../../../school/tables/lessons.table'
import { toLessonFull } from '../../../school/server/course-data'
import { lessonBody } from '../../server/course-schema'

export const lessonCreateRoute = app.post('/')
  .query(s => ({ course: s.string() }))
  .body(lessonBody)
  .handle(async (ctx, req) => {
    requireAccountRole(ctx, 'Staff')
    const b = req.body
    const count = await Lessons.countBy(ctx, { course: req.query.course })
    const row = await Lessons.create(ctx, {
      course: req.query.course,
      title: b.title.trim(),
      description: b.description.trim(),
      content: b.content,
      videoHash: b.videoHash?.trim() || undefined,
      videoUrl: b.videoUrl?.trim() || undefined,
      durationMinutes: b.durationMinutes,
      isFree: b.isFree,
      sortOrder: count + 1,
    })
    return toLessonFull(row)
  })
