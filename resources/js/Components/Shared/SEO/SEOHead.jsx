import { Head } from '@inertiajs/react';

export default function SEOHead({ seo }) {
    if (!seo) {
        return (
            <Head>
                <title>Inmobiliaria & Abogados Vergara</title>
                <meta name="description" content="Inmobiliaria Vergara ofrece servicios integrales de bienes raíces y asesoría legal especializada. Propiedades en venta, alquiler y servicios jurídicos inmobiliarios en Colombia." />
            </Head>
        );
    }

    return (
        <Head>
            <title>{seo.title}</title>
            {seo.canonical && <link rel="canonical" href={seo.canonical} />}
            {seo.meta && seo.meta.map((meta, index) => {
                if (meta.name) {
                    return <meta key={index} name={meta.name} content={meta.content} />;
                } else if (meta.property) {
                    return <meta key={index} property={meta.property} content={meta.content} />;
                }
                return null;
            })}
            {seo.structured_data && (
                <script 
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(seo.structured_data)
                    }}
                />
            )}
        </Head>
    );
}