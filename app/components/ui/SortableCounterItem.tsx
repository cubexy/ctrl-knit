import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

type SortableCounterItemProps = {
  id: string;
  categoryId?: string;
  children: (dragHandleProps: {
    listeners: ReturnType<typeof useSortable>["listeners"];
    attributes: ReturnType<typeof useSortable>["attributes"];
  }) => ReactNode;
};

function SortableCounterItem({ id, categoryId, children }: SortableCounterItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: { type: "counter", categoryId }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : ("auto" as const)
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ listeners, attributes })}
    </div>
  );
}

export default SortableCounterItem;
