import { Bell, Menu } from "lucide-react";

const Navbar = ({ onMenuClick }) => {
  return (
    <header
      className="
        flex h-16 items-center justify-between
        border-b border-border
        bg-surface
        px-4 sm:px-6 lg:px-8
      "
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="
          flex h-10 w-10
          items-center justify-center
          rounded-button
          text-text-secondary
          transition-colors duration-200
          hover:bg-surface-secondary
          hover:text-text
          focus:outline-none
          focus:ring-4 focus:ring-primary/10
          md:hidden
        "
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="ml-auto">
        <button
          type="button"
          className="
            relative
            flex h-10 w-10
            items-center justify-center
            rounded-button
            text-text-secondary
            transition-colors duration-200
            hover:bg-surface-secondary
            hover:text-text
            focus:outline-none
            focus:ring-4 focus:ring-primary/10
          "
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;  