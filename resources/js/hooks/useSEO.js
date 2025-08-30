import { usePage } from '@inertiajs/react';

export function useSEO() {
    const { props } = usePage();
    
    return {
        seo: props.seo || null,
        title: props.seo?.title || 'Inmobiliaria & Abogados Vergara',
        description: props.seo?.meta?.find(m => m.name === 'description')?.content || 'Inmobiliaria Vergara ofrece servicios integrales de bienes raíces y asesoría legal especializada.',
        keywords: props.seo?.meta?.find(m => m.name === 'keywords')?.content || 'inmobiliaria, bienes raíces, propiedades, derecho inmobiliario',
        image: props.seo?.meta?.find(m => m.property === 'og:image')?.content || '/images/shared/background-title.webp',
        url: props.seo?.canonical || window.location.href,
    };
}

export default useSEO;