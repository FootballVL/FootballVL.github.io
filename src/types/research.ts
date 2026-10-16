export interface ResearchFigure { src: string; alt: string; caption: string; }
export interface ResearchTable { columns: string[]; rows: string[][]; }
export interface ResearchTopic {
  id: string;
  title: string;
  level: number;
  path: string[];
  paragraphs: string[];
  code: string[];
  figures: ResearchFigure[];
  tables: ResearchTable[];
}
