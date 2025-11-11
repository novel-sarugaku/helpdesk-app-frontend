export const Tickets = {
  all: ['tickets'] as const,
  detail: (id: number) => ['ticket', id] as const,
}
