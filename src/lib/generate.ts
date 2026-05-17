import { TOP_200 } from '../data/words';

export function generateWords(n: number): string[] {
  const out: string[] = [];
  let last = '';
  for (let i = 0; i < n; i++) {
    let w: string;
    do {
      w = TOP_200[Math.floor(Math.random() * TOP_200.length)];
    } while (w === last);
    out.push(w);
    last = w;
  }
  return out;
}
