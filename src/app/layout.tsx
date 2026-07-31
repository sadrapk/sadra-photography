export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "صدرا پورکلهر | استودیو و گالری عکاسی لوموس",
  description: ".وبسایت رسمی صدرا پورکلهر، عکاس حرفه‌ای. نمونه‌کارها و پروژه‌های عکاسی تبلیغاتی، غذا، تئاتر و پرتره",
  verification: {
    google: "vp6mWGLLfa9oh0EUHHwGlMf0If5bSCPTZKTR0H7PKGA",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
