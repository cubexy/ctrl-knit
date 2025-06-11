import { useRef } from "react";
import type { CreateCounter } from "~/models/Counter";
import SetCounterPopover from "../popover/SetCounterPopover";

type AddCounterModalProps = {
  onAddCounter: (counter: CreateCounter) => void;
};

function AddCounterModal(props: AddCounterModalProps) {
  const editCounterPopoverRef = useRef<HTMLDialogElement>(null);

  const handleShow = () => {
    editCounterPopoverRef.current?.showModal();
  };

  return (
    <>
      <div className="card card-dash border-base-300 w-full rounded-3xl">
        <div className="card-body w-full items-center p-1">
          <button
            className="btn btn-ghost flex w-full flex-row items-center justify-between rounded-full px-2"
            onClick={handleShow}
          >
            <p className="grow-0 font-normal">Zähler hinzufügen</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
      <SetCounterPopover ref={editCounterPopoverRef} onConfirm={(counter) => props.onAddCounter(counter)} />
    </>
  );
}

export default AddCounterModal;
