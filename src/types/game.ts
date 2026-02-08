export type Pattern = {
  name: string;
  cells: [number, number][];
  description?: string;
};

export type DrawMode = 'draw' | 'erase';
