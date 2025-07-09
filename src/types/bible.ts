export interface BibleVerse {
  usfm: string;
  reference: string;
  content: string;
  book: string;
  chapter: number;
  verse: number;
}

export interface BibleServiceConfig {
  apiKey: string;
  baseUrl: string;
  defaultVersion: number;
}

export interface ParsedReference {
  type: 'single' | 'range';
  book: string;
  chapter: number;
  verse: number;
  startVerse?: number;
  endVerse?: number;
}

export interface ScriptureContent {
  reference: string;
  verses: BibleVerse[];
  book: string;
  chapter: number;
  startVerse?: number;
  endVerse?: number;
} 