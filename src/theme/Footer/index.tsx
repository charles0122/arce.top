import React, {type ReactNode} from 'react';
import Footer from '@theme-original/Footer';
import type FooterType from '@theme/Footer';
import type {WrapperProps} from '@docusaurus/types';
import {useLocation} from '@docusaurus/router';

type Props = WrapperProps<typeof FooterType>;

// 产品页（/apps）使用独立的落地页布局，不显示博客页脚
const HIDDEN_PATHNAME_PREFIX = '/apps';

export default function FooterWrapper(props: Props): ReactNode {
  const {pathname} = useLocation();
  if (pathname.startsWith(HIDDEN_PATHNAME_PREFIX)) {
    return null;
  }
  return <Footer {...props} />;
}
