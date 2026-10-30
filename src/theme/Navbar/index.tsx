import React, {type ReactNode} from 'react';
import Navbar from '@theme-original/Navbar';
import type NavbarType from '@theme/Navbar';
import type {WrapperProps} from '@docusaurus/types';
import {useLocation} from '@docusaurus/router';

type Props = WrapperProps<typeof NavbarType>;

// 产品页（/apps）使用独立的落地页布局，不显示博客导航栏
const HIDDEN_PATHNAME_PREFIX = '/apps';

export default function NavbarWrapper(props: Props): ReactNode {
  const {pathname} = useLocation();
  if (pathname.startsWith(HIDDEN_PATHNAME_PREFIX)) {
    return null;
  }
  return <Navbar {...props} />;
}
