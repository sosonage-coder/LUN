import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";

export type ProductId = "schedule-studio" | "oneclose" | "close-tasks" | "reconciliations" | "onecompliance" | "policies" | "walkthroughs" | "reports" | "admin";

interface ProductContextType {
  activeProduct: ProductId;
  setActiveProduct: (product: ProductId) => void;
}

const ProductContext = createContext<ProductContextType | null>(null);

function getProductFromRoute(path: string): ProductId {
  if (path.startsWith("/close-tasks")) {
    return "close-tasks";
  }
  if (path.startsWith("/close-control") || path === "/my-tasks" || path.startsWith("/close-control")) {
    return "oneclose";
  }
  if (path.startsWith("/reconciliations")) return "reconciliations";
  if (path.startsWith("/compliance") || path.startsWith("/one-compliance")) return "onecompliance";
  if (path.startsWith("/policies")) return "policies";
  if (path.startsWith("/walkthroughs")) return "walkthroughs";
  if (path.startsWith("/reports")) return "reports";
  if (path.startsWith("/admin")) return "admin";
  return "schedule-studio";
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [activeProduct, setActiveProduct] = useState<ProductId>(() => getProductFromRoute(location));

  useEffect(() => {
    setActiveProduct(getProductFromRoute(location));
  }, [location]);

  return (
    <ProductContext.Provider value={{ activeProduct, setActiveProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}
