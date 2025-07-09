import { Link } from "react-router";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ctrl + knit" }, { name: "A simple row counting tool.", content: "Welcome to ctrl + knit!" }];
}

export default function NotFound() {
  return (
    <div className="flex min-h-dvh min-w-dvw items-center justify-center p-4">
      <div className="flex max-w-md flex-col items-center justify-center gap-2">
        <p className="text-8xl" style={{ fontFamily: "Le Murmure_Regular" }}>
          404
        </p>
        <p className="text-center">Wir haben überall gesucht, konnten die Seite aber nicht finden! 🥲</p>
        <Link to="/" className="text-blue-500 hover:underline">
          <button className="btn btn-primary">Zurück zur Startseite</button>
        </Link>
      </div>
    </div>
  );
}
