import { defineConfig } from 'vitepress'

const BASE = process.env.VITEPRESS_BASE ?? (
    process.env.NODE_ENV === 'production' ? '/Knowledge-Base/' : '/'
)

export default defineConfig({
  title: "Проектопакалипсис",
  description: "A VitePress Site",
  lang: 'ru-RU',
  base: BASE,

  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: `${BASE}favicon.ico` }],
    ['link', { rel: 'shortcut icon', href: `${BASE}favicon.ico` }]
  ],
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Места', link: '/places/' },
      { text: 'Люди', link: '/people/' },
      { text: 'Группы', link: '/bands/' },
    ],

    sidebar: {
      '/places/': [
        {
          text: 'Места',
          collapsed: false,
          items: [
            {
              text: 'Все места',
              link: '/places/',
              collapsed: false,
              items: [
                {
                  text: 'Центральные площадки',
                  collapsed: false,
                  items: [
                    { text: 'ДК имени Свердлова', link: '/places/dk-sverdlova' },
                    { text: 'Дворец молодёжи', link: '/places/dvorets-molodezhi' },
                    { text: 'ДК Автомобилистов', link: '/places/dk-avtomobilistov' },
                  ]
                },
                {
                  text: 'Университеты и студенческие места',
                  collapsed: false,
                  items: [
                    { text: 'УрФУ, Радиофак / РТФ УПИ', link: '/places/urfu-rtf' },
                    { text: 'Общежитие № 11 УрФУ', link: '/places/obschezhitie-11-urfu' },
                    { text: 'УрГАХУ, корпус «Пряник»', link: '/places/pryanik-urgahu' },
                  ]
                },
                {
                  text: 'Школы и культурные точки',
                  collapsed: false,
                  items: [
                    { text: 'ДК МЖК / Центр культуры «Молодёжный»', link: '/places/dk-mzhk-molodezhny' },
                    { text: 'Школа № 36', link: '/places/school-36' },
                    { text: 'Школа № 2', link: '/places/school-2' },
                  ]
                },
                {
                  text: 'Личные адреса',
                  collapsed: false,
                  items: [
                    { text: 'Дом Александра Башлачёва', link: '/places/bashlachev-house' },
                  ]
                }
              ]
            }
          ]
        }
      ],

      '/people/': [
        {
          text: 'Люди',
          collapsed: false,
          items: [
            { text: 'Все люди', link: '/people/' },
            { text: 'Ключевые фигуры', collapsed: false, items: [
                { text: 'Вячеслав Бутусов', link: '/people/vyacheslav-butusov' },
                { text: 'Владимир Шахрин', link: '/people/vladimir-shahrin' },
                { text: 'Владимир Бегунов', link: '/people/vladimir-begunov' },
                { text: 'Вадим Самойлов', link: '/people/vadim-samoilov' },
                { text: 'Глеб Самойлов', link: '/people/gleb-samoilov' },
                { text: 'Александр Козлов', link: '/people/alexander-kozlov' },
                { text: 'Настя Полева', link: '/people/nastya-poleva' },
                { text: 'Александр Пантыкин', link: '/people/alexander-pantykin' },
                { text: 'Илья Кормильцев', link: '/people/ilya-kormiltsev' },
                { text: 'Егор Белкин', link: '/people/egor-belkin' },
                { text: 'Александр Башлачёв', link: '/people/alexander-bashlachev' }
              ] },
            { text: 'Свердловский рок-клуб и классика', collapsed: false, items: [
                { text: 'Дмитрий Умецкий', link: '/people/dmitry-umetsky' },
                { text: 'Алексей Могилевский', link: '/people/alexey-mogilevsky' },
                { text: 'Олег Решетников', link: '/people/oleg-reshetnikov' },
                { text: 'Валерий Северин', link: '/people/valery-severin' },
                { text: 'Вячеслав Двинин', link: '/people/vyacheslav-dvinin' },
                { text: 'Пётр Май', link: '/people/petr-may' },
                { text: 'Андрей Котов', link: '/people/andrey-kotov' },
                { text: 'Евгений Кормильцев', link: '/people/evgeny-kormiltsev' },
                { text: 'Владимир Назимов', link: '/people/vladimir-nazimov' },
                { text: 'Игорь Гришенков', link: '/people/igor-grishenkov' },
                { text: 'Михаил Симаков', link: '/people/mikhail-simakov' },
                { text: 'Сергей Чернышёв', link: '/people/sergey-chernyshev' },
                { text: 'Сергей Кондаков', link: '/people/sergey-kondakov' },
                { text: 'Владимир Филиппов', link: '/people/vladimir-filippov' },
                { text: 'Александр Каменецкий', link: '/people/alexander-kamenetsky' },
                { text: 'Андрей Коняхин', link: '/people/andrey-konyakhin' },
                { text: 'Андрей Голиков', link: '/people/andrey-golikov' }
              ] },
            { text: 'Ранняя сцена', collapsed: false, items: [
                { text: 'Игорь Скрипкарь', link: '/people/igor-skripkar' },
                { text: 'Михаил Перов', link: '/people/mikhail-perov' },
                { text: 'Андрей Балашов', link: '/people/andrey-balashov' },
                { text: 'Евгений Димов', link: '/people/evgeny-dimov' },
                { text: 'Аркадий Застырец', link: '/people/arkady-zastyrets' },
                { text: 'Виктор Резников', link: '/people/viktor-reznikov' },
                { text: 'Олег Моисеев', link: '/people/oleg-moiseev' },
                { text: 'Сергей Полухин', link: '/people/sergey-polukhin' },
                { text: 'Сергей Долгополов', link: '/people/sergey-dolgopolov' }
              ] },
            { text: 'Новая екатеринбургская сцена', collapsed: false, items: [
                { text: 'Сергей Бобунец', link: '/people/sergey-bobunets' },
                { text: 'Константин Лекомцев', link: '/people/konstantin-lekomtsev' },
                { text: 'Николай Ротов', link: '/people/nikolay-rotov' },
                { text: 'Максим Митенков', link: '/people/maxim-mitenkov' },
                { text: 'Евгений Гантимуров', link: '/people/evgeny-gantimurov' },
                { text: 'Олег Гененфельд', link: '/people/oleg-genenfeld' },
                { text: 'Саша Гагарин', link: '/people/sasha-gagarin' },
                { text: 'Сергей Королёв', link: '/people/sergey-korolev' },
                { text: 'Александра Кучерова', link: '/people/alexandra-kucherova' },
                { text: 'Руслан Манин', link: '/people/ruslan-manin' },
                { text: 'Евгений Пьянков', link: '/people/evgeny-pyankov' },
                { text: 'Сергей Данилов', link: '/people/sergey-danilov' },
                { text: 'Олег Ягодин', link: '/people/oleg-yagodin' },
                { text: 'Юрий Облеухов', link: '/people/yury-obleukhov' },
                { text: 'Владимир Коперник', link: '/people/vladimir-kopernik' },
                { text: 'Василий Скородинский', link: '/people/vasily-skorodinsky' },
                { text: 'Олег Кудрявцев', link: '/people/oleg-kudryavtsev' },
                { text: 'Денис Михайлов', link: '/people/denis-mikhailov' }
              ] },
            { text: 'Организаторы, исследователи, кино', collapsed: false, items: [
                { text: 'Евгений Горенбург', link: '/people/evgeny-gorenburg' },
                { text: 'Алексей Карасюк', link: '/people/alexey-karasyuk' },
                { text: 'Алексей Балабанов', link: '/people/alexey-balabanov' }
              ] },
          ]
        }
      ],

      '/bands/': [
        {
          text: 'Группы',
          collapsed: false,
          items: [
            { text: 'Все группы', link: '/bands/' },
            { text: 'Классика Свердловского рок-клуба', collapsed: false, items: [
                { text: 'Наутилус Помпилиус', link: '/bands/nautilus-pompilius' },
                { text: 'Чайф', link: '/bands/chaif' },
                { text: 'Агата Кристи', link: '/bands/agata-kristi' },
                { text: 'Настя', link: '/bands/nastya' },
                { text: 'Урфин Джюс', link: '/bands/urfin-dzhus' },
                { text: 'Апрельский марш', link: '/bands/aprelsky-marsh' },
                { text: 'Отражение', link: '/bands/otrazhenie' },
              ] },
            { text: 'Ранняя сцена до рок-клуба', collapsed: false, items: [
                { text: 'Трек', link: '/bands/trek' },
                { text: 'Р-Клуб', link: '/bands/r-club' },
              ] },
            { text: 'Новая екатеринбургская сцена', collapsed: false, items: [
                { text: 'Смысловые Галлюцинации', link: '/bands/smyslovye-gallyutsinatsii' },
                { text: 'Сансара', link: '/bands/sansara' },
                { text: 'Курара', link: '/bands/kurara' },
              ] },
            { text: 'Современная российская сцена', collapsed: false, items: [
                { text: 'Обе-Рек', link: '/bands/obe-rek' },
              ] },
          ]
        }
      ]
    },

    outline: {
      level: 'deep',
      label: 'Содержание страницы'
    },
    sidebarMenuLabel: 'Меню',
  }
})