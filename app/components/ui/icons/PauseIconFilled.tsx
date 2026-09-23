import type { FilledIconProps } from "~/components/models/FilledIconProps";

function PauseIconFilled(props: FilledIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 16 16" className={props.className}>
      <rect x="4" y="3" width="3" height="10" rx="1" />
      <rect x="9" y="3" width="3" height="10" rx="1" />
    </svg>
  );
}

export default PauseIconFilled;
