import { clsx, type ClassValue } from 'clsx';
import { customAlphabet } from 'nanoid';
import { twMerge } from 'tailwind-merge';
import { node_as_row } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
); // 7-character random string

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error('An unexpected error occurred');
    }
  }

  return res.json();
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

[
  "California Code",
  "EU MICA Regulations",
  "Federal Regulation",
  "MICA Regulations"
];
export function mapJurisdictionFullname(jurisdiction: string): string {
  switch (jurisdiction) {
    case 'ca':
      return 'California Statutes';
    case 'ecfr':
      return 'US Electronic Code of Federal Regulations';
    default:
      return 'Unknown';
  }
}
export function getSectionTextFromRow(row: node_as_row): string {
  return `${row.citation}\n${row.node_text}`;
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
