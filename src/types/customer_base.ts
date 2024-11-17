export type CustomerBase = {
  id: number;
  name: string;
  description: string | null;
  structure: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}



