export const STATUS_ACTIVE = 'Y';
export const STATUS_INACTIVE = 'N';

export const STATUS_TEXT_ACTIVE = 'active';
export const STATUS_TEXT_INACTIVE = 'inactive';

const STATUS_TO_TEXT: Record<string, string> = {
  [STATUS_ACTIVE]: STATUS_TEXT_ACTIVE,
  [STATUS_INACTIVE]: STATUS_TEXT_INACTIVE,
};

export function getStatusText(status: string): string {
  return STATUS_TO_TEXT[status] ?? status;
}

export const STATUS_VALUES = [STATUS_ACTIVE, STATUS_INACTIVE] as const;
export type StatusValue = (typeof STATUS_VALUES)[number];
