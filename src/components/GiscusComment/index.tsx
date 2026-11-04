import React, {useEffect, useRef, useState} from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useColorMode} from '@docusaurus/theme-common';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Giscus, {GiscusProps} from '@giscus/react';

/**
 * Giscus pulls from giscus.app / GitHub — often slow or blocked in mainland China.
 * Only mount it once the comments block is near the viewport.
 */
export default function GiscusComment(): React.JSX.Element {
  const themeConfig = useThemeConfig() as any;
  const theme = useColorMode().colorMode === 'dark' ? 'dark' : 'light';
  const hostRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = hostRef.current;
    if (!node || shouldLoad) {
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {rootMargin: '240px 0px'},
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  const options: GiscusProps = {
    ...(themeConfig.giscus as GiscusProps),
    id: 'comments',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'top',
    theme,
  };

  return (
    <div ref={hostRef} id="giscus-host" style={{minHeight: shouldLoad ? undefined : 160}}>
      {shouldLoad ? (
        <BrowserOnly fallback={<div />}>{() => <Giscus {...options} />}</BrowserOnly>
      ) : (
        <p style={{opacity: 0.55, fontSize: '0.875rem', margin: '1rem 0'}}>
          滚动到此处加载评论…
        </p>
      )}
    </div>
  );
}
