import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import DefaultLayout from './Layouts/DefaultLayout';

createInertiaApp({
  resolve: async (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx')
    const page = await pages[`./Pages/${name}.jsx`]()
    page.default.layout =
      page.default.layout || ((page) => <DefaultLayout children={page} />)
    return page
  },  
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})

