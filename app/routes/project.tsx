import { useParams } from "react-router";
import NoProjectPage from "~/pages/NoProjectPage";
import ProjectPage from "~/pages/ProjectPage";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Projekt | ctrl-knit ✿" }, { name: "description", content: "A simple row counting tool." }];
}

export default function Project() {
  let { id } = useParams();

  if (!id) {
    return <NoProjectPage />;
  }

  return <ProjectPage id={id} />;
}
