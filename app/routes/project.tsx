import ProjectPage from "~/pages/ProjectPage";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Projekt | ctrl-knit ✿" }, { name: "description", content: "A simple row counting tool." }];
}

export default function Project() {
  return <ProjectPage />;
}
