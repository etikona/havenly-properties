export interface Job {
  _id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  location: string;
  isActive: boolean;
  createdAt: Date;
}

export interface JobApplicant {
  _id: string;
  jobId: string;
  jobTitle: string; // Denormalized for inbox display
  name: string;
  email: string;
  phone: string;
  cvUrl: string;
  coverLetter?: string;
  createdAt: Date;
}
