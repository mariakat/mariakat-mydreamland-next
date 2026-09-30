import type { Metadata } from "next";
// Self-hosted fonts (Greek + Latin); the browser downloads only the subsets a page uses.
import "@fontsource/alegreya/400.css";
import "@fontsource/alegreya/400-italic.css";
import "@fontsource/alegreya/700.css";
import "@fontsource/alegreya-sans/400.css";
import "@fontsource/alegreya-sans/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Dreamland Blog",
  description: "ό,τι ονειρευόμαστε, είμαστε",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="el" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
