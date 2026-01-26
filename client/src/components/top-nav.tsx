import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronDown,
  Search,
  Bell,
  Building2,
  Calculator,
  Shield,
  FileCheck,
  FileText,
  ClipboardList,
  BarChart3,
  Settings,
  Check,
  Globe,
  ListChecks,
  LogOut,
  User,
} from "lucide-react";
import { useProduct, ProductId } from "@/contexts/product-context";
import { useAuth } from "@/hooks/use-auth";

interface Product {
  id: ProductId;
  name: string;
  icon: typeof Calendar;
  href: string;
  description: string;
  available: boolean;
}

const products: Product[] = [
  {
    id: "schedule-studio",
    name: "Schedule Studio",
    icon: Calculator,
    href: "/",
    description: "Cost allocation & amortization",
    available: true,
  },
  {
    id: "oneclose",
    name: "OneClose",
    icon: Shield,
    href: "/close-control",
    description: "Period-end close management",
    available: true,
  },
  {
    id: "close-tasks",
    name: "Close Tasks",
    icon: ListChecks,
    href: "/close-tasks",
    description: "Task & control management",
    available: true,
  },
  {
    id: "reconciliations",
    name: "Reconciliations",
    icon: FileCheck,
    href: "/reconciliations",
    description: "Account reconciliation workflows",
    available: true,
  },
  {
    id: "onecompliance",
    name: "One Compliance",
    icon: Globe,
    href: "/compliance",
    description: "Entity governance & compliance",
    available: true,
  },
  {
    id: "nettool",
    name: "NetTool",
    icon: FileText,
    href: "/nettool",
    description: "Financial statement disclosures",
    available: true,
  },
  {
    id: "policies",
    name: "Policies",
    icon: ClipboardList,
    href: "/policies",
    description: "Policy documentation & approvals",
    available: false,
  },
  {
    id: "walkthroughs",
    name: "Walkthroughs",
    icon: ClipboardList,
    href: "/walkthroughs",
    description: "Process walkthroughs & testing",
    available: false,
  },
  {
    id: "reports",
    name: "Reports",
    icon: BarChart3,
    href: "/reports",
    description: "Financial reports & analytics",
    available: false,
  },
  {
    id: "admin",
    name: "Admin",
    icon: Settings,
    href: "/admin",
    description: "System administration",
    available: false,
  },
];

export function TopNav() {
  const [location, setLocation] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const { activeProduct, setActiveProduct } = useProduct();
  const { user, logout } = useAuth();
  
  const currentProduct = products.find(p => p.id === activeProduct) || products[0];
  
  const userInitials = user 
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U'
    : 'U';
  const userName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User'
    : 'User';

  const handleProductSelect = (product: Product) => {
    setActiveProduct(product.id);
    setLocation(product.href);
  };

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
            <Button variant="outline" className="gap-2" data-testid="product-switcher">
              <currentProduct.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{currentProduct.name}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Active Products
            </div>
            {products.filter(p => p.available).map((product) => (
              <DropdownMenuItem 
                key={product.id} 
                onClick={() => handleProductSelect(product)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-3 w-full" data-testid={`product-${product.id}`}>
                  <product.icon className="h-4 w-4" />
                  <div className="flex flex-col flex-1">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-xs text-muted-foreground">{product.description}</span>
                  </div>
                  {activeProduct === product.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Coming Soon
            </div>
            {products.filter(p => !p.available).map((product) => (
              <DropdownMenuItem 
                key={product.id} 
                onClick={() => handleProductSelect(product)}
                className="cursor-pointer opacity-60"
              >
                <div className="flex items-center gap-3 w-full" data-testid={`product-${product.id}`}>
                  <product.icon className="h-4 w-4" />
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.name}</span>
                      <Badge variant="secondary" className="text-[10px] px-1 py-0">Soon</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{product.description}</span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2" data-testid="user-menu">
              <Avatar className="h-8 w-8">
                {user?.profileImageUrl && (
                  <AvatarImage src={user.profileImageUrl} alt={userName} />
                )}
                <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm">{userName}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{userName}</p>
              {user?.email && (
                <p className="text-xs text-muted-foreground">{user.email}</p>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" data-testid="menu-profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" data-testid="menu-settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive" 
              onClick={() => logout()}
              data-testid="menu-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
