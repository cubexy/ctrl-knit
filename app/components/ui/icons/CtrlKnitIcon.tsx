import { Link } from "react-router";

function CtrlKnitIcon() {
  return (
    <Link
      to="/"
      className="flex flex-row items-center justify-center gap-x-0.5 transition-normal duration-200 ease-out hover:scale-105 sm:gap-x-1.5"
    >
      <kbd className="kbd shadow-base-300 transition-normal duration-150 ease-out hover:py-3 hover:shadow-lg">ctrl</kbd>
      <p> + </p>
      <kbd className="kbd shadow-base-300 transition-normal duration-150 ease-out hover:py-3 hover:shadow-lg">knit</kbd>
    </Link>
  );
}

export default CtrlKnitIcon;
