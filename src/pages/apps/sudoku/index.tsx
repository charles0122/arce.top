import React from 'react';

import AppLanding from '../_components/AppLanding';
import {getAppBySlug} from '@site/src/data/apps';

export default function SudokuLanding() {
  return <AppLanding app={getAppBySlug('sudoku')} />;
}
