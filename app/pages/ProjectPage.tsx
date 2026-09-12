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
import CategoryDropZone from "~/components/ui/CategoryDropZone";
import CategoryManager from "~/components/ui/CategoryManager";
import CounterOrganizer from "~/components/ui/CounterOrganizer";
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
    createCategory,
    updateCategory,
    reorderCategories,
    deleteCategory,
    moveCountersToCategory,
    updateProject,
    deleteProject,
    reorderCounters,
    startTimer,
    stopTimer
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

    if (!over || !project) return;

    const activeCounter = project.counters.find((counter) => counter.id === active.id);
    const overCounter = project.counters.find((counter) => counter.id === over.id);
    if (!activeCounter) return;

    const targetCategoryId = over.data.current?.categoryId as string | undefined;
    if (targetCategoryId && !project.categories.some((category) => category.id === targetCategoryId)) return;
    if (active.id === over.id && activeCounter.categoryId === targetCategoryId) return;

    const categoryKeys = [...project.categories.map((category) => category.id), "uncategorized"];
    const countersByCategory = new Map<string, CounterPresentation[]>();
    categoryKeys.forEach((key) => countersByCategory.set(key, []));
    project.counters.forEach((counter) => {
      const categoryKey =
        counter.categoryId && countersByCategory.has(counter.categoryId) ? counter.categoryId : "uncategorized";
      countersByCategory.get(categoryKey)?.push(counter);
    });

    const sourceCategoryKey = activeCounter.categoryId ?? "uncategorized";
    const sourceCounters = countersByCategory.get(sourceCategoryKey) ?? [];
    countersByCategory.set(
      sourceCategoryKey,
      sourceCounters.filter((counter) => counter.id !== activeCounter.id)
    );

    const targetCategoryKey = targetCategoryId ?? "uncategorized";
    const targetCounters = countersByCategory.get(targetCategoryKey) ?? [];
    const targetIndex = overCounter
      ? targetCounters.findIndex((counter) => counter.id === overCounter.id)
      : targetCounters.length;
    const movedCounter = targetCategoryId
      ? { ...activeCounter, categoryId: targetCategoryId }
      : (() => {
          const { categoryId: _, ...counterWithoutCategory } = activeCounter;
          return counterWithoutCategory;
        })();
    targetCounters.splice(targetIndex === -1 ? targetCounters.length : targetIndex, 0, movedCounter);
    countersByCategory.set(targetCategoryKey, targetCounters);

    const reorderedCounters = categoryKeys.flatMap((key) => countersByCategory.get(key) ?? []);
    const orderedIds = reorderedCounters.map((counter) => counter.id);

    // Optimistic update
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        counters: reorderedCounters.map((counter, index) => ({ ...counter, order: index }))
      };
    });

    reorderCounters(props.id, orderedIds, { counterId: activeCounter.id, categoryId: targetCategoryId });
  };

  if (loading) {
    return <ProjectLoadingDisplay />;
  } else {
    // weird structure needed because ts flags project in last return as "could be nullable".
    if (!project) {
      return <span className="text-error">Das Projekt konnte nicht gefunden werden!</span>;
    }
  }

  const countersByCategory = project.counters.reduce((groups, counter) => {
    const categoryId = counter.categoryId ?? "uncategorized";
    groups.set(categoryId, [...(groups.get(categoryId) ?? []), counter]);
    return groups;
  }, new Map<string, CounterPresentation[]>());
  const counterGroups = [
    ...project.categories.map((category) => ({
      categoryId: category.id,
      name: category.name,
      counters: countersByCategory.get(category.id) ?? []
    })),
    ...(countersByCategory.has("uncategorized") && countersByCategory.get("uncategorized")!.length > 0
      ? [
          {
            categoryId: undefined,
            name: "Ohne Kategorie",
            counters: countersByCategory.get("uncategorized") ?? []
          }
        ]
      : activeCounter?.categoryId
        ? [{ categoryId: undefined, name: "Ohne Kategorie", counters: [] }]
        : [])
  ];
  const uncategorizedCounters = countersByCategory.get("uncategorized") ?? [];
  const counterCounts = Object.fromEntries(
    project.categories.map((category) => [category.id, countersByCategory.get(category.id)?.length ?? 0])
  );

  return (
    <>
      <ProjectHeaderDisplay
        project={{
          name: project.name,
          group: project.group,
          url: project.url,
          trackedTime: project.trackedTime,
          timeSpanStart: project.timeSpanStart
        }}
        onConfirmEdit={(project: CreateProject) => updateProject(props.id, project)}
        onDelete={() => deleteProject(props.id)}
        onStartTimer={() => startTimer(props.id)}
        onStopTimer={() => stopTimer(props.id)}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex w-full max-w-5xl flex-col gap-4">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <AddCounterModal
              categories={project.categories}
              onAddCounter={(counter: CreateCounter) => createCounter(props.id, counter)}
              onCreateCategory={(name) => createCategory(props.id, name)}
            />
          </div>
          <SortableContext items={project.counters.map((counter) => counter.id)} strategy={rectSortingStrategy}>
            {counterGroups.map((group) => (
              <CategoryDropZone
                key={group.categoryId ?? "uncategorized"}
                categoryId={group.categoryId}
                name={group.name}
                count={group.counters.length}
                onRename={group.categoryId ? (name) => updateCategory(props.id, group.categoryId!, name) : undefined}
                addAction={
                  group.categoryId ? (
                    <AddCounterModal
                      categories={project.categories}
                      initialCategoryId={group.categoryId}
                      categoryName={group.name}
                      compact
                      onAddCounter={(counter: CreateCounter) => createCounter(props.id, counter)}
                      onCreateCategory={(name) => createCategory(props.id, name)}
                    />
                  ) : uncategorizedCounters.length > 0 ? (
                    <CounterOrganizer
                      counters={uncategorizedCounters}
                      categories={project.categories}
                      onMove={(counterIds, categoryId) => moveCountersToCategory(props.id, counterIds, categoryId)}
                      onCreateCategory={(name) => createCategory(props.id, name)}
                    />
                  ) : undefined
                }
              >
                {group.counters.map((counter) => (
                  <SortableCounterItem key={counter.id} id={counter.id} categoryId={counter.categoryId}>
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
                        categories={project.categories}
                        onCreateCategory={(name) => createCategory(props.id, name)}
                      />
                    )}
                  </SortableCounterItem>
                ))}
              </CategoryDropZone>
            ))}
          </SortableContext>
          <CategoryManager
            categories={project.categories}
            counterCounts={counterCounts}
            onCreate={(name) => createCategory(props.id, name)}
            onUpdate={(categoryId, name) => updateCategory(props.id, categoryId, name)}
            onReorder={(orderedIds) => reorderCategories(props.id, orderedIds)}
            onDelete={(categoryId, targetCategoryId) => deleteCategory(props.id, categoryId, targetCategoryId)}
          />
        </div>
        <DragOverlay>
          {activeCounter ? (
            <div className="rotate-2 opacity-90">
              <CounterDisplay
                id={activeCounter.id}
                name={activeCounter.name}
                categoryId={activeCounter.categoryId}
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
