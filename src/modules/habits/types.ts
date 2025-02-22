export interface Habit {
  id: number;
  name: string;
  trackedByMonth: {
    [key: string]: boolean[];
  };
  dateCreated: Date;
}
