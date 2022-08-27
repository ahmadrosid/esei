import { json, MetaFunction, redirect } from "remix";
import { ActionFunction, LoaderFunction, useLoaderData } from "remix";
import authenticator from "~/services/auth.server";
import { db } from "~/utils/db.server";
import { User } from '~/services/session.server';

type LoaderData = {
  user: User | Error;
  projects: Array<{ id: string; name: string, description: string, createdAt: Date }>;
};

export let loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const projects = await db.project.findMany({
    take: 15,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, description: true, createdAt: true },
  });

  if (!user) return redirect("/login");

  const data: LoaderData = {
    projects,
    user
  }

  return json(data);
};

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};

export const meta: MetaFunction = () => {
  return {
    title: "Esei - Plan your work easier!",
    description: "Project management made easy",
  };
};

const Index = () => {
  const data = useLoaderData<LoaderData>();
  return (
    <>
      <div className="grid gap-2">
        <div className="py-4 space-y-2">
          <h2 className="text-3xl">Projects</h2>
          <p>Welcome back {data.user.name}</p>
        </div>
        {data.projects.length == 0 ? (
          <div>
            <div className="text-sm py-2">
              You don't have any project yet.
            </div>
            <a href="/projects/new">
              <button className="bg-slate-600 rounded px-8 py-2 text-sm text-white">Create new project</button>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {data.projects.map(item => (
              <div key={item.id} className="border bg-white rounded-md p-6">
                <a href={`/projects/${item.id}`}>
                  <h2 className="text-xl text-slate-800">{item.name}</h2>
                  <p className="text-slate-600 text-sm">{item.description}</p>
                  <p className="text-slate-500 text-xs pt-2">{item.createdAt}</p>
                </a>
              </div>
            ))}
            <div className="border border-dashed rounded-md p-6 flex items-center justify-center">
              <div className="text-slate-600">
                <a href="/projects/new">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                  </svg>
                  <button className="text-slate-600 text-sm">Add project</button>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default Index;
