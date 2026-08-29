# Migration Guideline — Inmobiliaria Vergara y Abogados

> **Strategy:** Full replacement of the React public frontend with Blade +
> Livewire + Alpine, built entirely on a branch and shipped in a **single
> atomic cutover**. React and Livewire are **never** live in production at the
> same time. See §0 for why this matters.

## 1. Objective

Replace the entire public frontend — every React component, on every page —
with a Laravel-native stack. Nothing built in React remains after the cutover.

**From:**

- Laravel + Inertia.js + React + React SSR
- Zustand, React Hook Form, Zod, Framer Motion

**To:**

- Laravel 12 + Blade + Livewire 3 + Alpine.js + Tailwind CSS
- Filament 3 for the admin panel (unchanged)

While preserving, unchanged:

- Server-side rendered HTML and current SEO capability (already server-rendered today — see §2).
- SPA-like navigation (`wire:navigate`).
- Dynamic/interactive UI (Livewire + Alpine).
- All Laravel business logic, Eloquent models, database, migrations, policies,
  observers, services, cache, rate limiting, permissions, artisan commands.
- All SEO database content and structured metadata.

---

## 0. Why a single cutover, not a progressive one

An SPA uses a **client-side router**: JavaScript intercepts a link click,
cancels the browser's normal full-page load, fetches over AJAX, and swaps the
content in place.

This app has **two incompatible routers**:

| World | Router | Fetches | Expects back |
|-------|--------|---------|--------------|
| React | Inertia `<Link>` | AJAX with `X-Inertia` header | a **JSON** page object |
| Target | Livewire `wire:navigate` | AJAX for the URL | a **full HTML** document |

If both are live in production at once (a progressive, page-by-page rollout),
every link that crosses the frontier between a migrated and a non-migrated page
breaks:

- **Inertia page → Livewire page:** Inertia asks for JSON, gets HTML → error / forced reload.
- **Livewire page → Inertia page:** `wire:navigate` swaps React's empty shell into `<body>` → React never boots correctly.

This is the **dual-router gap**. It exists *only* because two routers run
simultaneously. Our mitigation is structural: **build the whole site in
Livewire on a branch while React stays untouched in production, then flip
everything in one deploy and delete React.** Only one router is ever live, so
the gap cannot occur. Rollback = revert the one deploy.

---

## 2. Correcting the premise: SEO/SSR already work today

The current app **already** server-renders HTML, including SEO:

- `resources/views/app.blade.php` renders the full `<head>` (title, description,
  Open Graph, Twitter Card, canonical, geo, JSON-LD) via `App\Services\SeoManager`
  **before** React mounts.
- Inertia **SSR** (`resources/js/ssr.jsx`) server-renders the page body too.

So `curl https://domain/servicios` already returns complete HTML with metadata.
**This migration does not add SSR or improve SEO** — those work now. The real
benefit is **removing frontend complexity** (React + Inertia + Zustand + RHF +
Zod + Framer + the SSR Node process) and consolidating on one language/skillset.
Do not measure success as "better SEO"; measure it as **SEO parity** (§9) plus a
smaller, simpler stack.

---

## 3. Current vs. Target architecture

**Current (public):**

```text
Browser → Laravel Routes → Controllers → Eloquent
                                 └── Inertia::render() → app.blade.php → @inertia → React Page → DefaultLayout/SecondaryLayout
```

**Target (public):**

```text
Browser → Laravel Routes → Controllers → Eloquent / Services
                                 └── view('pages...') → Blade layout
                                          ├── Blade components (static UI)
                                          ├── Livewire components (server-backed interaction)
                                          └── Alpine.js (small client-only behavior)
Navigation: wire:navigate (SPA-like, single router)
```

`/admin` (Filament → Livewire) stays exactly as-is.

---

## 4. What is kept vs. removed

```text
KEEP (do not rewrite)              REMOVE (entirely, at cutover)
──────────────────────────         ──────────────────────────────
Laravel routes*                    Inertia (inertiajs/inertia-laravel + @inertiajs/react)
Controllers (response line only)   React + React DOM + React SSR (ssr.jsx)
Models, Eloquent queries           Zustand (useSeoStore)
Database, migrations               React Hook Form + @hookform/resolvers
Policies, Observers                Zod
Services (incl. SeoManager)        Framer Motion (motion)
Cache, Rate limiting               @inertiajs/react adapter + vite ssr config
Filament, Permissions              resources/js/** (all React: Pages, Components, Layouts, Store, hooks)
Artisan commands                   @vite entry app.jsx, ssr.jsx
SEO database content               DOMPurify (replaced by server-side sanitization — see §10)
Business rules
```

\* Routes are kept but **must gain names** first (§5, prerequisite) — several
public routes are currently unnamed.

---

## 5. Phase 0 — Branch and prerequisites

```bash
git checkout -b feature/livewire-migration
```

Do **not** work on `main`. Everything below happens on this branch; production
keeps running React until the single cutover in §13.

Install the Laravel-native stack (Livewire ships Alpine):

```bash
composer require livewire/livewire
```

### 5.1 Prerequisite — name every public route

The current `routes/web.php` leaves the index/content routes unnamed. Blade
`route()` helpers and `wire:navigate` targets need names. Add them **before**
building views (this is a safe, standalone PR that also works with React):

```php
Route::get('/',              [HomeController::class, 'index'])->name('home');
Route::get('/acerca',        [AboutController::class, 'index'])->name('about');
Route::get('/contacto',      [ContactController::class, 'index'])->name('contact');
Route::get('/servicios',     [ServiceController::class, 'index'])->name('services.index');
Route::get('/inmobiliaria',  [PropertyController::class, 'index'])->name('properties.index');
// Already named: service.show, lawyers.show, property.show, blog.index, blog.show, visits.store, contact.save-partial, contact.complete-reservation
```

> Note the existing detail route is `service.show` (singular). Either keep that
> name in Blade or rename to `services.show` in the same PR — but be consistent;
> `route('services.index')` will throw `RouteNotFoundException` if the name
> doesn't exist.

### 5.2 New Vite entry

The current entry is `resources/js/app.jsx` with an SSR entry `ssr.jsx`. Create
a new, tiny JS entry for Livewire/Alpine and repoint Vite:

```js
// resources/js/app.js  (new)
import './bootstrap';
// Livewire injects its own runtime + Alpine via @livewireScripts.
// Add only small custom Alpine components here if needed.
```

```js
// vite.config.js  (target)
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
});
```

Remove the `@vitejs/plugin-react`, the `ssr:` input, and the `ssr.noExternal`
block **as part of the cutover PR** (§13), not before — production still needs
the React build until then. On the branch you can keep both entries side by side
while developing.

---

## 6. Phase 1 — Blade foundation (built first, used by every page)

Create the shared foundation before any page:

```text
resources/views/
├── layouts/
│   ├── app.blade.php          # default layout (replaces DefaultLayout.jsx)
│   └── secondary.blade.php    # replaces SecondaryLayout.jsx
├── components/
│   ├── shared/
│   │   ├── header.blade.php          # ← Components/Shared/Header/*
│   │   ├── navigation.blade.php      # ← Header/Menu.jsx
│   │   ├── footer.blade.php          # ← Shared/Footer/Footer.jsx
│   │   ├── whatsapp-button.blade.php # ← Shared/WhatsAppFloat.jsx
│   │   ├── main-button.blade.php     # ← Shared/Buttons/MainButton.jsx
│   │   ├── banner-informative.blade.php
│   │   └── json-ld.blade.php         # ← Shared/JsonLd.jsx
│   ├── home/          # ← Components/Home/*
│   ├── services/      # ← Components/Services/*
│   └── properties/    # ← Components/Properties/*
└── pages/
```

The `layouts/app.blade.php` `<head>` **reuses the existing `SeoManager`
verbatim** — the same static calls the current `app.blade.php` already makes.
Do not invent new SeoManager methods:

```blade
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Real SeoManager API — see app/Services/SeoManager.php --}}
    <title>{{ \App\Services\SeoManager::title() }}</title>
    <meta name="description" content="{{ \App\Services\SeoManager::description() }}">
    @if(\App\Services\SeoManager::keywords())
        <meta name="keywords" content="{{ \App\Services\SeoManager::keywords() }}">
    @endif
    <meta name="robots" content="index, follow">

    {{-- Open Graph / Twitter / geo — copied 1:1 from current app.blade.php --}}
    <meta property="og:site_name" content="Inmobiliaria Vergara y Abogados">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="es_CO">
    <meta property="og:title" content="{{ \App\Services\SeoManager::title() }}">
    <meta property="og:description" content="{{ \App\Services\SeoManager::description() }}">
    <meta property="og:url" content="{{ \App\Services\SeoManager::canonical() }}">
    <meta property="og:image" content="{{ asset('logo.png') }}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="canonical" href="{{ \App\Services\SeoManager::canonical() }}">
    <meta name="geo.region" content="CO-CUN">
    <meta name="geo.placename" content="Soacha, Cundinamarca, Colombia">
    <meta name="geo.position" content="4.5790;-74.2172">

    <x-shared.json-ld />   {{-- renders SeoManager::schema() as <script type="application/ld+json"> --}}

    <link rel="icon" type="image/png" href="/logo.png">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
</head>
<body>
    <x-shared.header />
    <main>{{ $slot }}</main>
    <x-shared.footer />
    <x-shared.whatsapp-button />
    @livewireScripts
</body>
</html>
```

> The current `SeoManager` API is: `set(array)`, `setSchema($schema)`,
> `title()`, `description()`, `keywords()`, `canonical()`, `schema()`.
> Controllers keep calling `SeoManager::set($seo)` / `setSchema(...)` exactly as
> `HomeController` does today. The browser-side SEO state (`useSeoStore`,
> `useSeoManager`) is **deleted** — no longer needed, since navigation is a real
> server request that re-runs the controller and re-renders the head.

---

## 7. Phase 2 — Navigation (single router)

Replace Inertia `<Link>` with named-route anchors using `wire:navigate`:

```blade
<nav>
    <a href="{{ route('home') }}"             wire:navigate>Inicio</a>
    <a href="{{ route('about') }}"            wire:navigate>Acerca</a>
    <a href="{{ route('services.index') }}"   wire:navigate>Servicios</a>
    <a href="{{ route('properties.index') }}" wire:navigate>Inmobiliaria</a>
    <a href="{{ route('blog.index') }}"       wire:navigate>Blog</a>
    <a href="{{ route('contact') }}"          wire:navigate>Contacto</a>
</nav>
```

Because the cutover is atomic, **every** public page is Livewire-rendered at the
same time — there is no React page for a link to break against. Use
`wire:navigate.hover` selectively on high-intent links (Servicios, Inmobiliaria)
for preloading. Persist the header/nav across navigations:

```blade
@persist('main-navigation')
    <x-shared.navigation />
@endpersist
```

---

## 8. Phase 3 — Full component & page conversion (React → Livewire/Blade)

Every item under `resources/js/` is reimplemented and then deleted. Rule of
thumb: **static → Blade component; server-backed interaction → Livewire
component; small client-only behavior → Alpine.**

### 8.1 Page mapping

| Route | Current React page | Target | Interaction |
|-------|--------------------|--------|-------------|
| `/` | `Pages/Home.jsx` | `pages/home.blade.php` + Blade section components | mostly static; cached queries kept |
| `/acerca` | `Pages/About.jsx` | `pages/about.blade.php` | static |
| `/servicios` | `Pages/Services.jsx` | `pages/services/index.blade.php` | static list |
| `/servicios/{service}` | `Pages/ServiceDetail.jsx` | `pages/services/show.blade.php` | static |
| `/abogados/{slug}` | `Pages/LawyerDetail.jsx` | `pages/lawyers/show.blade.php` | static |
| `/blog` | `Pages/Blog/Index.jsx` | `pages/blog/index.blade.php` or `<livewire:blog-list>` | Livewire only if search/filter/pagination |
| `/blog/{blog}` | `Pages/Blog/Show.jsx` | `pages/blog/show.blade.php` | static + sanitized HTML (§10) |
| `/inmobiliaria` | `Pages/Properties.jsx` | `pages/properties/index.blade.php` + `<livewire:property-catalog>` | **Livewire** (filters/sort/pagination) |
| `/inmobiliaria/{property}` | `Pages/PropertyDetail.jsx` | `pages/properties/show.blade.php` + `<livewire:visit-form>` | Blade page, Livewire for the visit form |
| `/contacto` | `Pages/Contact.jsx` | `pages/contact.blade.php` + `<livewire:contact-form>` | **Livewire** multi-step |

### 8.2 Component mapping

| React component | Target |
|-----------------|--------|
| `Layouts/DefaultLayout`, `SecondaryLayout` | `layouts/app`, `layouts/secondary` (Blade) |
| `Shared/Header/*`, `Menu`, `Info` | `components/shared/header`, `navigation` (Blade + Alpine for mobile menu) |
| `Shared/Footer/Footer` | `components/shared/footer` (Blade) |
| `Shared/WhatsAppFloat` | `components/shared/whatsapp-button` (Blade) |
| `Shared/Buttons/MainButton` | `components/shared/main-button` (anonymous Blade component) |
| `Shared/BannerInformative`, `Home/MainBanner` | Blade components |
| `Home/LawyersSection`, `LawyerCard` | Blade components (data passed from controller) |
| `Services/CardService`, `ServiceLawyersSection` | Blade components |
| `Shared/JsonLd` | `components/shared/json-ld` (renders `SeoManager::schema()`) |
| `Shared/Motion/MotionWrapper` (Framer Motion) | Tailwind/CSS transitions + Alpine `x-transition`; keep JS only for genuinely complex animations (§8.5) |
| `Properties/PropertyModal` | Alpine modal (`x-data`/`x-show`) or Livewire if it loads server data |
| `Properties/VisitForm` + `@fullcalendar/*` + RHF + Zod | `<livewire:visit-form>` + calendar (§8.4) + Laravel validation |
| `Shared/Form/ContactForm`, `MultiStep`, `schema.js` | `<livewire:contact-form>` + Laravel validation (§8.3) |
| `hooks/useContactForm`, `useStep`, `useSeoManager` | Livewire component state / server logic (deleted as hooks) |
| `Store/useSeoStore` (Zustand) | **deleted** — SEO is server-rendered per request |

### 8.3 Contact form (Livewire, multi-step, keeps partial save)

The React form posts to two existing endpoints: `contact.save-partial` and
`contact.complete-reservation`, and is rate-limited `throttle:10,1`. Preserve
**both behaviors**:

```php
use Livewire\Component;
use Livewire\Attributes\Validate;

class ContactForm extends Component
{
    public int $step = 1;

    #[Validate('required|string|max:120')] public string $name = '';
    #[Validate('required|email')]          public string $email = '';
    #[Validate('required|string|max:30')]  public string $phone = '';
    // ...remaining fields

    public function next()
    {
        $this->validateStep();          // validate only current step's fields
        $this->savePartial();           // reuse existing partial-save logic/service
        $this->step++;
    }

    public function submit()
    {
        $this->validate();
        // reuse existing completeReservation service logic
    }

    public function render() { return view('livewire.contact-form'); }
}
```

- **Rate limiting:** keep it. Livewire actions bypass the HTTP `throttle`
  middleware on the old POST routes, so apply `Illuminate\Support\Facades\RateLimiter`
  inside `next()`/`submit()` (same 10/min budget) so anti-spam is not lost.
- Laravel validation rules become the **single source of truth** (Zod deleted).
- `useStep`'s state becomes the public `$step` property.

### 8.4 Visit scheduling (Livewire, replaces FullCalendar+RHF+Zod)

- Reuse the existing `visits.store` logic/validation server-side.
- For the calendar UI, prefer reusing the calendar already available in the
  stack rather than reintroducing a React lib: either an Alpine-driven date
  picker, or FullCalendar's vanilla build mounted via an Alpine `x-init` and
  wired to Livewire with `$wire`. (`saade/filament-fullcalendar` is
  Filament/admin-only; don't couple public UI to it.)
- Keep the `throttle:10,1` protection (via `RateLimiter` inside the Livewire
  action, per §8.3).

### 8.5 Animations (Framer Motion → CSS/Alpine)

- Simple reveals/fades/toggles → Tailwind transitions or Alpine `x-transition`.
- Genuinely complex sequences → a small vanilla-JS/Alpine module; do not port
  every Framer animation 1:1. Animation parity must **not** block the cutover.

---

## 9. SEO & HTML verification (parity gate)

For **every** migrated page, verify the raw server HTML — not the DOM inspector:

```bash
curl -s https://domain/servicios | grep -E "<title|description|canonical|ld\+json|<h1"
```

Each page's response must already contain `<title>`, `<meta name="description">`,
`<link rel="canonical">`, `<h1>`, body content, and the correct
`<script type="application/ld+json">`.

**Parity gate before cutover:** run a full crawl of the current (React)
production site and the branch build, then **diff per URL**: title, description,
canonical, OG tags, and JSON-LD must match (or be intentionally improved).
Treat any unintended metadata change as a release blocker. This is the guard
against a silent SEO regression on a search-dependent site.

---

## 10. Security — replacing DOMPurify (hard requirement)

Blog HTML is currently sanitized **at render time by DOMPurify inside React**.
Moving to Blade `{!! $content !!}` **removes that layer** — do not ship without
replacing it, or you introduce stored XSS.

Required:

1. Sanitize blog/rich-text HTML **on save** (Filament) and/or **before output**,
   server-side (e.g. HTMLPurifier / `mews/purifier`).
2. Audit existing rows for unsanitized content before cutover.
3. Never output untrusted HTML via `{!! !!}` without this guarantee.

Treat this as a blocking checklist item, not advice.

---

## 11. Validation strategy

Replace **Zod + React Hook Form** with **Laravel/Livewire validation** as the
single source of truth (`#[Validate]` attributes or a `rules()` method). This
removes the browser/server rule duplication that existed with Zod.

---

## 12. Shared corporate data (replacing Inertia shared props)

`HandleInertiaRequests::share()` currently injects `corporativeInfo` (cached 6h)
and `canonicalUrl` into every page. In Blade, replace with a **View Composer**
(or a `@inject`) bound to the layout so every view/component has it:

```php
// AppServiceProvider::boot()
View::composer('layouts.app', function ($view) {
    $view->with('corporativeInfo', cache()->remember(
        'corporative_info', now()->addHours(6), fn () => \App\Models\Information::latest()->first()
    ));
});
```

`canonicalUrl` is already available via `SeoManager::canonical()` / `url()->current()`.
The `HandleInertiaRequests` middleware is removed at cutover.

---

## 13. Cutover & rollback (single atomic switch)

Because React and Livewire never coexist in production, the switch is one deploy.

**Branch acceptance checklist (all must pass before cutover):**

- [ ] Every public route renders via Blade/Livewire; no route returns `Inertia::render`.
- [ ] SEO parity crawl-diff passes (§9).
- [ ] Blog HTML sanitized server-side; existing rows audited (§10).
- [ ] Contact form + visit scheduling work, incl. partial save and rate limiting.
- [ ] `wire:navigate` navigation, browser Back/Forward, mobile menu all work.
- [ ] No JS console errors; styles/responsive correct on every page.
- [ ] Existing PHPUnit suite green.
- [ ] Filament `/admin` unaffected.

**Cutover PR (single deploy):**

1. Delete `resources/js/**` React code (Pages, Components, Layouts, Store, hooks, `app.jsx`, `ssr.jsx`).
2. Remove the old `resources/views/app.blade.php` (Inertia root) and `HandleInertiaRequests` middleware registration.
3. Update `vite.config.js` (remove React plugin + SSR) and `package.json`
   (remove `@inertiajs/react`, `react`, `react-dom`, `zustand`,
   `react-hook-form`, `@hookform/resolvers`, `zod`, `motion`, `@fullcalendar/*`,
   `@vitejs/plugin-react`, `dompurify`).
4. `composer remove inertiajs/inertia-laravel`.
5. `npm run build` (Blade/Livewire assets only) and deploy.

**Rollback:** revert the single deploy (or re-point to the previous release).
Since production ran pure React until this moment, the previous release is a
known-good, fully-React site — no half-migrated state to untangle.

---

## 14. Suggested branch build order (internal, not production deploys)

Build in this order on the branch — simple/SEO-critical first, interactive last —
but **ship nothing to production until §13**:

```text
1. Route names + Vite entry (§5)          6. /blog, /blog/{blog}
2. Blade foundation + layout + SEO (§6)   7. /inmobiliaria (+ property-catalog Livewire)
3. Navigation (§7)                        8. /inmobiliaria/{property} (+ visit-form Livewire)
4. /acerca (proof of concept)             9. / (Home — many sections)
5. /servicios, /servicios/{service},     10. /contacto (contact-form Livewire)
   /abogados/{slug}                       11. Cutover PR (§13)
```

Acceptance criteria per page: correct content, title, description, canonical,
JSON-LD; `wire:navigate` works; Back/Forward work; mobile nav works; no JS
errors; styles and responsiveness intact.
