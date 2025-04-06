
 //Generates a unique ID
 
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};


 //Formats a date from timestamp

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Formats currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

//Get user's name from ID

export const getUserName = (
  userId: string,
  users: { id: string; name: string }[]
): string => {
  const user = users.find((u) => u.id === userId);
  return user ? user.name : 'Unknown';
};


//Categories for expenses
 
export const CATEGORIES = [
  'Food',
  'Transportation',
  'Accommodation',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Other',
]; 