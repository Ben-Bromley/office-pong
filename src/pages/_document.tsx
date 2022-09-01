import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
export default function Document() {
  return (
    <Html>
      <Head>
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `let ffWidgetId = '4bda36e1-3c1f-489a-bd02-23f505f6543b';
            let ffWidgetScript = document.createElement('script');
            ffWidgetScript.type = 'text/javascript';
            ffWidgetScript.src = 'https://freddyfeedback.com/widget/freddyfeedback.js';
            document.head.appendChild(ffWidgetScript);`,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}