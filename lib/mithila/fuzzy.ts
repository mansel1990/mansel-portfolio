export function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

/** True if the user's guess matches any accepted answer (fuzzy). */
export function matchAnswer(guess: string, answers: string[]): boolean {
  const g = normalize(guess);
  if (!g) return false;
  return answers.some((a) => {
    const ans = normalize(a);
    if (g === ans) return true;
    if (g.includes(ans)) return true;
    if (g.length >= 4 && ans.includes(g)) return true;
    const tol = ans.length <= 4 ? 1 : 2;
    return levenshtein(g, ans) <= tol;
  });
}

/** Gate check: pass if the normalized guess contains the required substring. */
export function matchGate(guess: string, contains: string): boolean {
  return normalize(guess).replace(/ /g, "").includes(contains);
}
