import { Command } from "cmdk";
import { Search, Settings, Moon, Sun, LayoutDashboard, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export function CommandPalette({
  open,
  onClose,
  onSettings,
}: {
  open: boolean;
  onClose: () => void;
  onSettings: () => void;
}) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  if (!open) return null;

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const isDark = root.classList.contains("dark");
    if (isDark) {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("leadcore-theme", "light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      localStorage.setItem("leadcore-theme", "dark");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 pt-32 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <Command 
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-popover shadow-2xl animate-in zoom-in-95" 
        onClick={(e) => e.stopPropagation()}
        shouldFilter={true}
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Command.Input
            autoFocus
            value={q}
            onValueChange={setQ}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground border-none focus:ring-0"
          />
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ESC</kbd>
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="p-6 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          <Command.Group heading="Navigation" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground">
            <Command.Item
              onSelect={() => {
                navigate({ to: "/dashboard" });
                onClose();
              }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
            >
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              Dashboard
            </Command.Item>
            <Command.Item
              onSelect={() => {
                navigate({ to: "/leads" });
                onClose();
              }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
            >
              <Target className="h-4 w-4 text-muted-foreground" />
              Leads
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Settings" className="mt-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground">
            <Command.Item
              onSelect={() => {
                onClose();
                onSettings();
              }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              AI Settings
            </Command.Item>
            <Command.Item
              onSelect={toggleTheme}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
            >
              <Sun className="h-4 w-4 text-muted-foreground dark:hidden" />
              <Moon className="h-4 w-4 text-muted-foreground hidden dark:block" />
              Toggle Theme
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
