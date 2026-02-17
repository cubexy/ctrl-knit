import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import CounterDisplay from "~/components/ui/displays/CounterDisplay";
import ProjectHeaderDisplay from "~/components/ui/displays/ProjectHeaderDisplay";
import ProjectLoadingDisplay from "~/components/ui/displays/ProjectLoadingDisplay";
import AddCounterModal from "~/components/ui/modals/AddCounterModal";
import SortableCounterItem from "~/components/ui/SortableCounterItem";
import { useDatabase } from "~/contexts/DatabaseContext";
import type { CounterPresentation } from "~/models/entities/counter/CounterPresentation";
import type { CreateCounter } from "~/models/entities/counter/CreateCounter";
import type { EditCounter } from "~/models/entities/counter/EditCounter";
import type { CreateProject } from "~/models/entities/project/CreateProject";
import type { ProjectPresentation } from "~/models/entities/project/ProjectPresentation";

type ProjectPageProps = {
  id: string;
};

function ProjectPage(props: ProjectPageProps) {
  const {
    getProjectById,
    incrementCounter,
    updateCounter,
    createCounter,
    deleteCounter,
    updateProject,
    deleteProject,
    reorderCounters
  } = useDatabase();

  const [project, setProject] = useState<ProjectPresentation | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);
  const [loading, setLoading] = useState(true);
  const [activeCounter, setActiveCounter] = useState<CounterPresentation | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const firstIncrementableId =
    project?.lastUpdatedCounter ??
    project?.counters.find((counter) => {
      const hasTarget = counter.count.target !== null && counter.count.target !== undefined;
      if (!hasTarget) return true;
      const isBelowCountTarget = counter.count.current < counter.count.target!;
      if (counter.stepOver) {
        const isBelowStepOverTarget = counter.stepOver.current < counter.stepOver.target;
        return isBelowStepOverTarget || isBelowCountTarget;
      }
      return isBelowCountTarget;
    })?.id;

  useEffect(() => {
    if (firstIncrementableId && targetRef.current && !hasScrolled.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      hasScrolled.current = true;
    }
  }, [firstIncrementableId]);

  useEffect(() => {
    setProject((_) => getProjectById(props.id));
    setLoading(false);
    return () => {
      setLoading(true);
    };
  }, [setProject, setLoading, getProjectById, props.id]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const counter = project?.counters.find((c) => c.id === active.id);
    setActiveCounter(counter ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCounter(null);

    if (!over || active.id === over.id || !project) return;

    const counters = [...project.counters];
    const oldIndex = counters.findIndex((c) => c.id === active.id);
    const newIndex = counters.findIndex((c) => c.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const [moved] = counters.splice(oldIndex, 1);
    counters.splice(newIndex, 0, moved);

    const orderedIds = counters.map((c) => c.id);

    // Optimistic update
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        counters: counters.map((c, i) => ({ ...c, order: i }))
      };
    });

    reorderCounters(props.id, orderedIds);
  };

  if (loading) {
    return <ProjectLoadingDisplay />;
  } else {
    // weird structure needed because ts flags project in last return as "could be nullable".
    if (!project) {
      return <span className="text-error">Das Projekt konnte nicht gefunden werden!</span>;
    }
  }

  return (
    <>
      <ProjectHeaderDisplay
        project={{ name: project.name, url: project.url, trackedTime: project.trackedTime }}
        onConfirmEdit={(project: CreateProject) => updateProject(props.id, project)}
        onDelete={() => deleteProject(props.id)}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={project.counters.map((c) => c.id)} strategy={rectSortingStrategy}>
          <div className="grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
            <AddCounterModal onAddCounter={(counter: CreateCounter) => createCounter(props.id, counter)} />
            {project.counters.map((counter) => (
              <SortableCounterItem key={counter.id} id={counter.id}>
                {(dragHandleProps) => (
                  <CounterDisplay
                    ref={counter.id === firstIncrementableId ? targetRef : undefined}
                    id={counter.id}
                    name={counter.name}
                    order={counter.order}
                    count={counter.count}
                    stepOver={counter.stepOver}
                    onIncrement={() => incrementCounter(props.id, counter.id, 1)}
                    onDecrement={() => incrementCounter(props.id, counter.id, -1)}
                    onEdit={(update: EditCounter) => updateCounter(props.id, counter.id, update)}
                    onDelete={() => deleteCounter(props.id, counter.id)}
                    createdAt={counter.createdAt}
                    editedAt={counter.editedAt}
                    dragHandleProps={dragHandleProps}
                  />
                )}
              </SortableCounterItem>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeCounter ? (
            <div className="rotate-2 opacity-90">
              <CounterDisplay
                id={activeCounter.id}
                name={activeCounter.name}
                order={activeCounter.order}
                count={activeCounter.count}
                stepOver={activeCounter.stepOver}
                onIncrement={() => {}}
                onDecrement={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
                createdAt={activeCounter.createdAt}
                editedAt={activeCounter.editedAt}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}

export default ProjectPage;
