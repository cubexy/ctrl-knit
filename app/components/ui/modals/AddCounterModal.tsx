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
      <button
        type="button"
        className="btn btn-ghost text-base-content/65 min-h-12 gap-2 px-4 font-normal"
        onClick={handleShow}
      >
        <AddIcon className="size-5 stroke-current" strokeWidth={1.5} />
        Zähler hinzufügen
      </button>
      <CreateCounterPopover ref={editCounterPopoverRef} onConfirm={(counter) => props.onAddCounter(counter)} />
    </>
  );
}

export default AddCounterModal;
