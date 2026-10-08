import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArcReady — HOA approval packet demo",
  description: "A rules-grounded architectural review preparation workflow."
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
