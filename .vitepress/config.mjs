import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Проектопакалипсис",
  description: "A VitePress Site",
  lang: 'ru-RU',
  base: '/Knowledge-Base/',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
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
      ]
    },

    outline: {
      level: 'deep',
      label: 'Содержание страницы'
    },
    sidebarMenuLabel: 'Меню',
  }
})