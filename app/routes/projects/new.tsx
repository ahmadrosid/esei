import { redirect } from "@remix-run/node";
import type { MetaFunction, ActionFunction } from "remix";
import { Form } from "remix";

import { db } from "~/utils/db.server";

export const meta: MetaFunction = () => {
  return {
    title: "Esei - Plan your work easier!",
    description: "Project management made easy",
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name");
  const description = form.get("description");
  if (typeof name !== "string" || typeof description !== "string") {
    throw new Error(`Form not submitted correctly.`);
  }

  const fields = { name, description };

  await db.project.create({ data: fields });
  return redirect(`/`);
};

const New = () => {
  return (
    <>
      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dashed border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm leading-5">
          <span className="px-4 text-gray-500 bg-slate-50 text-lg">
            Create new Project
          </span>
        </div>
      </div>
      <div className="py-8">
        <Form method="post" className="space-y-4 text-gray-700">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm">
              Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="The next cool things"
              className="p-2 w-full border rounded-md text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Your project descriptions"
              className="p-2 w-full border rounded-md text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full text-center bg-slate-600 text-white py-2 rounded-md text-sm"
            >
              Create
            </button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default New;
