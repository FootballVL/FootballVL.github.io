import { Nav } from './components/Nav';
import { DataSection } from './sections/DataSection';
import { ExplorerSectionV2 } from './sections/ExplorerSectionV2';
import { FindingsSection } from './sections/FindingsSection';
import { HeroEditorial } from './sections/HeroEditorial';
import { ModelSection } from './sections/ModelSection';
import { ResearchSection } from './sections/ResearchSection';

export default function App() {
  return (
    <div className="min-h-screen bg-night text-ink">
      <Nav />
      <main>
        <HeroEditorial />
        <DataSection />
        <FindingsSection />
        <ModelSection />
        <ExplorerSectionV2 />
        <ResearchSection />
      </main>
    </div>
  );
}
