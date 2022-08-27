import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { sessionStorage, User } from '~/services/session.server';

// Create an instance of the authenticator, pass a Type, User,  with what
// strategies will return and will store in the session
const authenticator = new Authenticator<User | Error | null>(sessionStorage, {
    sessionKey: "sessionKey", // keep in sync
    sessionErrorKey: "sessionErrorKey", // keep in sync
});

authenticator.use(
    new FormStrategy(async ({ form }) => {

        // get the data from the form...
        let email = form.get('email') as string;
        let password = form.get('password') as string;

        // initialize the user here
        let user = null;

        // do some validation, errors are in the sessionErrorKey
        if (!email || email?.length === 0) throw new AuthorizationError('Bad Credentials: Email is required')
        if (typeof email !== 'string')
            throw new AuthorizationError('Bad Credentials: Email must be a string')

        if (!password || password?.length === 0) throw new AuthorizationError('Bad Credentials: Password is required')
        if (typeof password !== 'string')
            throw new AuthorizationError('Bad Credentials: Password must be a string')

        // login the user, this could be whatever process you want
        if (email === 'user@gmail.com' && password === 'secret') {
            let token = () => (Math.random() + 1).toString(36).slice(2);

            user = {
                name: email,
                token: `${token()}${token()}${token()}`,
                user_id: '120'
            };

            // the type of this user must match the type you pass to the Authenticator
            // the strategy will automatically inherit the type if you instantiate
            // directly inside the `use` method
            return await Promise.resolve({ ...user });

        } else {
            // if problem with user throw error AuthorizationError
            throw new AuthorizationError("Bad Credentials")
        }

    }),
);

export default authenticator
