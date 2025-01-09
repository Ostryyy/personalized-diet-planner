export interface User {
  id?: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  token?: string;
  goalsSet: boolean;
  weight?: number;
  height?: number;
  goal?: 'lose' | 'gain' | 'maintain';
}
