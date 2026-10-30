/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ReactNode} from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import {sortedProjects, type Project} from '@site/data/project';
import Heading from '@theme/Heading';
import FavoriteIcon from '../FavoriteIcon';
import ShowcaseCard from '../ShowcaseCard';
import {useFilteredProjects} from '../../_utils';

import styles from './styles.module.css';

const favoriteProjects = sortedProjects.filter((project) =>
  project.tags.includes('favorite'),
);

const otherProjects = sortedProjects.filter(
  (project) => !project.tags.includes('favorite'),
);

function HeadingNoResult() {
  return (
    <Heading as="h2">
      <Translate id="showcase.projectsList.noResult">没有找到项目</Translate>
    </Heading>
  );
}

function HeadingFavorites() {
  return (
    <Heading as="h2" className={styles.headingFavorites}>
      <Translate id="showcase.favoritesList.title">最爱</Translate>
      <FavoriteIcon size="large" style={{marginLeft: '1rem'}} />
    </Heading>
  );
}

function HeadingAllProjects() {
  return (
    <Heading as="h2">
      <Translate id="showcase.projectsList.allProjects">全部项目</Translate>
    </Heading>
  );
}

function CardList({
  heading,
  items,
}: {
  heading?: ReactNode;
  items: Project[];
}) {
  return (
    <div className="container">
      {heading}
      <ul className={clsx('clean-list', styles.cardList)}>
        {items.map((item) => (
          <ShowcaseCard key={item.title} project={item} />
        ))}
      </ul>
    </div>
  );
}

function NoResultSection() {
  return (
    <section className="margin-top--lg margin-bottom--xl">
      <div className="container padding-vert--md text--center">
        <HeadingNoResult />
      </div>
    </section>
  );
}

export default function ShowcaseCards() {
  const filteredProjects = useFilteredProjects();

  if (filteredProjects.length === 0) {
    return <NoResultSection />;
  }

  return (
    <section className="margin-top--lg margin-bottom--xl">
      {filteredProjects.length === sortedProjects.length ? (
        <>
          {favoriteProjects.length > 0 && (
            <div className={styles.showcaseFavorite}>
              <CardList
                heading={<HeadingFavorites />}
                items={favoriteProjects}
              />
            </div>
          )}
          <div className="margin-top--lg">
            <CardList
              heading={
                favoriteProjects.length > 0 ? <HeadingAllProjects /> : null
              }
              items={otherProjects}
            />
          </div>
        </>
      ) : (
        <CardList items={filteredProjects} />
      )}
    </section>
  );
}
