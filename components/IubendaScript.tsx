"use client";

import Script from 'next/script';

export default function IubendaScript() {
  return (
    <>
      <Script id="iubenda-cs-config" strategy="beforeInteractive">
        {`
          var _iub = _iub || [];
          _iub.csConfiguration = {
            "askConsentAtCookiePolicyUpdate": true,
            "floatingPreferencesButtonDisplay": "bottom-right",
            "perPurposeConsent": true,
            "siteId": 0, // ATTENZIONE: Manca il Site ID nello snippet fornito. Inserire Site ID se disponibile.
            "whitelabel": false,
            "cookiePolicyId": 76185838,
            "lang": "it",
            "banner": {
              "acceptButtonDisplay": true,
              "closeButtonRejection": true,
              "customizeButtonDisplay": true,
              "explicitWithdrawal": true,
              "listPurposes": true,
              "position": "float-top-center"
            }
          };
        `}
      </Script>
      <Script
        src="https://cs.iubenda.com/autoblocking/76185838.js"
        strategy="afterInteractive"
      />
      <Script
        src="//cdn.iubenda.com/cs/iubenda_cs.js"
        strategy="afterInteractive"
        charSet="UTF-8"
        async
      />
       {/* Widget fornito come 'cookie banner' - Probabilmente è il badge legale o un widget custom */}
       <Script 
        src="https://embeds.iubenda.com/widgets/7aae494e-d631-4a68-b4d8-4ea4be6bee8c.js"
        strategy="afterInteractive"
      />
    </>
  );
}
