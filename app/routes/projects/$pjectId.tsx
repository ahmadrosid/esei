import { LoaderFunction, useLoaderData } from 'remix'
import { json } from "@remix-run/node"
import { db } from "~/utils/db.server"

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

export default function Project() {
    const data = useLoaderData<LoaderData>();

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
                <div className='py-4'>
                    <div className='bg-white rounded p-3 border shadow-sm'>
                        <p className='text-sm'>Finish project one</p>
                    </div>
                    <div className='py-2'>
                        <a href="/projects/new" className='inline-flex py-2 items-center gap-2 text-slate-600'>
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
