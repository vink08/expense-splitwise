// import React from 'react';
// import { 
//   StyleSheet, 
//   View, 
//   Text, 
//   FlatList, 
//   TouchableOpacity,
//   SectionList,
//   ActivityIndicator
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types';
// import { useStore } from '../store/useStore';
// import { formatCurrency, formatDate, getUserName } from '../utils';
// import { Expense, User } from '../types';

// type Props = NativeStackScreenProps<RootStackParamList, 'GroupDetails'>;

// const MemberList = ({ 
//   members, 
//   currentUserId,
// }: { 
//   members: User[]; 
//   currentUserId: string;
// }) => {
//   return (
//     <View style={memberStyles.container}>
//       {members.map(member => (
//         <View key={member.id} style={memberStyles.memberItem}>
//           <Text style={memberStyles.memberName}>
//             {member.name} 
//             {member.id === currentUserId && ' (You)'}
//           </Text>
//         </View>
//       ))}
//     </View>
//   );
// };

// const GroupDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
//   if (!route.params) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text>Error: Missing group information</Text>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backButton}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const { groupId } = route.params;
//   const { getGroup, getGroupBalances, currentUser } = useStore();
  
//   const group = getGroup(groupId);
//   const balances = getGroupBalances(groupId);
  
//   if (!group || !currentUser) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4A56E2" />
//       </View>
//     );
//   }

//   const sortedExpenses = [...group.expenses].sort((a, b) => b.date - a.date);
  
//   const groupByDate = (expenses: Expense[]) => {
//     const grouped: Record<string, Expense[]> = {};
    
//     expenses.forEach((expense) => {
//       const dateKey = formatDate(expense.date);
//       grouped[dateKey] = grouped[dateKey] || [];
//       grouped[dateKey].push(expense);
//     });
    
//     return Object.entries(grouped).map(([date, data]) => ({
//       title: date,
//       data,
//     }));
//   };
  
//   const sections = groupByDate(sortedExpenses);
  
//   const handleAddExpense = () => {
//     navigation.navigate('AddExpense', { groupId });
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.groupHeader}>
//         <Text style={styles.groupName}>{group.name}</Text>
//         {group.description && (
//           <Text style={styles.groupDescription}>{group.description}</Text>
//         )}
//       </View>
      
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>MEMBERS</Text>
//         <MemberList 
//           members={group.members} 
//           currentUserId={currentUser.id}
//         />
//       </View>
      
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>BALANCES</Text>
//         <FlatList
//           data={balances}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           keyExtractor={(item) => item.userId}
//           renderItem={({ item }) => (
//             <View style={styles.balanceCard}>
//               <Text style={styles.balanceUserName}>
//                 {getUserName(item.userId, group.members)}
//               </Text>
//               <Text
//                 style={[
//                   styles.balanceAmount,
//                   item.amount > 0 ? styles.positiveAmount : 
//                   item.amount < 0 ? styles.negativeAmount : null,
//                 ]}
//               >
//                 {formatCurrency(Math.abs(item.amount))}
//               </Text>
//               {item.amount !== 0 && (
//                 <Text style={styles.balanceStatus}>
//                   {item.amount > 0 ? 'gets back' : 'owes'}
//                 </Text>
//               )}
//             </View>
//           )}
//         />
//       </View>
      
//       <View style={[styles.section, { flex: 1 }]}>
//         <Text style={styles.sectionTitle}>EXPENSES</Text>
        
//         {sortedExpenses.length > 0 ? (
//           <SectionList
//             sections={sections}
//             keyExtractor={(item) => item.id}
//             renderSectionHeader={({ section: { title } }) => (
//               <Text style={styles.expenseDateHeader}>{title}</Text>
//             )}
//             renderItem={({ item }) => (
//               <TouchableOpacity style={styles.expenseCard}>
//                 <View style={styles.expenseInfo}>
//                   <Text style={styles.expenseTitle}>{item.title}</Text>
//                   {item.description && (
//                     <Text style={styles.expenseDescription}>{item.description}</Text>
//                   )}
//                   <Text style={styles.expenseBy}>
//                     Paid by {getUserName(item.paidBy, group.members)} • {item.category}
//                   </Text>
//                 </View>
//                 <View style={styles.expenseAmount}>
//                   <Text style={styles.expenseAmountText}>
//                     {formatCurrency(item.amount)}
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//           />
//         ) : (
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyText}>No expenses yet</Text>
//           </View>
//         )}
//       </View>
      
//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={handleAddExpense}
//       >
//         <Text style={styles.addButtonText}>+ Add Expense</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const memberStyles = StyleSheet.create({
//   container: {
//     marginVertical: 8,
//   },
//   memberItem: {
//     padding: 12,
//     marginBottom: 8,
//     backgroundColor: '#f1f3f4',
//     borderRadius: 8,
//   },
//   memberName: {
//     fontSize: 16,
//   },
// });

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   backButton: {
//     color: '#4A56E2',
//     marginTop: 20,
//     fontSize: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   groupHeader: {
//     backgroundColor: '#4A56E2',
//     padding: 20,
//     paddingBottom: 24,
//   },
//   groupName: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     marginBottom: 4,
//   },
//   groupDescription: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.8)',
//   },
//   section: {
//     backgroundColor: '#ffffff',
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 1,
//     elevation: 1,
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#888',
//     marginBottom: 12,
//     textTransform: 'uppercase',
//   },
//   balanceCard: {
//     padding: 12,
//     marginRight: 8,
//     borderRadius: 8,
//     backgroundColor: '#f8f9fa',
//     width: 120,
//   },
//   balanceUserName: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   balanceAmount: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 2,
//   },
//   balanceStatus: {
//     fontSize: 12,
//     color: '#888',
//   },
//   positiveAmount: {
//     color: '#4cd964',
//   },
//   negativeAmount: {
//     color: '#ff3b30',
//   },
//   expenseDateHeader: {
//     padding: 8,
//     backgroundColor: '#f1f3f4',
//     borderRadius: 4,
//     marginVertical: 8,
//     fontSize: 14,
//     color: '#555',
//   },
//   expenseCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 1,
//     elevation: 1,
//     flexDirection: 'row',
//   },
//   expenseInfo: {
//     flex: 1,
//   },
//   expenseTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   expenseDescription: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   expenseBy: {
//     fontSize: 13,
//     color: '#888',
//   },
//   expenseAmount: {
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//   },
//   expenseAmountText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#888',
//   },
//   addButton: {
//     backgroundColor: '#4A56E2',
//     padding: 16,
//     margin: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   addButtonText: {
//     color: '#ffffff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default GroupDetailsScreen;

import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,
  SectionList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate, getUserName } from '../utils';
import { Expense } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupDetails'>;

const GroupDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { groupId } = route.params;
  const { getGroup, getGroupBalances } = useStore();
  
  const group = getGroup(groupId);
  const balances = getGroupBalances(groupId);
  
  if (!group) {
    return (
      <View style={styles.container}>
        <Text>Group not found</Text>
      </View>
    );
  }
  
  // Sort expenses by date (latest first)
  const sortedExpenses = [...group.expenses].sort((a, b) => b.date - a.date);
  
  // Group expenses by date
  const groupByDate = (expenses: Expense[]) => {
    const grouped: Record<string, Expense[]> = {};
    
    expenses.forEach((expense) => {
      const dateKey = formatDate(expense.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(expense);
    });
    
    return Object.keys(grouped).map((date) => ({
      title: date,
      data: grouped[date],
    }));
  };
  
  const sections = groupByDate(sortedExpenses);
  
  const handleAddExpense = () => {
    navigation.navigate('AddExpense', { groupId });
  };
  
  return (
    <View style={styles.container}>
      {/* Group Info */}
      <View style={styles.groupHeader}>
        <Text style={styles.groupName}>{group.name}</Text>
        {group.description && (
          <Text style={styles.groupDescription}>{group.description}</Text>
        )}
      </View>
      
      {/* Members Section */}
      <View style={styles.membersContainer}>
        <Text style={styles.membersTitle}>MEMBERS</Text>
        <View style={styles.membersList}>
          {group.members.map(member => (
            <View key={member.id} style={styles.memberItem}>
              <Text style={styles.memberName}>{member.name}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Balances */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>BALANCES</Text>
        <FlatList
          data={balances}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <View style={styles.balanceCard}>
              <Text style={styles.balanceUserName}>
                {getUserName(item.userId, group.members)}
              </Text>
              <Text
                style={[
                  styles.balanceAmount,
                  item.amount > 0 ? styles.positiveAmount : 
                  item.amount < 0 ? styles.negativeAmount : null,
                ]}
              >
                {formatCurrency(Math.abs(item.amount))}
              </Text>
              {item.amount !== 0 && (
                <Text style={styles.balanceStatus}>
                  {item.amount > 0 ? 'gets back' : 'owes'}
                </Text>
              )}
            </View>
          )}
        />
      </View>
      
      {/* Expenses */}
      <View style={styles.expensesContainer}>
        <Text style={styles.expensesTitle}>EXPENSES</Text>
        
        {sortedExpenses.length > 0 ? (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            renderItem={({ item }) => (
              <View style={styles.expenseCard}>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseTitle}>{item.title}</Text>
                  {item.description && (
                    <Text style={styles.expenseDescription}>{item.description}</Text>
                  )}
                  <Text style={styles.expenseBy}>
                    Paid by {getUserName(item.paidBy, group.members)}
                  </Text>
                </View>
                <View style={styles.expenseAmount}>
                  <Text style={styles.expenseAmountText}>
                    {formatCurrency(item.amount)}
                  </Text>
                  <Text style={styles.expenseCategory}>{item.category}</Text>
                </View>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No expenses yet</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddExpense}
      >
        <Text style={styles.addButtonText}>+ Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  groupHeader: {
    backgroundColor: '#4A56E2',
    padding: 20,
  },
  groupName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  membersContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  membersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginLeft: 8,
    marginBottom: 12,
  },
  membersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberItem: {
    padding: 8,
    margin: 4,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
  },
  balanceContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  balanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginLeft: 8,
    marginBottom: 12,
  },
  balanceCard: {
    padding: 12,
    margin: 4,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    width: 120,
  },
  balanceUserName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  balanceStatus: {
    fontSize: 12,
    color: '#888',
  },
  positiveAmount: {
    color: '#4cd964',
  },
  negativeAmount: {
    color: '#ff3b30',
  },
  expensesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  expensesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 12,
  },
  sectionHeader: {
    padding: 8,
    backgroundColor: '#f1f3f4',
    borderRadius: 4,
    marginVertical: 8,
    fontSize: 14,
    color: '#555',
  },
  expenseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    flexDirection: 'row',
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  expenseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  expenseBy: {
    fontSize: 13,
    color: '#888',
  },
  expenseAmount: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  expenseAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 12,
    color: '#4A56E2',
    backgroundColor: '#e8eaf6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  addButton: {
    backgroundColor: '#4A56E2',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GroupDetailsScreen; 