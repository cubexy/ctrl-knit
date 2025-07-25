import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className="flex min-h-dvh min-w-dvw items-center justify-center p-4">
      <div className="flex max-w-md flex-col items-center justify-center gap-2">
        <p className="text-8xl" style={{ fontFamily: "Le Murmure_Regular" }}>
          404
        </p>
        <p className="text-center">Wir haben überall gesucht, konnten die Seite aber nicht finden! 🥲</p>
        <Link to="/" className="text-base-300 hover:underline" viewTransition>
          <button className="btn btn-primary">Zurück zur Startseite</button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
