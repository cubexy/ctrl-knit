import { useRef } from "react";
import type { CreateCounter } from "~/models/entities/counter/CreateCounter";
import AddIcon from "../icons/AddIcon";
import CreateCounterPopover from "../popover/CreateCounterPopover";

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
            <AddIcon className="size-5 stroke-current" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <CreateCounterPopover ref={editCounterPopoverRef} onConfirm={(counter) => props.onAddCounter(counter)} />
    </>
  );
}

export default AddCounterModal;
