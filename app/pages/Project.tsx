import NoProjectModal from "~/components/ui/modals/NoProjectModal";

function ProjectPage() {
  const data = {
    id: "1",
    name: "Sophie Scarf",
    url: "https://www.google.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    counters: [
      {
        id: "1",
        name: "Zähler 1",
        value: 7,
        stepover: 5,
      },
      {
        id: "2",
        name: "Zähler 2",
        value: 2,
        stepover: null,
      },
    ],
  };

  return (
    <>
      <NoProjectModal />
    </>
  );
}

export default ProjectPage;
