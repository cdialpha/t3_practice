import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/route/app.router";
// import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
// import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { url } from "../constants";
import { trpc } from "../utils/trpc";
import { UserContextProvider } from "../context/user.context";
function MyApp({ Component, pageProps }: AppProps) {
  const { data, error, isLoading } = trpc.useQuery(["users.me"]);
  if (isLoading) {
    return <div>Loading user...</div>;
  }
  return (
    <UserContextProvider value={data}>
      <main>
        <Component {...pageProps} />
      </main>
    </UserContextProvider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const links = [
      loggerLink(),
      httpBatchLink({
        maxBatchSize: 10,
        url,
      }),
    ];

    return {
      queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
      headers() {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            "x-ssr": "1",
          };
        }
        return {};
      },
      links,
      transformer: superjson,
    };
  },
  ssr: false,
})(MyApp);
