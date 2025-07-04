import { useState } from "react";
import KeyIcon from "./icons/KeyIcon";
import UserIcon from "./icons/UserIcon";

export function AuthButton() {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className="dropdown dropdown-end">
      <button className="btn" onClick={() => setPopoverOpen(!popoverOpen)}>
        Anmelden
        <UserIcon className="size-4" strokeWidth={2} />
      </button>
      <div className="menu dropdown-content bg-base-200 rounded-box shadow-neutral/15 z-1 mt-4 w-69 gap-2 p-4 shadow-sm">
        <p className="text-xs">Melde dich an, um deine Projekte auf mehreren Geräten zu nutzen!</p>
        <label className="input">
          <UserIcon className="h-[1.5em] opacity-50" strokeWidth={2} />
          <input type="text" required placeholder="Benutzername" />
        </label>
        <label className="input">
          <KeyIcon className="h-[1.5em] opacity-50" strokeWidth={2} />
          <input type="password" required placeholder="Passwort" />
        </label>
        <button className="btn btn-primary">Anmelden!</button>
      </div>
    </div>
  );
}
