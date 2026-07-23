import type { Project } from './types';

export const mockSavedProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'AI Resume Analyzer',
    description:
      'Parses resumes and matches them against job descriptions, highlighting missing skills and suggesting improvements.',
    tags: ['AI/ML', 'NLP', 'Python'],
    projectUrl: '#',
  },
  {
    id: 'proj-2',
    title: 'Smart Expense Tracker',
    description:
      'Tracks daily spending, categorizes transactions automatically, and visualizes monthly budgets.',
    tags: ['React', 'Finance', 'Charts'],
    projectUrl: '#',
  },
  {
    id: 'proj-3',
    title: 'Mental Health Chatbot',
    description:
      'A conversational assistant that offers coping strategies and mood tracking for students.',
    tags: ['AI/ML', 'Chatbot', 'Healthcare'],
    projectUrl: '#',
  },
  {
    id: 'proj-4',
    title: 'College Event Management System',
    description:
      'Lets students discover campus events, RSVP, and lets organizers manage registrations in one place.',
    tags: ['Web App', 'Node.js', 'MongoDB'],
    projectUrl: '#',
  },
];
