import { indexRoute as schoolRoute } from './school/index'

/** Корень аккаунта: отправляем на сайт школы. При объединении шаблонов замените на нужный раздел. */
export const rootRoute = app.get('/', async ctx => {
  ctx.resp.redirect(schoolRoute.path())
  return ''
})
