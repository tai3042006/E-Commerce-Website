import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const cols = [
  { title: "Shop", links: [["Hoodies", "/shop/hoodies"], ["Tees", "/shop/tees"], ["Shoes", "/shop/shoes"], ["Accessories", "/shop/accessories"]] },
  { title: "Collections", links: [["All products", "/shop"], ["Men", "/shop/men"], ["Women", "/shop/women"]] },
  { title: "Account", links: [["My orders", "/account"], ["Shipping addresses", "/account/addresses"], ["Wishlist", "/wishlist"], ["Cart", "/cart"]] },
];

export const Footer = () => (
  <footer className="mt-24 border-t border-border bg-background pb-24 md:pb-0">
    <div className="container-clofit py-14 lg:py-20">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="text-2xl" />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            CloFit — where fashion meets motion, and confidence becomes your style.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-sm font-semibold text-foreground">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map(([label, path]) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} CloFit. All rights reserved.</p>
        <p>Move with confidence.</p>
      </div>
    </div>
  </footer>
);
