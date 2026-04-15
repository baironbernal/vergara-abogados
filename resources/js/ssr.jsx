import { createInertiaApp } from '@inertiajs/react'
import createServer from '@inertiajs/react/server'
import ReactDOMServer from 'react-dom/server'
import DefaultLayout from './Layouts/DefaultLayout'

createServer((page) =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
      const component = pages[`./Pages/${name}.jsx`]
      component.default.layout ??= (page) => <DefaultLayout>{page}</DefaultLayout>
      return component
    },
    setup: ({ App, props }) => <App {...props} />,
  })
)
