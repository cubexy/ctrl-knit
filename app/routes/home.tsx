import HomePage from "~/pages/HomePage";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Start | ctrl-knit! ✿" }, { name: "description", content: "A simple row counting tool." }];
}

export default function Home() {
  return <HomePage />;
}
