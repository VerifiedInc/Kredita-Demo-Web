import {
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { useContext, useEffect } from 'react';
import { withEmotionCache } from '@emotion/react';
import {
  CssBaseline,
  ThemeProvider,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from '@mui/material';
import { BrandDto } from '@verifiedinc/core-types';

import { config } from './config';
import { initLogRocket } from './logrocket';
import ClientStyleContext from './context/ClientStyleContext';
import { theme } from './styles/theme';
import { getErrorMessage } from './errors';
import Layout from './Layout';
import { BrowserConfig } from './config.client';
import { AppContextProvider } from './context/AppContext';
import { getBrandApiKey, getBrandDto } from './coreAPI.server';
import { Brand, getBrand } from './utils/getBrand';
import { createBrandSession, getBrandSession } from './session.server';

// add browser env to window
declare global {
  interface Window {
    ENV: BrowserConfig;
    sentryDSN: string;
  }
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => [
  // manifest
  {
    rel: 'manifest',
    href: '/manifest.json',
  },
  // google fonts
  {
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com',
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@100;300;400;700;900&display=swap',
  },
];

export const loader: LoaderFunction = async ({ context, request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  let brand = getBrand(null);
  let apiKey = config.verifiedApiKey;

  // Allow custom branding under environment flag.
  if (config.customBrandingEnabled) {
    // Get brand from session, or query params.
    const brandSession = await getBrandSession(request);
    brand = brandSession.data?.brand ? brandSession.data.brand : getBrand(null);
    apiKey = brandSession.data.apiKey ? brandSession.data.apiKey : apiKey;
    const brandUuid = searchParams.get('brand');

    // Override possibly brand in session if query param is set.
    if (brandUuid) {
      apiKey = await getBrandApiKey(brandUuid, config.coreServiceAdminAuthKey);

      brand = getBrand(
        brandUuid
          ? ((await getBrandDto(
              brandUuid,
              config.coreServiceAdminAuthKey
            )) as BrandDto)
          : null
      );
    }
  }

  const { cspNonce } = context;
  const {
    logRocketId,
    logRocketProjectName,
    ENV,
    sentryDSN,
    COMMIT_SHA,
    oneClickEnabled,
  } = config;

  return json(
    {
      cspNonce,
      // pass config/env vars we want to be available in the browser
      // ref: https://remix.run/docs/en/v1/guides/envvars#browser-environment-variables
      env: {
        logRocketId,
        logRocketProjectName,
        ENV,
        sentryDSN,
        release: COMMIT_SHA,
        oneClickEnabled,
      },
      brand,
    },
    {
      headers: {
        'Set-Cookie': await createBrandSession(request, brand, apiKey),
      },
    }
  );
};

interface DocumentProps {
  children: React.ReactNode;
  cspNonce: string;
  env: BrowserConfig;
  brand: Brand;
}

// set up Emotion for mui styles
// ref: https://github.com/mui/material-ui/blob/master/examples/remix-with-typescript/app/root.tsx
const Document = withEmotionCache(
  ({ children, cspNonce, env, brand }: DocumentProps, emotionCache) => {
    const clientStyleData = useContext(ClientStyleContext);

    // only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const { tags } = emotionCache.sheet;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (emotionCache.sheet as any)._insertTag(tag);
      });

      // reset cache to reapply global styles
      clientStyleData.reset();
    }, []);

    return (
      <html lang='en'>
        <head>
          <meta name='theme-color' content={brand.theme.main} />
          <title>{brand.name + ' Demo'}</title>
          <link
            rel='icon'
            href={`/favicon?brand=${brand.uuid}`}
            type='image/x=icon'
          />
          <Meta />
          <Links />
        </head>
        <body>
          <AppContextProvider config={env}>
            <ThemeProvider theme={theme(brand.theme)}>
              <CssBaseline>
                <Layout>{children}</Layout>
              </CssBaseline>
            </ThemeProvider>
          </AppContextProvider>
          {/*
            set browser env on window
            ref: https://remix.run/docs/en/v1/guides/envvars#browser-environment-variables
          */}
          <script
            nonce={cspNonce}
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(env)}`,
            }}
          />
          {/* add the nonce to our scripts */}
          <ScrollRestoration nonce={cspNonce} />
          <Scripts nonce={cspNonce} />
          <LiveReload nonce={cspNonce} />
        </body>
      </html>
    );
  }
);

/**
 * A rudimentary error boundary that logs the error to the console and renders a simple error page.
 * You'll probably want to replace this with something more robust and user-friendly.
 */
export function ErrorBoundary({ error }: { error: unknown }) {
  console.error(error);

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Error</h1>
        <p>{getErrorMessage(error)}</p>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  let { cspNonce, env, brand } = useLoaderData<typeof loader>();

  // fixes an issue with the nonce being reapplied on client hydration, and every time the loader is called
  // ref: https://github.com/remix-run/remix/issues/183
  if (typeof document !== 'undefined') {
    cspNonce = '';
  }

  // initialize LogRocket
  useEffect(() => {
    initLogRocket();
  }, []);

  return (
    <Document cspNonce={cspNonce} env={env} brand={brand}>
      <Outlet />
    </Document>
  );
}
