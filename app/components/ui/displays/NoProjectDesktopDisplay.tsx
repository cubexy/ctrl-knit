import CurlyArrowLargeIcon from "../icons/CurlyArrowIconLarge";

function NoProjectDesktopDisplay() {
  return (
    <div className="hero h-full">
      <div className="hero-content text-center">
        <div className="flex max-w-md flex-col items-center">
          <CurlyArrowLargeIcon className="fill-base-300 w-48 pb-4 transition-all duration-300 ease-in-out hover:scale-110" />
          <p className="text-base-content/70 pt-1 pb-2 text-sm">
            Du hast gerade kein Projekt geöffnet. Öffne oder erstelle eins in der Seitenleiste :)
          </p>
        </div>
      </div>
    </div>
  );
}

export default NoProjectDesktopDisplay;
