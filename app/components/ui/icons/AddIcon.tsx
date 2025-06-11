type AddIconProps = {
  className?: string;
  strokeWidth: number;
};

function AddIcon(props: AddIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={props.className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={props.strokeWidth} d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

export default AddIcon;
