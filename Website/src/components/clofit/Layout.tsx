import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileTabBar } from "./MobileTabBar";
import { SearchOverlay } from "./SearchOverlay";
import { CartDrawer } from "./CartDrawer";
import { MobileMenu } from "./MobileMenu";

export const Layout = ({
  children,
  hideFooter = false,
}: {
  children: ReactNode;
  hideFooter?: boolean;
}) => (
  <div className="flex min-h-dvh flex-col bg-background">
    <Navbar />
    <main className="flex-1">{children}</main>
    {!hideFooter && <Footer />}
    <MobileTabBar />
    <SearchOverlay />
    <CartDrawer />
    <MobileMenu />
  </div>
);
