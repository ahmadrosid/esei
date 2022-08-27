import { Form, LoaderFunction, ActionFunction, useLoaderData } from 'remix'
import { json } from "@remix-run/node"
import { db } from "~/utils/db.server"
import { useState } from 'react'
import { redirect } from "@remix-run/node";

interface Project {
    id: string
    name: string
    description: string
    createdAt: Date
    updatedAt: Date
}

type LoaderData = { project: Project };

export const loader: LoaderFunction = async ({
    params,
}) => {
    const project = await db.project.findFirst({
        where: { id: params.projectId },
    });
    if (!project) throw new Error("Project not found");
    const data: LoaderData = { project };
    return json(data);
};


export const action: ActionFunction = async ({ request, context }) => {
    const form = await request.formData();
    const name = form.get("name");
    const projectId = form.get("project_id");
    const userId = form.get("user_id");
    if (
        typeof name !== "string" ||
        typeof projectId !== "string" ||
        typeof userId !== "string"
    ) {
        throw new Error(`Form not submitted correctly.`);
    }

    const project = await db.project.create({ data: {
        name,
        projectId,
        createdBy: userId
    } });
    return redirect(`/projects/${projectId}`);
};

export default function Project() {
    const data = useLoaderData<LoaderData>();
    const [showInput, setShowInput] = useState(false)

    return (
        <div className='space-y-6'>
            <div className=''>
                <h2 className='text-2xl text-slate-700'>{data.project.name}</h2>
                <span className='text-sm text-slate-600'>
                    {data.project.description}
                </span>
            </div>
            <div>
                <h2 className='text-xl text-slate-700'>Task's</h2>
                <div className='py-4 space-y-4'>
                    <div className='bg-white rounded p-3 border shadow-sm'>
                        <p className='text-sm'>Finish project one</p>
                    </div>
                    {showInput && (
                        <div className='bg-white rounded border shadow-sm'>
                            <Form method="post">
                                <input autoFocus={true} className='text-sm w-full p-3 outline-none rounded' placeholder='Task name...' />
                            </Form>
                        </div>
                    )}
                    <div className='py-2'>
                        <a onClick={() => setShowInput(true)} className='inline-flex py-2 items-center gap-2 text-slate-600'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                            </svg>
                            <span className="text-sm">Add task</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
