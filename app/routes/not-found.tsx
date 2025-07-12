import NotFoundPage from "~/pages/NotFound";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Huch! | ctrl-knit ✿" }, { name: "description", content: "A simple row counting tool." }];
}

export default function NotFound() {
  return <NotFoundPage />;
}
