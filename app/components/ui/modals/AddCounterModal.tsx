import { useRef } from "react";
import type { CounterCategory } from "~/models/entities/counter/CounterCategory";
import type { CreateCounter } from "~/models/entities/counter/CreateCounter";
import AddIcon from "../icons/AddIcon";
import CreateCounterPopover from "../popover/CreateCounterPopover";

type AddCounterModalProps = {
  onAddCounter: (counter: CreateCounter) => void;
  categories: CounterCategory[];
  onCreateCategory: (name: string) => Promise<CounterCategory | undefined>;
  initialCategoryId?: string;
  categoryName?: string;
  compact?: boolean;
};

function AddCounterModal(props: AddCounterModalProps) {
  const editCounterPopoverRef = useRef<HTMLDialogElement>(null);

  const handleShow = () => {
    editCounterPopoverRef.current?.showModal();
  };

  return (
    <>
      {props.compact ? (
        <button
          className="btn btn-sm btn-ghost btn-circle"
          aria-label={`Zähler zu ${props.categoryName ?? "Ohne Kategorie"} hinzufügen`}
          onClick={handleShow}
        >
          <AddIcon className="size-5 stroke-current" strokeWidth={1.5} />
        </button>
      ) : (
        <div className="card card-dash border-base-300 w-full rounded-3xl">
          <div className="card-body w-full items-center p-2">
            <button
              className="btn btn-ghost flex w-full flex-row items-center justify-between rounded-full px-0.5"
              onClick={handleShow}
            >
              <p className="grow-0 font-normal">Zähler hinzufügen</p>
              <AddIcon className="size-5 stroke-current" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
      <CreateCounterPopover
        ref={editCounterPopoverRef}
        onConfirm={(counter) => props.onAddCounter(counter)}
        categories={props.categories}
        initialCategoryId={props.initialCategoryId}
        onCreateCategory={props.onCreateCategory}
      />
    </>
  );
}

export default AddCounterModal;
