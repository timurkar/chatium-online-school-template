/** Демо-курсы для быстрого старта. Фото — CC0 (Unsplash через Wikimedia Commons), уже загружены в хранилище Chatium. */

/** Демо-ролик в хранилище Chatium (12 секунд, сгенерирован) — показывает плеер StorageVideoPlayer. */
const DEMO_VIDEO_HASH = 'video_msk_lvHZFbEDZV.d12.1280x720.mp4'
/** Внешняя ссылка на видео (Big Buck Bunny, CC BY) — пример второго способа: mp4 по URL. */
const DEMO_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

type DemoLesson = { title: string; description: string; content: string; minutes: number; free?: boolean; videoHash?: string; videoUrl?: string }

export type DemoCourse = {
  title: string
  description: string
  fullDescription: string
  whatYouLearn: string[]
  imageHash: string
  price: number
  oldPrice?: number
  level: 'beginner' | 'intermediate' | 'advanced'
  durationWeeks: number
  teacherName: string
  teacherTitle: string
  teacherImageHash: string
  featured?: boolean
  lessons: DemoLesson[]
}

function lesson(title: string, description: string, minutes: number, extra: Partial<DemoLesson> = {}): DemoLesson {
  return {
    title,
    description,
    minutes,
    content: `## ${title}\n\n${description}\n\nВ этом уроке разбираем тему на практике: сначала короткая теория, затем пример и задание для самостоятельной работы.\n\n**Что сделать после урока**\n- Повторите пример из видео на своём проекте\n- Ответьте на вопросы в конце конспекта\n- Задайте вопросы наставнику в чате курса`,
    ...extra,
  }
}

export const DEMO_COURSES: DemoCourse[] = [
  {
    title: 'UX/UI-дизайн с нуля',
    description: 'От первых макетов в Figma до готового прототипа мобильного приложения.',
    fullDescription:
      'Курс для тех, кто хочет войти в дизайн интерфейсов без опыта. Мы разберём принципы UX-исследований, научимся собирать макеты в Figma, работать с типографикой и цветом, а в конце соберём кликабельный прототип приложения и оформим кейс для портфолио.',
    whatYouLearn: ['Проводить UX-исследования и строить CJM', 'Уверенно работать в Figma', 'Собирать дизайн-систему', 'Оформлять кейс для портфолио'],
    imageHash: 'image_msk_KuL2ZJocaR.1600x1067.jpeg',
    price: 24900,
    oldPrice: 32000,
    level: 'beginner',
    durationWeeks: 8,
    teacherName: 'Алина Ковалёва',
    teacherTitle: 'Lead Product Designer, 9 лет в продуктах',
    teacherImageHash: 'image_msk_xCAbhjTCUu.1067x1600.jpeg',
    featured: true,
    lessons: [
      lesson('Что такое UX и UI', 'Разбираемся, чем занимается дизайнер интерфейсов и как устроен процесс.', 14, { free: true, videoHash: DEMO_VIDEO_HASH }),
      lesson('Знакомство с Figma', 'Интерфейс, фреймы, компоненты и автолейаут.', 22, { free: true, videoUrl: DEMO_VIDEO_URL }),
      lesson('Исследование пользователей', 'Интервью, опросы и карта пути клиента.', 18),
      lesson('Типографика и сетки', 'Как сделать макет читаемым и аккуратным.', 20),
      lesson('Цвет и визуальная иерархия', 'Палитры, контраст и акценты.', 17),
      lesson('Прототипирование', 'Собираем кликабельный прототип и тестируем на людях.', 25),
      lesson('Итоговый проект', 'Оформляем кейс и готовим презентацию.', 30),
    ],
  },
  {
    title: 'Frontend на Vue 3',
    description: 'Современный фронтенд: компоненты, состояние, роутинг и работа с API.',
    fullDescription:
      'Практический курс по Vue 3 и Composition API. Начнём с основ реактивности и постепенно соберём полноценное SPA-приложение с авторизацией, списками, формами и загрузкой данных. Каждый модуль заканчивается заданием с проверкой наставником.',
    whatYouLearn: ['Composition API и реактивность', 'Компоненты, слоты и пропсы', 'Работа с API и состоянием', 'Сборка и деплой приложения'],
    imageHash: 'image_msk_qzIimhDMaW.1600x1600.jpeg',
    price: 29900,
    level: 'intermediate',
    durationWeeks: 10,
    teacherName: 'Дмитрий Орлов',
    teacherTitle: 'Senior Frontend Engineer',
    teacherImageHash: 'image_msk_E436hpyYk6.1600x1600.jpeg',
    featured: true,
    lessons: [
      lesson('Зачем нужен Vue', 'Обзор экосистемы и первое приложение.', 12, { free: true, videoHash: DEMO_VIDEO_HASH }),
      lesson('Реактивность: ref и reactive', 'Как Vue отслеживает изменения.', 19, { free: true }),
      lesson('Компоненты и пропсы', 'Разбиваем интерфейс на части.', 21),
      lesson('События и формы', 'v-model, валидация, обработка ошибок.', 18),
      lesson('Загрузка данных', 'Работа с API, состояния загрузки и ошибок.', 24),
      lesson('Итоговый проект', 'Собираем приложение целиком.', 35),
    ],
  },
  {
    title: 'Контент-маркетинг',
    description: 'Как выстроить контент, который приводит клиентов, а не просто лайки.',
    fullDescription:
      'Курс для маркетологов, предпринимателей и авторов. Научимся определять аудиторию, строить контент-стратегию, писать тексты для соцсетей и рассылок, измерять результат и улучшать его.',
    whatYouLearn: ['Строить контент-стратегию', 'Писать тексты, которые читают', 'Запускать рассылки', 'Считать эффективность контента'],
    imageHash: 'image_msk_4K2tLBIj16.1600x1067.jpeg',
    price: 14900,
    oldPrice: 19900,
    level: 'beginner',
    durationWeeks: 5,
    teacherName: 'Ольга Никитина',
    teacherTitle: 'Head of Content, ex-агентство',
    teacherImageHash: 'image_msk_uJ0Du3CP8T.1067x1600.jpeg',
    featured: true,
    lessons: [
      lesson('Кому и зачем мы пишем', 'Аудитория, боли и обещание бренда.', 15, { free: true, videoHash: DEMO_VIDEO_HASH }),
      lesson('Контент-стратегия за вечер', 'Рубрики, форматы и календарь.', 20),
      lesson('Тексты для соцсетей', 'Заголовки, структура, призыв к действию.', 18),
      lesson('Email-рассылки', 'Как не попасть в спам и получить ответы.', 17),
      lesson('Аналитика контента', 'Метрики, которые действительно важны.', 16),
    ],
  },
  {
    title: 'Python для анализа данных',
    description: 'Pandas, визуализация и первые модели — на реальных датасетах.',
    fullDescription:
      'Курс для аналитиков и всех, кто работает с таблицами. Освоим Python с нуля, научимся чистить и объединять данные в Pandas, строить графики и делать выводы, а в финале соберём отчёт по реальному датасету.',
    whatYouLearn: ['Основы Python', 'Обработка данных в Pandas', 'Визуализация в Matplotlib', 'Построение отчётов'],
    imageHash: 'image_msk_jthHkced8H.1600x1140.jpeg',
    price: 19900,
    level: 'beginner',
    durationWeeks: 6,
    teacherName: 'Сергей Волков',
    teacherTitle: 'Data Analyst, финтех',
    teacherImageHash: 'image_msk_uJegD2lsmq.1067x1600.jpeg',
    lessons: [
      lesson('Первая программа на Python', 'Установка, переменные, типы данных.', 16, { free: true, videoHash: DEMO_VIDEO_HASH }),
      lesson('Списки, словари и циклы', 'Основные структуры данных.', 20, { free: true }),
      lesson('Знакомство с Pandas', 'DataFrame, фильтрация, группировка.', 24),
      lesson('Визуализация данных', 'Графики, которые объясняют.', 18),
      lesson('Итоговый отчёт', 'Собираем анализ датасета от начала до конца.', 30),
    ],
  },
  {
    title: 'Публичные выступления',
    description: 'Бесплатный мини-курс: как перестать бояться сцены и говорить убедительно.',
    fullDescription:
      'Короткий бесплатный курс из четырёх уроков. Разберём структуру выступления, работу с волнением, голосом и слайдами. Подойдёт всем, кто презентует проекты, проводит встречи или готовится к первому докладу.',
    whatYouLearn: ['Строить структуру выступления', 'Справляться с волнением', 'Работать с голосом и паузами', 'Делать понятные слайды'],
    imageHash: 'image_msk_Wfe4ixRU5b.1600x1067.jpeg',
    price: 0,
    level: 'beginner',
    durationWeeks: 1,
    teacherName: 'Марк Соколов',
    teacherTitle: 'Тренер по коммуникациям',
    teacherImageHash: 'image_msk_4u79ZAYwrO.1600x1067.jpeg',
    featured: true,
    lessons: [
      lesson('Структура выступления', 'Начало, аргументы и финал.', 12, { free: true, videoHash: DEMO_VIDEO_HASH }),
      lesson('Волнение — это нормально', 'Техники, которые работают за минуту до выхода.', 10, { free: true }),
      lesson('Голос и паузы', 'Как звучать уверенно.', 11, { free: true }),
      lesson('Слайды, которые помогают', 'Минимализм и один тезис на слайд.', 13, { free: true }),
    ],
  },
  {
    title: 'Архитектура веб-приложений',
    description: 'Проектирование систем, которые выдерживают рост: от монолита до сервисов.',
    fullDescription:
      'Продвинутый курс для разработчиков с опытом. Обсуждаем принципы проектирования, границы контекстов, очереди и кеширование, наблюдаемость и надёжность. Каждый модуль — разбор реального кейса и практическое задание.',
    whatYouLearn: ['Проектировать границы модулей', 'Выбирать между монолитом и сервисами', 'Работать с очередями и кешами', 'Строить наблюдаемые системы'],
    imageHash: 'image_msk_LPZiceuaF3.1600x1068.jpeg',
    price: 39900,
    level: 'advanced',
    durationWeeks: 8,
    teacherName: 'Илья Громов',
    teacherTitle: 'Staff Engineer, высоконагруженные системы',
    teacherImageHash: 'image_msk_PMGRS4HXTL.1037x1600.jpeg',
    lessons: [
      lesson('Что такое хорошая архитектура', 'Критерии и антипаттерны.', 18, { free: true, videoHash: DEMO_VIDEO_HASH }),
      lesson('Модульный монолит', 'Как не превратить проект в клубок.', 22),
      lesson('Очереди и события', 'Асинхронность без боли.', 25),
      lesson('Кеширование', 'Уровни кеша и инвалидация.', 20),
      lesson('Наблюдаемость', 'Логи, метрики, трассировка.', 21),
      lesson('Разбор кейса', 'Проектируем систему с нуля вместе.', 40),
    ],
  },
]
