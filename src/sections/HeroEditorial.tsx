import { Localized } from '../i18n/I18nProvider';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { projectStats } from '../data/research';
import { HeroCarousel } from '../components/HeroCarousel';

export function HeroEditorial() {

  return <Localized>{(
    <section id="hero" className="editorial-hero">
      <div className="hero-masthead"><span>FOOTBALL. STATISTICS. PERSPECTIVE.</span><span>FIELD NOTES / 2021–2023</span></div>
      <h1 className="cover-title">FOOTBALL <span>VALUE LAB</span><span className="cover-period" aria-hidden="true">.</span></h1>
      <p className="cover-study-period"><span>LOS DATOS DE MI INVESTIGACIÓN</span><strong>Temporadas 2021/22 y 2022/23</strong></p>
      <div className="cover-deck">
        <p className="cover-tagline">Beyond the Price Tag.</p>
        <p>¿Cuánto vale un futbolista?<br />Esta es mi forma de buscar la respuesta con datos.</p>
        <a href="#explorer">Meet the players <ArrowUpRight size={20} /></a>
      </div>
      <HeroCarousel />
      <div className="cover-colophon"><span>The players behind the numbers.</span><a href="#research">Wikimedia Commons / photo credits below <ArrowUpRight size={12} /></a></div>
      <div className="cover-evidence">
        <p>He unido rendimiento, edad y contexto competitivo para explorar qué hay detrás del valor de mercado de un futbolista.</p>
        <div className="hero-stats">{projectStats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span><small>{stat.note}</small></div>)}</div>
      </div>
      <div className="cover-next"><a href="#findings">Explore the findings <ArrowDown size={16} /></a><a href="#research">Research & code <ArrowUpRight size={16} /></a></div>
    </section>
  )}</Localized>;
}
