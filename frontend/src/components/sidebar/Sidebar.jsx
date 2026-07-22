import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Boxes,
  FolderKanban,
  ListTodo,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import useAuth from "@/hooks/useAuth";

const navigationItems = [
  {
    label: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    label: "My Tasks",
    path: "/my-tasks",
    icon: ListTodo,
  },
];

const Sidebar = ({ isOpen = false, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-black/40
            md:hidden
          "
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          border-r border-border
          bg-surface
          transition-transform duration-200

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          md:static
          md:z-auto
          md:min-h-screen
          md:translate-x-0
          md:transition-[width]
          ${collapsed ? "md:w-20" : "md:w-[260px]"}

          w-[260px]
        `}
      >
        <div
          className="
            flex h-16 items-center
            border-b border-border
            px-4
          "
        >
          <div
            className={`
              flex min-w-0 flex-1 items-center gap-3
              ${collapsed ? "md:justify-center" : ""}
            `}
          >
            <div
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-button
                bg-primary
                text-white
              "
            >
              <Boxes className="h-5 w-5" />
            </div>

            <span
              className={`
                truncate text-lg font-semibold text-text
                ${collapsed ? "md:hidden" : ""}
              `}
            >
              SynSphere
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-button
              text-text-muted
              transition-colors duration-200
              hover:bg-surface-secondary
              hover:text-text
              focus:outline-none
              focus:ring-4 focus:ring-primary/10
              md:hidden
            "
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>

          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="
                hidden h-9 w-9 shrink-0
                items-center justify-center
                rounded-button
                text-text-muted
                transition-colors duration-200
                hover:bg-surface-secondary
                hover:text-text
                focus:outline-none
                focus:ring-4 focus:ring-primary/10
                md:flex
              "
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          )}
        </div>

        {collapsed && (
          <div
            className="
              hidden justify-center
              border-b border-border
              py-2
              md:flex
            "
          >
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-button
                text-text-muted
                transition-colors duration-200
                hover:bg-surface-secondary
                hover:text-text
                focus:outline-none
                focus:ring-4 focus:ring-primary/10
              "
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </button>
          </div>
        )}

        <nav className="flex-1 space-y-1 p-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) => `
                  flex h-11 items-center
                  rounded-button
                  text-sm font-medium
                  transition-colors duration-200

                  ${
                    collapsed
                      ? "md:justify-center md:px-3"
                      : "gap-3 px-3"
                  }

                  ${
                    isActive
                      ? "bg-primary-light text-primary"
                      : "text-text-secondary hover:bg-surface-secondary hover:text-text"
                  }
                `}
              >
                <Icon className="h-5 w-5 shrink-0" />

                <span className={collapsed ? "md:hidden" : ""}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <div
            className={`
              flex items-center
              rounded-button
              ${
                collapsed
                  ? "md:justify-center"
                  : "gap-3 px-2 py-2"
              }
            `}
          >
            <Avatar
              name={user?.name || user?.email}
              imageUrl={user?.profileImage}
              size="sm"
            />

            <div
              className={`
                min-w-0
                ${collapsed ? "md:hidden" : ""}
              `}
            >
              <p className="truncate text-sm font-medium text-text">
                {user?.name || user?.email}
              </p>

              <p className="truncate text-xs text-text-muted">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={`
              mt-1 flex h-11 w-full items-center
              rounded-button
              text-sm font-medium text-text-secondary
              transition-colors duration-200
              hover:bg-surface-secondary
              hover:text-text

              ${
                collapsed
                  ? "md:justify-center md:px-3"
                  : "gap-3 px-3"
              }
            `}
          >
            <LogOut className="h-5 w-5 shrink-0" />

            <span className={collapsed ? "md:hidden" : ""}>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;