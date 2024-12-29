// package
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
// lib
import { cn } from "@/lib/utils";
// css
import "./globals.css";
import AppContextProvider from "@/hooks/AppContext";
import AuthProvider from "@/hooks/AuthContext";
import { Providers } from "./global/provider";
import Script from "next/script";
import Image from "next/image";


export const metadata: Metadata = {
  title: "Sj Smartz - Electronics Store",
  description:
    "Sj Smartz is an Electronics Gadgets Selling Store, Like Headphones, Earbuds, Airpods, Smart Watches, Wireless Chargers & Smart Gadgets having variety of products in Electronics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
             !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '570584532401428');
              fbq('track', 'PageView');
              `,
        }}
      ></script>

      <noscript><Image height="1" width="1" className="hidden"
        src="https://www.facebook.com/tr?id=570584532401428&ev=PageView&noscript=1"
        alt="" /></noscript>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-E01FL4EJBC" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
                window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-E01FL4EJBC');
              `,
        }}
      ></script>
      {/* eslint-disable-next-line @next/next/next-script-for-ga */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NKRCM6KZ');
              `,
        }}
      ></script>
      <body className="relative">
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NKRCM6KZ"
          height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>
        <Providers>
          <AppContextProvider>
            <AuthProvider>
              {children}
              <Toaster position="bottom-right" />
            </AuthProvider>
          </AppContextProvider>
        </Providers>
      </body>
    </html>
  );
}
