/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useCallback, useMemo} from 'react';
import {translate} from '@docusaurus/Translate';
import {
  usePluralForm,
  useQueryString,
  useQueryStringList,
} from '@docusaurus/theme-common';
import type {TagType, Project} from '@site/data/project';
import {sortedProjects} from '@site/data/project';

export function useSearchName() {
  return useQueryString('name');
}

export function useTags() {
  return useQueryStringList('tags');
}

type Operator = 'OR' | 'AND';

export function useOperator() {
  const [searchOperator, setSearchOperator] = useQueryString('operator');
  const operator: Operator = searchOperator === 'AND' ? 'AND' : 'OR';
  const toggleOperator = useCallback(() => {
    const newOperator = operator === 'OR' ? 'AND' : null;
    setSearchOperator(newOperator);
  }, [operator, setSearchOperator]);
  return [operator, toggleOperator] as const;
}

function filterProjects({
  projects,
  tags,
  operator,
  searchName,
}: {
  projects: Project[];
  tags: TagType[];
  operator: Operator;
  searchName: string | null;
}) {
  if (searchName) {
    // eslint-disable-next-line no-param-reassign
    projects = projects.filter((project) =>
      project.title.toLowerCase().includes(searchName.toLowerCase()),
    );
  }
  if (tags.length === 0) {
    return projects;
  }
  return projects.filter((project) => {
    if (project.tags.length === 0) {
      return false;
    }
    if (operator === 'AND') {
      return tags.every((tag) => project.tags.includes(tag));
    }
    return tags.some((tag) => project.tags.includes(tag));
  });
}

export function useFilteredProjects() {
  const [tags] = useTags();
  const [searchName] = useSearchName();
  const [operator] = useOperator();
  return useMemo(
    () =>
      filterProjects({
        projects: sortedProjects,
        tags: tags as TagType[],
        operator,
        searchName,
      }),
    [tags, operator, searchName],
  );
}

export function useProjectCountPlural() {
  const {selectMessage} = usePluralForm();
  return (projectsCount: number) =>
    selectMessage(
      projectsCount,
      translate(
        {
          id: 'showcase.filters.resultCount',
          description:
            'Label for the number of projects found on the showcase.',
          message: '{projectsCount} 个项目',
        },
        {projectsCount},
      ),
    );
}
