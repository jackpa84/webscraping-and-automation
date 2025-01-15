export interface Task {
  id: string;
  title: string;
  duration: string; // e.g., "3h"
  date: string;     // e.g., "21/10/2024"
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}