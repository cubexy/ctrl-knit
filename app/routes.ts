import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
  layout("components/layout/RootLayout.tsx", [
    index("routes/home.tsx"),
    { path: "/projects/:id", file: "routes/project.tsx" }
  ])
] satisfies RouteConfig;
