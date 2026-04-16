export interface Issue {
  _id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  image: string;
  amount: number | string;
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
