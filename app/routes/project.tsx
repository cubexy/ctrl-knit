import ProjectPage from "~/pages/ProjectPage";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ctrl + knit" }, { name: "A simple row counting tool.", content: "Welcome to ctrl + knit!" }];
}

export default function Project() {
  return <ProjectPage />;
}
