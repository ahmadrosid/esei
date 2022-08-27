import {LoaderFunction} from "remix";
import authenticator from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
    await authenticator.logout(request, { redirectTo: "/login" });
};
