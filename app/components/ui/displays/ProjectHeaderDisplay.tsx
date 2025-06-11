import LinkIcon from "../icons/LinkIcon";

type ProjectHeaderDisplayProps = {
  name: string;
  url?: string;
};

function ProjectHeaderDisplay(props: ProjectHeaderDisplayProps) {
  return (
    <div className="card bg-base-200 from-base-200 to-base-300 shadow-neutral/30 w-full bg-gradient-to-tl shadow-xs">
      <div className="card-body items-center justify-center gap-0 px-8 py-4">
        <h2 className="card-title text-center text-4xl text-pretty font-stretch-ultra-expanded">{props.name}</h2>
        {props.url && (
          <a
            href={props.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link flex items-center gap-2 font-mono"
          >
            <LinkIcon className="size-4" strokeWidth={1} />
            {props.url}
          </a>
        )}
      </div>
    </div>
  );
}

export default ProjectHeaderDisplay;
