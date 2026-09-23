import GithubIcon from "~/components/ui/icons/GithubIconFilled";

function SidebarFooter() {
  return (
    <div>
      <a
        href="https://github.com/cubexy/ctrl-knit"
        target="_blank"
        rel="noopener noreferrer"
        className="text-base-content/60 hover:text-base-content flex min-h-11 items-center gap-2 rounded-lg px-2 text-xs transition-colors"
        aria-label={`ctrl+knit ${APP_VERSION} auf GitHub (neuer Tab)`}
      >
        <GithubIcon className="size-4 fill-current" />
        <span>{APP_VERSION}</span>
      </a>
    </div>
  );
}

export default SidebarFooter;
