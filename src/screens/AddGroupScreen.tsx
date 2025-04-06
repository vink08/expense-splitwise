













import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useStore } from '../store/useStore';
import { User } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddGroup'>;

const AddGroupScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [members, setMembers] = useState<User[]>([]);
  
  const { addGroup, addUserToGroup, currentUser } = useStore();
  
  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      Alert.alert('Error', 'Please enter a member name');
      return;
    }
    
    // Check if member already exists
    if (members.some(m => m.name.toLowerCase() === newMemberName.trim().toLowerCase())) {
      Alert.alert('Error', 'Member already exists');
      return;
    }
    
    const newMember: User = {
      id: `user-${Date.now()}`,
      name: newMemberName.trim()
    };
    
    setMembers([...members, newMember]);
    setNewMemberName('');
  };
  
  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };
  
  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }
    
    if (members.length === 0) {
      Alert.alert('Add Members', 'You haven\'t added any members. Continue with just yourself?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: actuallyCreateGroup }
      ]);
    } else {
      actuallyCreateGroup();
    }
  };
  
  const actuallyCreateGroup = () => {
    // Create the group (current user is automatically added)
    const groupId = addGroup(name.trim(), description.trim() || undefined);
    
    // Add additional members
    members.forEach(member => {
      addUserToGroup(groupId, member);
    });
    
    navigation.replace('GroupDetails', { groupId });
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.content}>
        <Text style={styles.label}>Group Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Trip to Goa"
          autoFocus
        />
        
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add some details about this group"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        
        <Text style={styles.label}>Members</Text>
        <Text style={styles.memberNote}>You will be automatically added to this group</Text>
        
        {/* Current members */}
        <View style={styles.membersContainer}>
          <View style={styles.memberItem}>
            <Text style={styles.memberName}>{currentUser.name} (You)</Text>
          </View>
          
          {members.map(member => (
            <View key={member.id} style={styles.memberItem}>
              <Text style={styles.memberName}>{member.name}</Text>
              <TouchableOpacity 
                onPress={() => handleRemoveMember(member.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        
        {/* Add new member */}
        <View style={styles.addMemberContainer}>
          <TextInput
            style={[styles.input, styles.memberInput]}
            value={newMemberName}
            onChangeText={setNewMemberName}
            placeholder="Enter member name"
            onSubmitEditing={handleAddMember}
          />
          <TouchableOpacity
            style={styles.addMemberButton}
            onPress={handleAddMember}
          >
            <Text style={styles.addMemberButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={!name.trim()}
        >
          <Text style={styles.buttonText}>Create Group</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  memberNote: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  membersContainer: {
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f3f4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  memberName: {
    fontSize: 16,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff3b30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addMemberContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  memberInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  addMemberButton: {
    backgroundColor: '#4A56E2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  addMemberButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    backgroundColor: '#4A56E2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default AddGroupScreen;



















// // screens/AddGroupScreen.tsx
// import React, { useState } from 'react';
// import { 
//   StyleSheet, 
//   View, 
//   Text, 
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types';
// import { useStore } from '../store/useStore';
// import MemberList from '../components/MemberList';
// import MemberInput from '../components/MemberInput';

// type Props = NativeStackScreenProps<RootStackParamList, 'AddGroup'>;

// const AddGroupScreen: React.FC<Props> = ({ navigation }) => {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [members, setMembers] = useState<User[]>([]);
  
//   const { addGroup, addUserToGroup, currentUser } = useStore();
  
//   const handleAddMember = (memberName: string) => {
//     if (members.some(m => m.name.toLowerCase() === memberName.toLowerCase())) {
//       Alert.alert('Error', 'Member already exists');
//       return;
//     }
    
//     const newMember: User = {
//       id: `user-${Date.now()}`,
//       name: memberName
//     };
//     setMembers([...members, newMember]);
//   };
  
//   const handleRemoveMember = (id: string) => {
//     setMembers(members.filter(member => member.id !== id));
//   };
  
//   const handleCreate = () => {
//     if (!name.trim()) return;
    
//     const groupId = addGroup(name.trim(), description.trim() || undefined);
//     members.forEach(member => addUserToGroup(groupId, member));
//     navigation.replace('GroupDetails', { groupId });
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <ScrollView style={styles.content}>
//         <Text style={styles.label}>Group Name *</Text>
//         <TextInput
//           style={styles.input}
//           value={name}
//           onChangeText={setName}
//           placeholder="e.g. Trip to Goa"
//           autoFocus
//         />
        
//         <Text style={styles.label}>Description (Optional)</Text>
//         <TextInput
//           style={[styles.input, styles.textArea]}
//           value={description}
//           onChangeText={setDescription}
//           placeholder="About this group"
//           multiline
//           numberOfLines={4}
//         />
        
//         <Text style={styles.label}>Members</Text>
//         <Text style={styles.note}>You will be automatically added</Text>
        
//         <MemberList 
//           members={[currentUser, ...members]} 
//           currentUserId={currentUser.id}
//           onRemove={handleRemoveMember}
//         />
        
//         <MemberInput onAdd={handleAddMember} />
//       </ScrollView>
      
//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={[styles.button, !name.trim() && styles.buttonDisabled]}
//           onPress={handleCreate}
//           disabled={!name.trim()}
//         >
//           <Text style={styles.buttonText}>Create Group</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//     color: '#333',
//   },
//   note: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 12,
//   },
//   input: {
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16,
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   footer: {
//     padding: 16,
//     backgroundColor: '#ffffff',
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   button: {
//     backgroundColor: '#4A56E2',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//   },
//   buttonDisabled: {
//     backgroundColor: '#a0a0a0',
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default AddGroupScreen;



// // import React from 'react';
// // import { 
// //   StyleSheet, 
// //   View, 
// //   Text, 
// //   FlatList, 
// //   TouchableOpacity,
// //   SectionList,
// // } from 'react-native';
// // import { NativeStackScreenProps } from '@react-navigation/native-stack';
// // import { RootStackParamList } from '../types';
// // import { useStore } from '../store/useStore';
// // import { formatCurrency, formatDate, getUserName } from '../utils';
// // import { Expense } from '../types';
// // import MemberList from '../components/MemberList';

// // type Props = NativeStackScreenProps<RootStackParamList, 'GroupDetails'>;

// // const GroupDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
// //   const { groupId } = route.params;
// //   const { getGroup, getGroupBalances, currentUser } = useStore();
  
// //   const group = getGroup(groupId);
// //   const balances = getGroupBalances(groupId);
  
// //   if (!group) {
// //     return (
// //       <View style={styles.container}>
// //         <Text>Group not found</Text>
// //       </View>
// //     );
// //   }
  
// //   // Sort expenses by date (latest first)
// //   const sortedExpenses = [...group.expenses].sort((a, b) => b.date - a.date);
  
// //   // Group expenses by date
// //   const groupByDate = (expenses: Expense[]) => {
// //     const grouped: Record<string, Expense[]> = {};
    
// //     expenses.forEach((expense) => {
// //       const dateKey = formatDate(expense.date);
// //       if (!grouped[dateKey]) {
// //         grouped[dateKey] = [];
// //       }
// //       grouped[dateKey].push(expense);
// //     });
    
// //     return Object.keys(grouped).map((date) => ({
// //       title: date,
// //       data: grouped[date],
// //     }));
// //   };
  
// //   const sections = groupByDate(sortedExpenses);
  
// //   const handleAddExpense = () => {
// //     navigation.navigate('AddExpense', { groupId });
// //   };
  
// //   return (
// //     <View style={styles.container}>
// //       {/* Group Header */}
// //       <View style={styles.groupHeader}>
// //         <Text style={styles.groupName}>{group.name}</Text>
// //         {group.description && (
// //           <Text style={styles.groupDescription}>{group.description}</Text>
// //         )}
// //       </View>
      
// //       {/* Members Section */}
// //       <View style={styles.section}>
// //         <Text style={styles.sectionTitle}>MEMBERS</Text>
// //         <MemberList 
// //           members={group.members} 
// //           currentUserId={currentUser.id}
// //           showActions={false}
// //         />
// //       </View>
      
// //       {/* Balances Section */}
// //       <View style={styles.section}>
// //         <Text style={styles.sectionTitle}>BALANCES</Text>
// //         <FlatList
// //           data={balances}
// //           horizontal
// //           showsHorizontalScrollIndicator={false}
// //           keyExtractor={(item) => item.userId}
// //           renderItem={({ item }) => (
// //             <View style={styles.balanceCard}>
// //               <Text style={styles.balanceUserName}>
// //                 {getUserName(item.userId, group.members)}
// //               </Text>
// //               <Text
// //                 style={[
// //                   styles.balanceAmount,
// //                   item.amount > 0 ? styles.positiveAmount : 
// //                   item.amount < 0 ? styles.negativeAmount : null,
// //                 ]}
// //               >
// //                 {formatCurrency(Math.abs(item.amount))}
// //               </Text>
// //               {item.amount !== 0 && (
// //                 <Text style={styles.balanceStatus}>
// //                   {item.amount > 0 ? 'gets back' : 'owes'}
// //                 </Text>
// //               )}
// //             </View>
// //           )}
// //         />
// //       </View>
      
// //       {/* Expenses Section */}
// //       <View style={[styles.section, { flex: 1 }]}>
// //         <Text style={styles.sectionTitle}>EXPENSES</Text>
        
// //         {sortedExpenses.length > 0 ? (
// //           <SectionList
// //             sections={sections}
// //             keyExtractor={(item) => item.id}
// //             renderSectionHeader={({ section: { title } }) => (
// //               <Text style={styles.expenseDateHeader}>{title}</Text>
// //             )}
// //             renderItem={({ item }) => (
// //               <TouchableOpacity style={styles.expenseCard}>
// //                 <View style={styles.expenseInfo}>
// //                   <Text style={styles.expenseTitle}>{item.title}</Text>
// //                   {item.description && (
// //                     <Text style={styles.expenseDescription}>{item.description}</Text>
// //                   )}
// //                   <Text style={styles.expenseBy}>
// //                     Paid by {getUserName(item.paidBy, group.members)} • {item.category}
// //                   </Text>
// //                 </View>
// //                 <View style={styles.expenseAmount}>
// //                   <Text style={styles.expenseAmountText}>
// //                     {formatCurrency(item.amount)}
// //                   </Text>
// //                 </View>
// //               </TouchableOpacity>
// //             )}
// //           />
// //         ) : (
// //           <View style={styles.emptyState}>
// //             <Text style={styles.emptyText}>No expenses yet</Text>
// //           </View>
// //         )}
// //       </View>
      
// //       {/* Add Expense Button */}
// //       <TouchableOpacity
// //         style={styles.addButton}
// //         onPress={handleAddExpense}
// //       >
// //         <Text style={styles.addButtonText}>+ Add Expense</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f8f9fa',
// //   },
// //   groupHeader: {
// //     backgroundColor: '#4A56E2',
// //     padding: 20,
// //     paddingBottom: 24,
// //   },
// //   groupName: {
// //     fontSize: 22,
// //     fontWeight: 'bold',
// //     color: '#ffffff',
// //     marginBottom: 4,
// //   },
// //   groupDescription: {
// //     fontSize: 14,
// //     color: 'rgba(255,255,255,0.8)',
// //   },
// //   section: {
// //     backgroundColor: '#ffffff',
// //     paddingVertical: 16,
// //     paddingHorizontal: 16,
// //     marginBottom: 16,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 1,
// //     elevation: 1,
// //   },
// //   sectionTitle: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#888',
// //     marginBottom: 12,
// //     textTransform: 'uppercase',
// //   },
// //   balanceCard: {
// //     padding: 12,
// //     marginRight: 8,
// //     borderRadius: 8,
// //     backgroundColor: '#f8f9fa',
// //     width: 120,
// //   },
// //   balanceUserName: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     marginBottom: 4,
// //   },
// //   balanceAmount: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     marginBottom: 2,
// //   },
// //   balanceStatus: {
// //     fontSize: 12,
// //     color: '#888',
// //   },
// //   positiveAmount: {
// //     color: '#4cd964',
// //   },
// //   negativeAmount: {
// //     color: '#ff3b30',
// //   },
// //   expenseDateHeader: {
// //     padding: 8,
// //     backgroundColor: '#f1f3f4',
// //     borderRadius: 4,
// //     marginVertical: 8,
// //     fontSize: 14,
// //     color: '#555',
// //   },
// //   expenseCard: {
// //     backgroundColor: '#ffffff',
// //     borderRadius: 8,
// //     padding: 16,
// //     marginBottom: 12,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 1,
// //     elevation: 1,
// //     flexDirection: 'row',
// //   },
// //   expenseInfo: {
// //     flex: 1,
// //   },
// //   expenseTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     marginBottom: 4,
// //   },
// //   expenseDescription: {
// //     fontSize: 14,
// //     color: '#666',
// //     marginBottom: 4,
// //   },
// //   expenseBy: {
// //     fontSize: 13,
// //     color: '#888',
// //   },
// //   expenseAmount: {
// //     justifyContent: 'center',
// //     alignItems: 'flex-end',
// //   },
// //   expenseAmountText: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// //   emptyState: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 20,
// //   },
// //   emptyText: {
// //     fontSize: 16,
// //     color: '#888',
// //   },
// //   addButton: {
// //     backgroundColor: '#4A56E2',
// //     padding: 16,
// //     margin: 16,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 4,
// //     elevation: 4,
// //   },
// //   addButtonText: {
// //     color: '#ffffff',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// // });

// // export default GroupDetailsScreen;