import React from 'react';

import AppLegalPage from '../_components/AppLegal';
import {getAppBySlug} from '@site/src/data/apps';

export default function SudokuPrivacy() {
  const app = getAppBySlug('sudoku');
  return (
    <AppLegalPage
      app={app}
      title="隐私政策"
      updated={app.privacy.updated}
      sections={app.privacy.sections}
    />
  );
}
