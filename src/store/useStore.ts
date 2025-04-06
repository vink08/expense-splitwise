import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group, User, Expense, Balance } from '../types';
import { generateId } from '../utils';

interface AppState {
  // Current User
  currentUser: User;
  setCurrentUser: (user: User) => void;

  // Groups
  groups: Group[];
  addGroup: (name: string, description?: string) => string;
  getGroup: (groupId: string) => Group | undefined;
  addUserToGroup: (groupId: string, user: User) => void;
  
  // Expenses
  addExpense: (groupId: string, expense: Omit<Expense, 'id'>) => void;
  
  // Balances
  getGroupBalances: (groupId: string) => Balance[];
  getTotalBalance: () => Balance;
  
  // Debug function to clear all data (for testing)
  clearAllData: () => void;
}

// Create the store with persistence
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Current User
      currentUser: {
        id: 'user-1',
        name: 'You',
      },
      setCurrentUser: (user) => set({ currentUser: user }),

      // Groups
      groups: [],
      
      addGroup: (name, description) => {
        const newGroupId = generateId();
        const { currentUser } = get();
        
        set((state) => ({
          groups: [
            ...state.groups,
            {
              id: newGroupId,
              name,
              description,
              members: [currentUser],
              expenses: [],
              createdBy: currentUser.id,
              createdAt: Date.now(),
            },
          ],
        }));
        
        return newGroupId;
      },
      
      getGroup: (groupId) => {
        return get().groups.find((group) => group.id === groupId);
      },
      
      addUserToGroup: (groupId, user) => {
        set((state) => ({
          groups: state.groups.map((group) => {
            if (group.id === groupId) {
              // Check if user already exists in the group
              const userExists = group.members.some((member) => member.id === user.id);
              if (userExists) return group;
              
              return {
                ...group,
                members: [...group.members, user],
              };
            }
            return group;
          }),
        }));
      },
      
      // Expenses
      addExpense: (groupId, expense) => {
        const expenseWithId = {
          ...expense,
          id: generateId(),
        };
        
        set((state) => ({
          groups: state.groups.map((group) => {
            if (group.id === groupId) {
              return {
                ...group,
                expenses: [...group.expenses, expenseWithId],
              };
            }
            return group;
          }),
        }));
      },
      
      // Balance calculations
      getGroupBalances: (groupId) => {
        const group = get().getGroup(groupId);
        if (!group) return [];
        
        const balances: Record<string, number> = {};
        
        // Initialize balances for all members
        group.members.forEach((member) => {
          balances[member.id] = 0;
        });
        
        // Calculate balances based on expenses
        group.expenses.forEach((expense) => {
          const { amount, paidBy, split } = expense;
          
          // Add the full amount to the payer
          balances[paidBy] += amount;
          
          if (split.type === 'equal') {
            // Calculate equal shares
            const memberCount = Object.keys(split.shares).length;
            const equalShare = amount / memberCount;
            
            Object.keys(split.shares).forEach((userId) => {
              balances[userId] -= equalShare;
            });
          } else {
            // Custom split
            Object.entries(split.shares).forEach(([userId, percentage]) => {
              const share = (amount * percentage) / 100;
              balances[userId] -= share;
            });
          }
        });
        
        // Convert to Balance array
        return Object.entries(balances).map(([userId, amount]) => ({
          userId,
          amount,
        }));
      },
      
      getTotalBalance: () => {
        const { groups, currentUser } = get();
        let totalAmount = 0;
        
        groups.forEach((group) => {
          const balances = get().getGroupBalances(group.id);
          const userBalance = balances.find((balance) => balance.userId === currentUser.id);
          if (userBalance) {
            totalAmount += userBalance.amount;
          }
        });
        
        return {
          userId: currentUser.id,
          amount: totalAmount,
        };
      },
      
      // Debug function to clear all data
      clearAllData: () => set({ groups: [] }),
    }),
    {
      name: 'expense-tracker-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        groups: state.groups,
      }),
    }
  )
); 