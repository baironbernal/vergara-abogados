import { Head } from '@inertiajs/react'

/**
 * Injects a JSON-LD <script> block into the document <head>.
 * Works both on SSR (server-rendered HTML) and client-side navigation.
 *
 * Usage:
 *   <JsonLd data={{ '@context': 'https://schema.org', '@type': 'LegalService', ... }} />
 */
export function JsonLd({ data }) {
  if (!data) return null

  return (
    <Head>
      <script
        key="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  )
}
