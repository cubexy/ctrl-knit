import LoginPage from "~/pages/LoginPage";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ctrl + knit" }, { name: "A simple row counting tool.", content: "Welcome to ctrl + knit!" }];
}

export default function Login() {
  return <LoginPage />;
}
