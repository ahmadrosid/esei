import { Link } from "remix";

const ProjectIndex = () => {
  return (
    <div className="grid gap-2">
      <h2 className="text-3xl">Projects</h2>

      <div>
        <div className="text-sm py-2">
          You don't have any project yet.
        </div>
        <a href="/projects/new">
          <button className="bg-slate-600 rounded px-8 py-2 text-sm text-white">Create new project</button>
        </a>
      </div>
    </div>
  );
};

export default ProjectIndex;
