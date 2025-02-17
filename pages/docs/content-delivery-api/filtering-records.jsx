import DocPageContent from 'components/DocPageContent';
import DocsLayout from 'components/DocsLayout';
import Head from 'components/Head';
import Heading from 'components/Heading';
import Prism from 'components/Prism';
import Space from 'components/Space';
import Tabs, { Tab } from 'components/Tabs';
import { handleErrors } from 'lib/datocms';
import {
  Sidebar,
  Toc,
  getStaticProps as docPageGetStaticProps,
} from 'pages/docs/[...chunks]';
import s from 'pages/docs/pageStyle.module.css';
import React from 'react';
import { renderMetaTags } from 'react-datocms';
import tiny from 'tiny-json-http';
import fieldTypes from 'utils/fieldTypes';
import gqlExampleForField, { camelize } from 'utils/gqlExampleForField';
import metaTypes from 'utils/metaTypes';
import { useQuerySubscription } from 'utils/useQuerySubscription';

export const getStaticProps = handleErrors(async ({ preview }) => {
  const { props } = await docPageGetStaticProps({
    params: { chunks: ['content-delivery-api', 'filtering-records'] },
    preview,
  });

  if (!props) {
    return { notFound: true };
  }

  const {
    body: { meta: fieldsMetaInfo, field_types: fieldTypesInfo },
  } = await tiny.get({
    url: 'https://internal.datocms.com/introspection/field-filters',
  });

  return { props: { ...props, fieldsMetaInfo, fieldTypesInfo } };
});

const Filters = ({ name, attrs }) => {
  return (
    <Space both={1}>
      <Tabs>
        {Object.keys(attrs).map((key) => (
          <Tab key={key} title={camelize(key)} code>
            <div className={s.filterDescription}>{attrs[key].description}</div>
            <Prism
              code={gqlExampleForField(name, key, attrs[key].input)}
              language={'graphql'}
            />
          </Tab>
        ))}
      </Tabs>
    </Space>
  );
};

export default function DocPage({
  docGroup,
  titleOverride,
  pageSubscription,
  fieldsMetaInfo,
  fieldTypesInfo,
}) {
  const { data } = useQuerySubscription(pageSubscription);
  const page = data.page;

  return (
    <DocsLayout
      sidebar={
        <Sidebar
          title={docGroup.name}
          entries={docGroup.pages.map((page) => {
            return {
              url: `/docs/${docGroup.slug}${
                page.page.slug === 'index' ? '' : `/${page.page.slug}`
              }`,
              label: page.titleOverride || page.page.title,
            };
          })}
        />
      }
    >
      <Head>{renderMetaTags(page._seoMetaTags)}</Head>
      <div className={s.articleContainer}>
        <Toc
          content={page.content}
          extraEntries={[
            {
              anchor: 'field-types',
              label: 'Filters available for field types',
              tag: 'h3',
            },
            ...Object.keys(fieldTypesInfo).map((name) => ({
              anchor: name,
              label: `${fieldTypes[name]} fields`,
              tag: 'h4',
            })),
            {
              anchor: 'meta-fields',
              label: 'Filters available for meta fields',
              tag: 'h3',
            },
            ...Object.keys(fieldsMetaInfo).map((name) => ({
              anchor: name,
              label: `${metaTypes[name]} meta`,
              tag: 'h4',
            })),
          ]}
        />
        <div className={s.article}>
          <div className={s.title}>{titleOverride || page.title}</div>
          <DocPageContent content={page.content} style={s}>
            <Heading anchor="field-types" as="h3">
              Filters available for field types
            </Heading>
            {Object.keys(fieldTypesInfo).map((name) => (
              <React.Fragment key={name}>
                <Heading anchor={name} as="h4">
                  {fieldTypes[name]} fields
                </Heading>
                <Filters name={name} attrs={fieldTypesInfo[name]} />
              </React.Fragment>
            ))}
            <Heading anchor="meta-fields" as="h3">
              Filters available for meta fields
            </Heading>
            {Object.keys(fieldsMetaInfo).map((name) => (
              <React.Fragment key={name}>
                <Heading anchor={name} as="h4">
                  Filter by <code>{camelize(name)}</code> meta field
                </Heading>
                <Filters name={name} attrs={fieldsMetaInfo[name]} />
              </React.Fragment>
            ))}
          </DocPageContent>
        </div>
      </div>
    </DocsLayout>
  );
}
