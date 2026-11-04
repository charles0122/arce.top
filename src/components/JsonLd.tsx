import React from 'react';
import Head from '@docusaurus/Head';

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export default function JsonLd({data}: JsonLdProps): React.JSX.Element {
  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Head>
  );
}
