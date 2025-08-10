import { Link } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";
import NoProjectDesktopDisplay from "../displays/NoProjectDesktopDisplay";
import NoProjectMobileDisplay from "../displays/NoProjectMobileDisplay";
import WoolIcon from "../icons/WoolIcon";

function NoProjectModal() {
  const { getProjectList } = useDatabase();

  const projects = getProjectList();

  return (
    <>
      <span className="hidden h-full lg:block">
        <NoProjectDesktopDisplay />
      </span>
      <span className="block h-full w-full lg:hidden">
        {projects.length === 0 && <NoProjectMobileDisplay />}
        {projects.length > 0 && (
          <div className="flex h-full flex-col items-center-safe justify-center-safe">
            <WoolIcon className="fill-base-300 mb-6 size-16" strokeWidth={1} />
            <p className="max-w-full pb-2 text-center text-xl/5">Willkommen zurück!</p>
            <p className="max-w-full text-center text-xl/5 font-bold">Deine letzten Projekte</p>
            <div className="flex w-full max-w-92 flex-col items-center gap-2 px-4">
              <div className="divider mt-1 mb-0 px-3"></div>
              {projects.slice(0, 5).map((project) => (
                <Link
                  to={`/projects/${project.id}`}
                  viewTransition
                  className="bg-neutral shadow-base-300 hover:bg-neutral/90 w-full rounded-2xl p-2 px-3 transition-all duration-300 ease-in-out hover:scale-105"
                >
                  <p className="text-base-100 break-all">{project.name}</p>
                  <p className="text-base-300 text-xs">letzte Änderung: {project.updatedAt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </span>
    </>
  );
}

export default NoProjectModal;
