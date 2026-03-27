export function extractErrorMessage(err: unknown, fallback: string): string {
  const error = (err as { error?: { detail?: string; message?: string } })?.error;
  return error?.detail ?? error?.message ?? fallback;
}
