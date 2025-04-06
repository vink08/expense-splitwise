export type User = {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
};

export type Expense = {
  id: string;
  title: string;
  description?: string;
  amount: number;
  paidBy: string; // user ID
  category: string;
  date: number; // timestamp
  split: Split;
};

export type Split = {
  type: 'equal' | 'custom';
  shares: { [userId: string]: number }; // userId: share percentage (0-100)
};

export type Group = {
  id: string;
  name: string;
  description?: string;
  members: User[];
  expenses: Expense[];
  createdBy: string; // user ID
  createdAt: number; // timestamp
};

export type RootStackParamList = {
  Home: undefined;
  GroupDetails: { groupId: string };
  AddExpense: { groupId: string };
  AddGroup: undefined;
};

export type Balance = {
  userId: string;
  amount: number; // positive = owed to user, negative = user owes
}; 