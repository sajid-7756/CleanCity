export interface Issue {
  [x: string]: string;
  rejectionNote: boolean;
  _id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  image: string;
  amount: number | string;
  garbageLevel?: "Low" | "Medium" | "High";
  proofImage?: string;
  cleanedBy?: string;
  status: string;
  email?: string;
  date: string;
}

export interface Contribution {
  _id?: string;
  issueId?: string;
  title: string;
  category: string;
  amount: number | string;
  date: string;
  address?: string;
  additionalInfo?: string;
  name?: string;
  email?: string;
  image?: string;
  phone?: string;
}
