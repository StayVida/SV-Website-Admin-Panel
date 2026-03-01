import { LayoutDashboard, Calendar, Hotel, Users, ClipboardCheck, LogOut, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "../hooks/use-auth";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Bookings", url: "/bookings", icon: Calendar },
  { title: "Pending Hotels", url: "/pending-hotels", icon: ClipboardCheck },
  { title: "Hotels", url: "/hotels", icon: Hotel },
  { title: "Users", url: "/users", icon: Users },
  { title: "Attributes", url: "/attributes", icon: ClipboardCheck },
  { title: "Withdraw Requests", url: "/withdraw-requests", icon: Wallet },
  // { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { logout } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/60 px-4 py-6">
        <div className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-105">
            <Hotel className="h-5 w-5" />
          </div>
          {open && (
            <div className="flex flex-col">
              <p className="text-lg font-bold tracking-tight text-sidebar-foreground">Stayvida</p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Admin Panel</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 transition-all duration-300 relative group overflow-hidden rounded-lg px-3 py-2 ${isActive
                          ? "bg-primary text-primary-foreground font-medium shadow-md"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground hover:scale-[1.01]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-white/80 rounded-r-md shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                          )}
                          <div className={`flex items-center justify-center rounded-md p-1.5 transition-all duration-300 ${isActive
                              ? "bg-primary-foreground/20 text-primary-foreground shadow-sm"
                              : "bg-sidebar-accent text-sidebar-foreground group-hover:bg-primary/10 group-hover:text-primary"
                            }`}>
                            <item.icon className={`h-4 w-4 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110 group-hover:rotate-3"}`} />
                          </div>
                          <span className="truncate">{item.title}</span>
                          {isActive && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary-foreground/80 animate-pulse" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/60 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive w-full flex items-center gap-3 transition-all duration-300 rounded-lg group px-3 py-2"
            >
              <div className="flex items-center justify-center rounded-md p-1.5 transition-colors duration-300 bg-sidebar-accent text-sidebar-foreground group-hover:bg-destructive/20 group-hover:text-destructive">
                <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </div>
              <span className="font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
