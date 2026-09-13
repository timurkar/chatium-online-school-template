import { requireAccountRole } from '@app/auth'
import Lessons from '../../../school/tables/lessons.table'
import { toLessonFull } from '../../../school/server/course-data'
import { lessonBody } from '../../server/course-schema'

export const lessonUpdateRoute = app.post('/')
  .query(s => ({ id: s.string() }))
  .body(lessonBody)
  .handle(async (ctx, req) => {
    requireAccountRole(ctx, 'Staff')
    const b = req.body
    const row = await Lessons.update(ctx, {
      id: req.query.id,
      title: b.title.trim(),
      description: b.description.trim(),
      content: b.content,
      videoHash: b.videoHash?.trim() || null,
      videoUrl: b.videoUrl?.trim() || null,
      durationMinutes: b.durationMinutes,
      isFree: b.isFree,
    })
    return toLessonFull(row)
  })
