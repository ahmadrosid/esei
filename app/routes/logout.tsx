import type { LoaderFunction } from "remix";

import authenticator from "~/services/auth.server";

const loader: LoaderFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};

export default loader;
