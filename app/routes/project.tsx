import { useParams } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";
import NoProjectPage from "~/pages/NoProjectPage";
import ProjectPage from "~/pages/ProjectPage";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  let { id } = useParams();

  const { getProjectById } = useDatabase();

  if (!id) {
    return [{ title: "Kein Projekt | ctrl-knit ✿" }, { name: "description", content: "A simple row counting tool." }];
  }

  return [
    { title: (getProjectById(id)?.name ?? "Lade Projekt...") + " | ctrl-knit ✿" },
    { name: "description", content: "A simple row counting tool." }
  ];
}

export default function Project() {
  let { id } = useParams();

  if (!id) {
    return <NoProjectPage />;
  }

  return <ProjectPage id={id} />;
}
