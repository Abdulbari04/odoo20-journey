export type Chg = [name: string, cat: 'n'|'e'|'r'|'x', ed: 'C'|'E', v19: string, v20: string, where: string, note: string]
export interface Chapter {
  k: string; t: string; en: string; lvl: string; intro: string; analogy: string
  terms: [string,string][]; steps: string[]; ex: string
  acc: [string,string,string,string][] | null; accNote: string
  quiz: [string,string][]; src: [string,string][]; from: string; to: string; up?: string[]
}
export interface Data { CHG: Record<string, Chg[]>; CORE: Record<string, Chapter>; IV: string }
