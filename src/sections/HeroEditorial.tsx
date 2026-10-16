import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { projectStats } from '../data/research';
import { HeroCarousel } from '../components/HeroCarousel';

export function HeroEditorial() {

  return (
    <section id="hero" className="editorial-hero">
      <div className="hero-masthead"><span>FOOTBALL. STATISTICS. PERSPECTIVE.</span><span>FIELD NOTES / 2021–2023</span></div>
      <h1 className="cover-title">FOOTBALL <span>VALUE LAB</span><span className="cover-period" aria-hidden="true">.</span></h1>
      <div className="cover-deck">
        <p className="cover-tagline">Beyond the Price Tag.</p>
        <p>What is a footballer worth?<br />And how much of that can a model explain?</p>
        <a href="#explorer">Meet the players <ArrowUpRight size={20} /></a>
      </div>
      <HeroCarousel />
      <div className="cover-colophon"><span>The players behind the numbers.</span><a href="#research">Wikimedia Commons / photo credits below <ArrowUpRight size={12} /></a></div>
      <div className="cover-evidence">
        <p>Performance, age and league context meet statistical modelling in a study of football’s market valuations.</p>
        <div className="hero-stats">{projectStats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span><small>{stat.note}</small></div>)}</div>
      </div>
      <div className="cover-next"><a href="#findings">Explore the findings <ArrowDown size={16} /></a><a href="#research">Research & code <ArrowUpRight size={16} /></a></div>
    </section>
  );
}
