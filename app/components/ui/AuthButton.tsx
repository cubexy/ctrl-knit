import UserIcon from "./icons/UserIcon";

export function AuthButton() {
  return (
    <button className="btn">
      Anmelden
      <UserIcon className="size-4" strokeWidth={2} />
    </button>
  );
}
