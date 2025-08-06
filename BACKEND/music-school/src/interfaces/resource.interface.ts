export interface MusicResource {
  _id: string;
  title: string;
  description: string;
  type: 'sheet_music' | 'video' | 'audio' | 'article';
  url: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  instrument: string;
}