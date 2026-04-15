/**
 * No-op — kept for backward compatibility so page components don't need changes.
 *
 * SEO meta tags are now rendered synchronously in DefaultLayout / SecondaryLayout
 * by reading `usePage().props.seo` directly. This works correctly with Inertia SSR
 * (server-rendered HTML) AND client-side navigation.
 *
 * The old Zustand approach used useEffect which only ran client-side, meaning
 * Google saw an empty <title> on first page load.
 */
// eslint-disable-next-line no-unused-vars
export const useSeoManager = (_seo) => {}
