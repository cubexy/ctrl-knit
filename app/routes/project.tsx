import { useParams } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";
import NoProjectPage from "~/pages/NoProjectPage";
import ProjectPage from "~/pages/ProjectPage";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [{ name: "description", content: "A simple row counting tool." }];
}

export default function Project() {
  const { id } = useParams();
  const { getProjectById } = useDatabase();
  const title = id ? (getProjectById(id)?.name ?? "Lade Projekt...") : "Kein Projekt";

  return (
    <>
      <title>{title + " | ctrl-knit ✿"}</title>
      {id ? <ProjectPage id={id} /> : <NoProjectPage />}
    </>
  );
}
