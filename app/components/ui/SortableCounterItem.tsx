import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

export type CounterDragHandleProps = {
  listeners: ReturnType<typeof useSortable>["listeners"];
  attributes: ReturnType<typeof useSortable>["attributes"];
  ref: ReturnType<typeof useSortable>["setActivatorNodeRef"];
};

type SortableCounterItemProps = {
  id: string;
  children: (dragHandleProps: CounterDragHandleProps) => ReactNode;
};

function SortableCounterItem({ id, children }: SortableCounterItemProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : ("auto" as const)
  };

  return (
    <div ref={setNodeRef} style={style} className="min-w-0">
      {children({ listeners, attributes, ref: setActivatorNodeRef })}
    </div>
  );
}

export default SortableCounterItem;
