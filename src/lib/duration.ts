export interface DurationProfile {
  seconds: number;
  label: string;
  note: string;
  minLines: number;
  maxLines: number;
  words: number;
  singleClip: boolean;
}

export const DURATION_OPTIONS: DurationProfile[] = [
  { seconds: 8, label: '8 sn', note: 'tek klip', minLines: 3, maxLines: 4, words: 24, singleClip: true },
  { seconds: 12, label: '12 sn', note: 'tek klip', minLines: 4, maxLines: 6, words: 36, singleClip: true },
  { seconds: 18, label: '18 sn', note: 'tek klip', minLines: 5, maxLines: 7, words: 55, singleClip: true },
  { seconds: 24, label: '24 sn', note: 'Cinema / Kling', minLines: 7, maxLines: 9, words: 80, singleClip: true },
  { seconds: 30, label: '30 sn', note: 'tek klip üst sınırı', minLines: 8, maxLines: 10, words: 85, singleClip: true },
  { seconds: 40, label: '40 sn', note: '2 sahne / uzatma', minLines: 10, maxLines: 12, words: 110, singleClip: false },
  { seconds: 50, label: '50 sn', note: '2 sahne / uzatma', minLines: 12, maxLines: 14, words: 135, singleClip: false },
  { seconds: 60, label: '60 sn', note: '2-3 sahne', minLines: 14, maxLines: 16, words: 160, singleClip: false }
];

export function getDurationProfile(seconds: number): DurationProfile {
  return DURATION_OPTIONS.find((d) => d.seconds === seconds) ?? DURATION_OPTIONS[1];
}
