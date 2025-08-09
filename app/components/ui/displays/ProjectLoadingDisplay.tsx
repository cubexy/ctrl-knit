function ProjectLoadingDisplay() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center-safe gap-2">
      <span className="loading loading-ball loading-xl"></span>
      <p className="text-neutral/80">Lade Projekt</p>
    </div>
  );
}

export default ProjectLoadingDisplay;
