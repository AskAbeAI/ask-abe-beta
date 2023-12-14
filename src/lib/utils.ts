
import { node_as_row } from './types';




export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

// After fin
export function constructPromptQuery(
  user_query: string,
  state_jurisdiction: string,
  federal_jurisdiction: string
): string {
  return `According to the law in ${state_jurisdiction}, ${federal_jurisdiction}: ${user_query}`;
}

export function constructPromptQueryMisc(
  user_query: string,
  legal_document: string
): string {
  return `According to the regulations in ${legal_document}: ${user_query}`;
}
