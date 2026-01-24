import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronDown,
  Search,
  Bell,
  Building2,
  Calculator,
  FileCheck,
  ClipboardList,
  BarChart3,
  Settings,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  icon: typeof Calendar;
  href: string;
  description: string;
}

const products: Product[] = [
  {
    id: "scheduler",
    name: "Scheduler",
    icon: Calculator,
    href: "/",
    description: "Schedule Studio for cost allocation",
  },
  {
    id: "reconciliations",
    name: "Reconciliations",
    icon: FileCheck,
    href: "/reconciliations",
    description: "Account reconciliation workflows",
  },
  {
    id: "policies",
    name: "Policies",
    icon: ClipboardList,
    href: "/policies",
    description: "Policy documentation & approvals",
  },
  {
    id: "walkthroughs",
    name: "Walkthroughs",
    icon: ClipboardList,
    href: "/walkthroughs",
    description: "Process walkthroughs & testing",
  },
  {
    id: "reports",
    name: "Reports",
    icon: BarChart3,
    href: "/reports",
    description: "Financial reports & analytics",
  },
  {
    id: "admin",
    name: "Admin",
    icon: Settings,
    href: "/admin",
    description: "System administration",
  },
];

function getActiveProduct(location: string): Product {
  if (location.startsWith("/reconciliations")) return products[1];
  if (location.startsWith("/policies")) return products[2];
  if (location.startsWith("/walkthroughs")) return products[3];
  if (location.startsWith("/reports")) return products[4];
  if (location.startsWith("/admin")) return products[5];
  return products[0];
}

export function TopNav() {
  const [location] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const activeProduct = getActiveProduct(location);

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-card" data-testid="top-nav">
      <div className="flex items-center gap-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="logo">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="font-semibold text-sm hidden sm:inline">Lunari</span>
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2" data-testid="product-switcher">
              <activeProduct.icon className="h-4 w-4" />
              <span>{activeProduct.name}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {products.map((product) => (
              <DropdownMenuItem key={product.id} asChild>
                <Link href={product.href}>
                  <div className="flex items-center gap-3 w-full" data-testid={`product-${product.id}`}>
                    <product.icon className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-xs text-muted-foreground">{product.description}</span>
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <nav className="hidden lg:flex items-center gap-1">
          {products.slice(1, 5).map((product) => (
            <Link key={product.id} href={product.href}>
              <Button
                variant={activeProduct.id === product.id ? "secondary" : "ghost"}
                size="sm"
                className="text-sm"
                data-testid={`nav-${product.id}`}
              >
                {product.name}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {searchOpen ? (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-48 pl-8 h-9"
              autoFocus
              onBlur={() => setSearchOpen(false)}
              data-testid="search-input"
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            data-testid="button-search"
          >
            <Search className="h-4 w-4" />
          </Button>
        )}

        <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2" data-testid="workspace-switcher">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Acme Corp</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Acme Corp</DropdownMenuItem>
            <DropdownMenuItem>Demo Company</DropdownMenuItem>
            <DropdownMenuItem>Switch Workspace...</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Avatar className="h-8 w-8 cursor-pointer" data-testid="user-avatar">
          <AvatarFallback className="text-xs">JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
