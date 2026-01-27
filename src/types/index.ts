export interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  roles: string[];
  color: string;
  externalUrl?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}
