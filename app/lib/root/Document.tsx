import { Links, LiveReload, Meta, Scripts, ScrollRestoration } from "remix";

import Layout from "~/lib/layout";

type DocumentProps = {
  children: React.ReactNode;
  title?: string;
};

const Document = ({ children, title }: DocumentProps) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-50">
        <Layout>{children}</Layout>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
};

export default Document;
