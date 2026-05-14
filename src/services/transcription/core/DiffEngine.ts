export type DiffOp = 'insert' | 'delete' | 'equal';

export interface DiffToken {
  type: DiffOp;
  value: string;
}

export class DiffEngine {
  /**
   * Performs word-level diffing between two strings.
   * Returns an array of tokens with operation types.
   */
  static computeDiff(oldStr: string, newStr: string): DiffToken[] {
    const oldWords = oldStr.split(/(\s+)/);
    const newWords = newStr.split(/(\s+)/);
    
    // Simple greedy diff algorithm for word-level comparison
    // In production, we'd use a more robust Myers diff implementation
    const tokens: DiffToken[] = [];
    let i = 0, j = 0;

    while (i < oldWords.length || j < newWords.length) {
      if (i < oldWords.length && j < newWords.length && oldWords[i] === newWords[j]) {
        tokens.push({ type: 'equal', value: oldWords[i] });
        i++; j++;
      } else if (j < newWords.length && (i >= oldWords.length || !newWords.slice(j).includes(oldWords[i]))) {
        tokens.push({ type: 'insert', value: newWords[j] });
        j++;
      } else {
        tokens.push({ type: 'delete', value: oldWords[i] });
        i++;
      }
    }

    return tokens;
  }

  /**
   * Generates a high-level summary of changes.
   */
  static getStats(tokens: DiffToken[]) {
    return {
      additions: tokens.filter(t => t.type === 'insert' && t.value.trim()).length,
      deletions: tokens.filter(t => t.type === 'delete' && t.value.trim()).length,
    };
  }
}
