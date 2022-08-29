import { json, redirect } from "@remix-run/node";
import { useState } from "react";
import type { LoaderFunction, ActionFunction, MetaFunction } from "remix";
import { Form, useLoaderData } from "remix";

import authenticator from "~/services/auth.server";
import { db } from "~/utils/db.server";
import type { User, Project } from "~/utils/models.server";

type LoaderData = {
  project: Project;
  projectId: string | undefined;
  user: User;
};

export const meta: MetaFunction = ({ data }) => {
  return {
    title: data.project.name,
    description: data.project.description,
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { projectId } = params;
  const project = await db.project.findFirst({
    where: { id: projectId },
    include: {
      tasks: true,
    },
  });

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  if (!project) throw new Error("Project not found");
  const data: LoaderData = {
    project: project as unknown as Project,
    projectId,
    user,
  };
  return json(data);
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name");
  const projectId = form.get("project_id");
  const userId = form.get("user_id");
  const status = form.get("status") as string;
  if (
    typeof name !== "string" ||
    typeof projectId !== "string" ||
    typeof userId !== "string"
  ) {
    throw new Error("Form not submitted correctly.");
  }

  await db.task.create({
    data: {
      name,
      projectId,
      status,
      createdBy: userId,
      assigneeId: userId,
    },
  });
  return redirect(`/projects/${projectId}`);
};

export default function ProjectDetail() {
  const data = useLoaderData<LoaderData>();
  const [showInput, setShowInput] = useState(false);

  return (
    <div className="space-y-6">
      <div className="">
        <h2 className="text-2xl text-slate-700">{data.project.name}</h2>
        <span className="text-sm text-slate-600">
          {data.project.description}
        </span>
      </div>
      <div>
        <h2 className="text-xl text-slate-700">Tasks</h2>
        <div className="py-4 space-y-2">
          <div className="bg-white rounded border shadow-sm">
            {data.project.tasks.map((item) => (
              <div key={item.id} className="border-b flex items-center justify-between">
                <div className="flex gap-2 items-center p-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-sm" />
                  <p className="text-base">{item.name}</p>
                </div>
                <div className="flex items-center gap-x-1">
                  <div className="px-2">
                    <span className="text-xs px-2 py-1 border rounded border-slate-600 bg-slate-500 text-white ">
                      {item.status}
                    </span>
                  </div>
                  <div className="p-4 hover:bg-slate-200 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </div>
                  <div className="cursor-pointer hover:bg-slate-200 p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {showInput && (
            <div className="">
              <Form method="post">
                <input
                  autoFocus={true}
                  role={"form"}
                  name="name"
                  className="text-sm bg-slate-50 w-full p-3 outline-none rounded"
                  placeholder="Task name..."
                />
                <input type="hidden" name="project_id" value={data.projectId} />
                <input type="hidden" name="user_id" value={data.user.user_id} />
                <input type="hidden" name="status" value="Not Started" />
              </Form>
            </div>
          )}
          <div className="px-2">
            <a
              onClick={() => setShowInput(true)}
              className="inline-flex py-2 items-center gap-2 text-slate-500 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 5v14m7-7H5"
                />
              </svg>
              <span className="text-sm pr-6 hover:text-slate-700">
                Add task
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
