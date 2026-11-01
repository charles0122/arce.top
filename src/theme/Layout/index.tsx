import type {ReactNode} from 'react';
import {HtmlClassNameProvider} from '@docusaurus/theme-common';
import {useLocation} from '@docusaurus/router';
import Layout from '@theme-original/Layout';
import type LayoutType from '@theme/Layout';
import type {WrapperProps} from '@docusaurus/types';

export default function LayoutWrapper(props: WrapperProps<typeof LayoutType>): ReactNode {
  const {pathname} = useLocation();
  if (!/^\/(blog|project)(\/|$)/.test(pathname)) return <Layout {...props} />;
  return (
    <HtmlClassNameProvider className="reading-site">
      <Layout {...props} />
    </HtmlClassNameProvider>
  );
}
