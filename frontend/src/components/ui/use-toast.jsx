export function toast({ title, description, variant = "default" }) {
  // In a real implementation, this would use a context provider
  // and manage a queue of toasts
  console.log(`Toast: ${title} - ${description}`);
}
