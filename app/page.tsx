import { getProjects } from '@/lib/content';
import Hero from '@/components/Hero';
import FeaturedProjects from '@/components/FeaturedProjects';

export default function Home() {
  const featured = getProjects()
    .filter((p) => p.featured)
    .slice(0, 3)
    .map(({ body: _body, ...meta }) => meta);

  return (
    <main>
      <Hero />
      <FeaturedProjects projects={featured} />
    </main>
  );
}
