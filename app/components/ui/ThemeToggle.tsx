import { useEffect, useState } from "react";
import { LocalStorageController } from "~/hooks/api/LocalStorageController";
import MoonIcon from "./icons/MoonIcon";
import SunIcon from "./icons/SunIcon";

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return LocalStorageController.getTheme("mylight");
  });

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "mydark" ? "mylight" : "mydark"));
  };

  // listen for theme changes and apply them to the HTML tag and localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    LocalStorageController.setTheme(theme);
  }, [theme]);

  return (
    <label className="swap swap-rotate w-fit">
      {/* this hidden checkbox controls the state */}
      <input type="checkbox" onChange={toggleTheme} checked={theme === "mydark"} />
      <SunIcon className="swap-off size-5 fill-current" strokeWidth={2} />
      <MoonIcon className="swap-on size-5 fill-current" strokeWidth={2} />
    </label>
  );
}
