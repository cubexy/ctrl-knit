import LoginPage from "~/pages/LoginPage";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Sync | ctrl-knit ✿" }, { name: "description", content: "A simple row counting tool." }];
}

export default function Login() {
  return <LoginPage />;
}
