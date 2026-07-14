import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Providers } from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Buddy Script",
  description: "Buddy Script social media platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.className} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/common.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
        <link rel="stylesheet" href="/assets/css/responsive.css" />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Script
          src="/assets/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
         <Script
          src="assets/js/custom.js"
          strategy="afterInteractive"
        />
        
      </body>
    </html>
  );
}
