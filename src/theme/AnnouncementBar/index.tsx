import React, {type ReactNode} from 'react';
import AnnouncementBar from '@theme-original/AnnouncementBar';
import type AnnouncementBarType from '@theme/AnnouncementBar';
import type {WrapperProps} from '@docusaurus/types';
import {useLocation} from '@docusaurus/router';

type Props = WrapperProps<typeof AnnouncementBarType>;

// 产品页（/apps）使用独立的落地页布局，不显示博客公告条
const HIDDEN_PATHNAME_PREFIX = '/apps';

export default function AnnouncementBarWrapper(props: Props): ReactNode {
  const {pathname} = useLocation();
  if (pathname.startsWith(HIDDEN_PATHNAME_PREFIX)) {
    return null;
  }
  return <AnnouncementBar {...props} />;
}
