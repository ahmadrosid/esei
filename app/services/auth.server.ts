import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage, login } from "~/services/session.server";
import { User } from "~/utils/models.server";

const authenticator = new Authenticator<User>(sessionStorage, {
    sessionKey: "sessionKey", // keep in sync
    sessionErrorKey: "sessionErrorKey", // keep in sync
});

authenticator.use(
    new FormStrategy(async ({ form }) => {

        // get the data from the form...
        let username = form.get('email') as string;
        let password = form.get('password') as string;

        // initialize the user here
        let user = null;

        // do some validation, errors are in the sessionErrorKey
        if (!username || username?.length === 0) throw new AuthorizationError('Bad Credentials: Email is required')
        if (typeof username !== 'string')
            throw new AuthorizationError('Bad Credentials: Email must be a string')

        if (!password || password?.length === 0) throw new AuthorizationError('Bad Credentials: Password is required')
        if (typeof password !== 'string')
            throw new AuthorizationError('Bad Credentials: Password must be a string')

        const res = await login({ username, password })
        if (res === null) {
            throw new AuthorizationError("Bad Credentials")
        }

        let token = () => (Math.random() + 1).toString(36).slice(2);
        user = {
            email: res.email,
            username: res.username,
            token: `${token()}${token()}${token()}`,
            user_id: res?.id as string
        };

        return await Promise.resolve({ ...user });
    }),
);

export default authenticator
