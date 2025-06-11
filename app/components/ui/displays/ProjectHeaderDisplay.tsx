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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
              />
            </svg>

            {props.url}
          </a>
        )}
      </div>
    </div>
  );
}

export default ProjectHeaderDisplay;
