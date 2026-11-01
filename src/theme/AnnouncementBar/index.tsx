import React, {type ReactNode} from 'react';
import AnnouncementBar from '@theme-original/AnnouncementBar';
import type AnnouncementBarType from '@theme/AnnouncementBar';
import type {WrapperProps} from '@docusaurus/types';
import {useLocation} from '@docusaurus/router';

type Props = WrapperProps<typeof AnnouncementBarType>;

// 首页与产品页使用独立布局，不显示博客公告条
const HIDDEN_PATHNAME_PREFIX = '/apps';

export default function AnnouncementBarWrapper(props: Props): ReactNode {
  const {pathname} = useLocation();
  if (pathname === '/' || pathname.startsWith(HIDDEN_PATHNAME_PREFIX)) {
    return null;
  }
  return <AnnouncementBar {...props} />;
}
