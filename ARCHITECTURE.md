# Arquitectura del sitio — Inmobiliaria Vergara y Abogados

Sitio web corporativo para una firma de abogados / inmobiliaria en Soacha,
Cundinamarca. Combina un sitio público (marketing, catálogo de propiedades,
blog, agendamiento de visitas) con un panel de administración interno.

## Stack tecnológico

**Backend**
- **PHP 8.2+** con **Laravel 12** — framework principal.
- **Filament 3** — panel de administración (`/admin`) generado sobre Livewire.
- **Inertia.js (server-side)** — puente entre Laravel y React sin construir una API REST.
- **spatie/laravel-permission** — roles y permisos.
- **saade/filament-fullcalendar** — calendario de visitas en el admin.
- **bezhansalleh/filament-language-switch** — cambio de idioma en el panel.

**Frontend**
- **React 19** — vistas públicas, resueltas por Inertia.
- **Inertia React adapter** con **SSR** (server-side rendering vía `ssr.jsx`).
- **Tailwind CSS 3** — estilos.
- **Zustand** — estado global ligero en cliente (p. ej. SEO).
- **react-hook-form + zod** — formularios y validación (contacto multi-paso, visitas).
- **motion** (Framer Motion) — animaciones.
- **FullCalendar (React)** — selección de fechas de visita.
- **lucide-react** — iconografía; **@fontsource** para fuentes (DM Sans, Prata).
- **dompurify** — sanitización de HTML (contenido del blog).

**Build / tooling**
- **Vite 7** con `laravel-vite-plugin` y `@vitejs/plugin-react`.
- Fuentes precargadas y críticas servidas desde `/build/assets`.
- Alias `@` → `resources/js`.

## Arquitectura general

```
Navegador ──► Rutas Laravel (routes/web.php)
                    │
                    ├─ Controllers (Http/Controllers) ──► Models (Eloquent)
                    │        │
                    │        └─ Inertia::render('Pagina', props)
                    │
                    ▼
      app.blade.php (head SEO server-rendered)
                    │
             @inertia + React (resources/js/Pages/*)
                    │
             DefaultLayout / SecondaryLayout

/admin  ──► Filament PanelProvider ──► Resources (CRUD) + Widgets
```

- **Una sola app Laravel** sirve el sitio público (Inertia + React) y el
  panel de administración (Filament). No hay backend separado a pesar del
  nombre de la carpeta `api/`.
- **Inertia** actúa como capa de transporte: los controllers devuelven
  `Inertia::render()` con props; React monta la página correspondiente. No se
  escribe una API REST ni se gestionan rutas del lado del cliente manualmente.

## Patrones utilizados

### 1. Monolito Inertia (sin API separada)
Los controllers retornan componentes React con datos ya resueltos como props
(ej. `HomeController` → `Inertia::render('Home', ['lawyers' => ...])`). Esto
elimina el boilerplate de una API + fetching en cliente.

### 2. Layouts persistentes
`app.jsx` asigna automáticamente `DefaultLayout` a cada página vía
`page.default.layout`. Existe también un `SecondaryLayout` para vistas que
requieren otro marco. El mismo patrón se replica en `ssr.jsx` para SSR.

### 3. Datos compartidos globales (Inertia shared props)
`HandleInertiaRequests::share()` inyecta en **todas** las páginas:
- `corporativeInfo` (datos de la empresa, cacheados 6 h),
- `canonicalUrl` (URL sin query string).

### 4. SEO server-rendered vía `SeoManager` (patrón registro estático)
`app/Services/SeoManager.php` es un servicio estático donde el controller
registra título, descripción, keywords y esquemas JSON-LD. `app.blade.php`
los lee en el `<head>` antes de montar React → los meta tags, Open Graph,
Twitter Card, geo-targeting y **JSON-LD (LocalBusiness / RealEstateAgent)**
existen en el HTML inicial, esenciales para SEO local ("abogados Soacha").
En cliente, `useSeoStore` (Zustand) + `useSeoManager` mantienen los meta al
navegar entre páginas Inertia.

### 5. Caché de lecturas costosas
Uso consistente de `cache()->remember()` para datos poco cambiantes
(información corporativa, SEO de páginas por ruta) con TTLs explícitos.

### 6. Admin como configuración declarativa (Filament)
Cada entidad tiene un `Resource` (`PropertyResource`, `LawyerResource`,
`BlogResource`, `VisitResource`, etc.) que auto-descubre Filament. Los CRUD,
formularios, tablas y validaciones se declaran, no se codifican a mano. El
`AdminPanelProvider` centraliza tema, logo, notificaciones de base de datos y
el plugin de calendario. Componentes reutilizables como `SeoFieldset`
(`Filament/Forms/Components`) evitan duplicar campos de SEO entre recursos.

### 7. Organización del frontend por dominio
`resources/js/Components` se agrupa por área (`Home`, `Properties`,
`Services`, `Shared`). Lo transversal (header, footer, formularios, botones,
WhatsApp flotante, JSON-LD) vive en `Shared`. Hooks propios en `hooks/`
(`useContactForm`, `useStep`, `useSeoManager`) encapsulan lógica reutilizable.

### 8. Formularios validados y seguros
Formularios con `react-hook-form` + esquemas `zod` (ver
`Components/Shared/Form/schema.js`). El flujo de contacto es multi-paso
(`MultiStep.jsx`, `useStep`) con guardado parcial. Los endpoints públicos de
envío (`/contacto/*`, `/inmobiliaria/visits`) están **rate-limited**
(`throttle:10,1`) para prevenir spam.

### 9. Observers y Policies
Lógica de dominio desacoplada: `CitationObserver` reacciona a eventos del
modelo; `LawyerPolicy` controla autorización. Comandos artisan
(`CreateAdminUser`, `CleanLawyerData`, etc.) para tareas operativas.

### 10. SEO técnico adicional
Rutas dedicadas para `/sitemap.xml` (`SitemapController`) y `/rss`
(`RssController`), además del JSON-LD estructurado.

## Modelo de datos (entidades principales)

`User`, `Lawyer`, `Property`, `Service`, `Blog`, `Citation`, `Visit`,
`HomeBanner`, `Information` (config corporativa), `Page` (SEO por ruta),
`State` / `Municipality` (ubicaciones geográficas de Colombia).

## Rutas públicas (`routes/web.php`)

| Ruta | Descripción |
|------|-------------|
| `/` | Home (banner, abogados destacados) |
| `/acerca` | Acerca de |
| `/servicios`, `/servicios/{service}` | Servicios |
| `/inmobiliaria`, `/inmobiliaria/{property}` | Catálogo y detalle de propiedades |
| `/abogados/{slug}` | Perfil de abogado |
| `/blog`, `/blog/{blog}` | Blog |
| `/contacto` | Contacto (formulario multi-paso) |
| `/sitemap.xml`, `/rss` | SEO |
| `/admin` | Panel Filament (autenticado) |

## Cómo correr el proyecto

```bash
composer dev   # levanta server + queue + logs (pail) + vite en paralelo
npm run build  # build de producción (incluye SSR)
```

> Nota: el idioma del sitio es español (Colombia), `og:locale = es_CO`,
> y todo el copy y las rutas están en español.
