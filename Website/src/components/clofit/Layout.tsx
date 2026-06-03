import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileTabBar } from "./MobileTabBar";

export const Layout = ({
  children,
  hideFooter = false,
}: {
  children: ReactNode;
  hideFooter?: boolean;
}) => (
  <div className="flex min-h-screen flex-col bg-background">
    <Navbar />
    <main className="flex-1">{children}</main>
    {!hideFooter && <Footer />}
    <MobileTabBar />
  </div>
);
