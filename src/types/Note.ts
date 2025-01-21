export interface Note {
  id: string;
  title: string;
  description: string;
  calculations: {
    id: string;
    expression: string;
    result: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}