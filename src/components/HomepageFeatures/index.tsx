import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  image;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Clean & Generative',
    image: require('@site/static/img/croparia.webp').default,
    description: (
      <>
        Croparia IF provides a clean functionality of resource farming and dynamically generates contents for you to
        play with.
      </>
    ),
  },
  {
    title: 'More Customizable',
    image: require('@site/static/img/recipe_wizard.webp').default,
    description: (
      <>
        Recipes, structures, crops, textures... almost everything is customizable with handy tools and detailed
        documentation!
      </>
    ),
  },
  {
    title: 'Powered by Architectury',
    image: require('@site/static/img/arch.webp').default,
    description: (
      <>
        We use architectury to build our mod, which makes it compatible with both fabric and forge (or neoforge for
        1.21+).
      </>
    ),
  },
];

function Feature({title, image, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div style={{
          height: '200px',
          width: '200px',
          alignSelf: 'center',
          justifySelf: 'center',
          alignContent: 'center',
        }}>
          <img className={styles.featureSvg} alt={title} src={image}/>
        </div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
