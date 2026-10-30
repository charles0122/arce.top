import React from 'react';

import AppLegalPage from '../_components/AppLegal';
import {getAppBySlug} from '@site/src/data/apps';

export default function SudokuSupport() {
  const app = getAppBySlug('sudoku');
  return (
    <AppLegalPage
      app={app}
      title="支持与反馈"
      sections={app.support.sections}
    />
  );
}
