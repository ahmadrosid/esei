import {
    Form,
    ActionFunction,
    json,
    LoaderFunction,
    useLoaderData,
} from "remix";
import authenticator from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";

/**
 * called when the user hits button to login
 *
 * @param param0
 * @returns
 */
export const action: ActionFunction = async ({ request, context }) => {
    // call my authenticator
    const resp = await authenticator.authenticate("form", request, {
        successRedirect: "/",
        failureRedirect: "/login",
        throwOnError: true,
        context,
    });
    console.log(resp);
    return resp;
};

/**
 * get the cookie and see if there are any errors that were
 * generated when attempting to login
 *
 * @param param0
 * @returns
 */
export const loader: LoaderFunction = async ({ request }) => {

    await authenticator.isAuthenticated(request, {
        successRedirect: "/"
    });

    const session = await sessionStorage.getSession(
        request.headers.get("Cookie")
    );

    const error = session.get("sessionErrorKey");
    return json<any>({ error });
};

/**
 *
 * @returns
 */
export default function LoginPage() {
    // if i got an error it will come back with the loader data
    const loaderData = useLoaderData();
    console.log(loaderData);
    return (
        <div>
            <h1 className="pb-4">Welcome back! Continue Sign in.</h1>
            <Form method="post">
                <div className="space-y-4 max-w-xl">
                    <input className="p-3 border rounded-md w-full" type="email" name="email" placeholder="email" required />
                    <input
                        className="p-3 border rounded-md w-full"
                        type="password"
                        name="password"
                        placeholder="password"
                        autoComplete="current-password"
                    />
                    <button className="px-16 py-2 text-white bg-slate-600 rounded-md">Sign In</button>
                </div>
            </Form>
            <div>
                {loaderData?.error ? <p>ERROR: {loaderData?.error?.message}</p> : null}
            </div>
        </div>
    );
}
