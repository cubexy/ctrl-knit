import GithubIcon from "~/components/ui/icons/GithubIconFilled";

function SidebarFooter() {
  return (
    <div className="flex flex-row items-center justify-between">
      <a
        href="https://github.com/cubexy/ctrl-knit"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-row items-center gap-1.5"
      >
        <GithubIcon className="fill-neutral-content/50 size-5" />
        <p className="text-neutral-content/40 text-sm hover:underline">{APP_VERSION}</p>
      </a>
      <p className="text text-neutral-content/40 text-sm">{"made with ♡!"}</p>
    </div>
  );
}

export default SidebarFooter;
