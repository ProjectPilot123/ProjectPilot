export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  projectUrl?: string;
}

export interface ProfileData {
  name: string;
  email: string;
  avatarUrl: string;
}
