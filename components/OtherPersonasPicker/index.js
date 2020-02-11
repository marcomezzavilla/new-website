import s from './style.css';
import Wrapper from 'components/Wrapper';
import Link from 'next/link';

export default function PersonasPicker({ title, currentPersonas }) {
  return (
    <Wrapper>
      <div className={s.root}>
        <div className={s.intro}>
          <div className={s.introTitle}>{title}</div>
          <div className={s.introBody}>
            DatoCMS is a concrete benefit for the whole company. See how DatoCMS
            can help the entire digital pipeline.
          </div>
        </div>
        <div className={s.picker}>
          {currentPersonas !== 'developers' && (
            <Link href="/team/developers">
              <a className={s.personas}>
                <div className={s.personasTitle}>For developers</div>
                <div className={s.personasBody}>
                  Your business needs a reliable and future-proof infrastructure
                </div>
                <div className={s.personasLink}>Learn more</div>
              </a>
            </Link>
          )}

          {currentPersonas !== 'digital-marketers' && (
            <Link href="/team/digital-marketers">
              <a className={s.personas}>
                <div className={s.personasTitle}>For digital marketers</div>
                <div className={s.personasBody}>
                  Solve complex strategic goals with technology that empowers
                  your team
                </div>
                <div className={s.personasLink}>Learn more</div>
              </a>
            </Link>
          )}

          {currentPersonas !== 'content-creators' && (
            <Link href="/team/content-creators">
              <a className={s.personas}>
                <div className={s.personasTitle}>For content editors</div>
                <div className={s.personasBody}>
                  Automate SEO and manage content on multiple sites without
                  filing an IT ticket
                </div>
                <div className={s.personasLink}>Learn more</div>
              </a>
            </Link>
          )}
        </div>
      </div>
    </Wrapper>
  );
}