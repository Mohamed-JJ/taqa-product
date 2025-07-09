import { Menu, Bell, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useCommonTranslations, useNavigationTranslations } from "@/i18n/hooks/useTranslations";

import TaqaLogo from "@/assets/taqa-logo.svg";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const commonT = useCommonTranslations();
  const navT = useNavigationTranslations();

  return (
    <header className="sticky !bg-[#003D55] top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5 text-white" />
          </Button>

          
        </div>

        <div className="flex items-center gap-2 lg:gap-4">

          <LanguageSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="[&:hover>svg]:text-[#003D55]">
                <User className="h-5 w-5 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Ahmed Benali</DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Senior Maintenance Engineer
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{navT.profile}</DropdownMenuItem>
              <DropdownMenuItem>{navT.settings}</DropdownMenuItem>
              <DropdownMenuItem>{navT.help}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{navT.logout}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
