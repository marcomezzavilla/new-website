import Head from 'components/Head';
import Hero from 'components/Hero';
import { highlightStructuredText } from 'components/Highlight';
import IntegrationsBanner from 'components/IntegrationsBanner';
import LazyImage from 'components/LazyImage';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Layout from 'components/Layout';
import Bullets from 'components/Bullets';
import SuccessIcon from 'public/icons/regular/check.svg';
import Button from 'components/Button';
import {
  gqlStaticPropsWithSubscription,
  imageFields,
  partnerTestimonialFields,
  reviewFields,
} from 'lib/datocms';
import Link from 'next/link';
import { Image as DatoImage, StructuredText } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';
import Quote from 'components/Quote';

export const getStaticProps = gqlStaticPropsWithSubscription(/* GraphQL */ `
  query {
    allReviews(first: 100) {
      ...reviewFields
      _updatedAt
    }
    allPartnerTestimonials(first: 100) {
      ...partnerTestimonialFields
      _updatedAt
    }
    integrations: allIntegrations(first: 100) {
      id
      logo {
        url
      }
      integrationType {
        slug
      }
      squareLogo {
        url
      }
    }
    productOverview {
      header {
        value
      }
      subheader {
        value
      }
      pillars {
        id
        theme
        icon {
          url
        }
        pillarCallout
        title {
          value
        }
        capability1 {
          value
        }
        capability2 {
          value
        }
        capability3 {
          value
        }
        image {
          responsiveImage {
            ...imageFields
          }
        }
      }
      testimonials {
        ... on ReviewRecord {
          id
          name
          quote {
            value
          }
          image {
            responsiveImage(
              imgixParams: {
                w: 300
                h: 300
                fit: crop
                crop: faces
                auto: format
              }
            ) {
              ...imageFields
            }
          }
          role
        }
        ... on PartnerTestimonialRecord {
          id
          name
          quote {
            value
          }
          image {
            responsiveImage(
              imgixParams: {
                w: 300
                h: 300
                fit: crop
                crop: faces
                auto: format
              }
            ) {
              ...imageFields
            }
          }
          role
        }
      }
      features {
        id
        title
        icon {
          url
        }
        description {
          value
        }
      }
    }
  }

  ${reviewFields}
  ${partnerTestimonialFields}
  ${imageFields}
`);

export default function Wall({ preview, subscription }) {
  const {
    data: { productOverview, integrations },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      <Head>
        <title>Better, with DatoCMS</title>
      </Head>

      <div>
        <Hero
          title={highlightStructuredText(productOverview.header)}
          subtitle={<StructuredText data={productOverview.subheader} />}
        />
        <div className={s.buttonContainer}>
          <Button fs="big">Try it for free</Button>
          <Button fs="big" s="invert">
            Contact sales
          </Button>
        </div>
      </div>

      {productOverview.pillars.map((pillar, index) => {
        return (
          <div key={pillar.id} className={s.flagContainer}>
            <Flag
              kicker={pillar.theme}
              title={
                <>
                  <LazyImage
                    className={s.pillarIcon}
                    src={pillar.icon.url}
                    height={30}
                    width={30}
                  />
                  {highlightStructuredText(pillar.title, {
                    highlightWith: function BadHighlight({ children }) {
                      return (
                        <FlagHighlight style="bad">{children}</FlagHighlight>
                      );
                    },
                  })}
                </>
              }
              image={DatoImage}
              imageProps={{
                data: pillar.image.responsiveImage,
              }}
              rightImage={!(index % 2)}
              hideDot
            >
              <p> {pillar.pillarCallout}</p>

              <Bullets
                style="bad"
                icon={SuccessIcon}
                largeBullet
                bullets={[
                  <StructuredText key={pillar.id} data={pillar.capability1} />,
                  <StructuredText key={pillar.id} data={pillar.capability2} />,
                  <StructuredText key={pillar.id} data={pillar.capability3} />,
                ]}
              />
            </Flag>
          </div>
        );
      })}

      <IntegrationsBanner
        title={<>Extensible and integrable by&nbsp;design</>}
        bubbles={integrations
          .filter((i) =>
            ['ci', 'static-generator', 'language', 'cdn', 'framework'].includes(
              i.integrationType.slug,
            ),
          )
          .slice(0, 30)
          .map((integration) => (
            <LazyImage
              key={integration.id}
              src={
                integration.squareLogo
                  ? integration.squareLogo.url
                  : integration.logo.url
              }
            />
          ))}
      >
        Being a API-first <Link href="/">headless CMS</Link>,{' '}
        <strong>
          DatoCMS easily integrates with any third-party platform or service
        </strong>
        . DatoCMS is considered to be the best CMS for developers because it
        offers some of the best tools in the market: plugins, webhooks,
        templates and SDKs to get you started in no time. Check them out on our{' '}
        <a href="https://github.com/datocms/" target="_blank" rel="noreferrer">
          official Github page
        </a>
      </IntegrationsBanner>

      <div className={s.testimonials}>
        <h2 className={s.title}>What our customers say...</h2>
        <div className={s.testimonialsContainer}>
          {productOverview.testimonials.map((testimonial) => {
            return <Quote key={testimonial.id} review={testimonial} />;
          })}
        </div>
      </div>

      <div>
        <h2 className={s.title}>...and features they love!</h2>
        <div className={s.featuresContainers}>
          {productOverview.features.map((feature) => {
            return (
              <div key={feature.id} className={s.feature}>
                <div className={s.featureIcon}>
                  <LazyImage src={feature.icon.url} height={30} width={30} />
                </div>
                <div className={s.featureText}>
                  <h4 className={s.featureTitle}>{feature.title}</h4>
                  <p>
                    <StructuredText data={feature.description} />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
