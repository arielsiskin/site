import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Standard SEO */}
        <meta
          name="description"
          content="Mayday Global es sinónimo de agilidad en los procesos, personalización en la atención y excelencia en el servicio post venta. Somos más que una plataforma, somos el motor que impulsa a los contact centers al siguiente nivel."
        />
        <meta
          name="keywords"
          content="contact center, atención al cliente, plataforma omnicanal, soluciones IT, Mayday Global"
        />
        <meta name="author" content="Mayday Global" />

        {/* Open Graph / Social Media Metadata */}
        <meta property="og:title" content="Mayday Global" />
        <meta
          property="og:description"
          content="Mayday Global es sinónimo de agilidad en los procesos, personalización en la atención y excelencia en el servicio post venta. Somos más que una plataforma, somos el motor que impulsa a los contact centers al siguiente nivel."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mayday.global" />
        <meta
          property="og:image"
          content="https://mayday.global/assets/og-image.jpg"
        />
        <meta property="og:site_name" content="Mayday Global" />

        {/* Twitter Card data */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mayday Global" />
        <meta
          name="twitter:description"
          content="Mayday Global es sinónimo de agilidad en los procesos, personalización en la atención y excelencia en el servicio post venta. Somos más que una plataforma, somos el motor que impulsa a los contact centers al siguiente nivel."
        />
        <meta
          name="twitter:image"
          content="https://mayday.global/assets/og-image.jpg"
        />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-B9175NWQJS"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-B9175NWQJS');
            `,
          }}
        />
        {/* End Google Analytics */}

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KXJFG95B');`,
          }}
        />
        {/* End Google Tag Manager */}
      </Head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KXJFG95B"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Main />
        <NextScript />
        
        {/* Botmaker Webchat */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                let js = document.createElement('script');
                js.type = 'text/javascript';
                js.async = 1;
                js.src = 'https://go.botmaker.com/rest/webchat/p/KZGAU0Z40F/init.js';
                document.body.appendChild(js);
              })();
            `,
          }}
        />
        {/* END Botmaker Webchat */}
      </body>
    </Html>
  );
}
