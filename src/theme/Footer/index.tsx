import React, {type ReactNode} from 'react';
import Footer from '@theme-original/Footer';
import type FooterType from '@theme/Footer';
import type {WrapperProps} from '@docusaurus/types';
import {useLocation} from '@docusaurus/router';

type Props = WrapperProps<typeof FooterType>;

// 首页与产品页使用独立布局，不显示博客页脚
const HIDDEN_PATHNAME_PREFIX = '/apps';

export default function FooterWrapper(props: Props): ReactNode {
  const {pathname} = useLocation();
  if (pathname === '/' || pathname.startsWith(HIDDEN_PATHNAME_PREFIX)) {
    return null;
  }
  return <Footer {...props} />;
}
