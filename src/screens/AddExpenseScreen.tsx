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
  Switch,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useStore } from '../store/useStore';
import { CATEGORIES, getUserName, formatCurrency } from '../utils';

type Props = NativeStackScreenProps<RootStackParamList, 'AddExpense'>;

const AddExpenseScreen: React.FC<Props> = ({ navigation, route }) => {
  const { groupId } = route.params;
  const { getGroup, addExpense, currentUser } = useStore();
  
  const group = getGroup(groupId);
  
  if (!group) {
    return (
      <View style={styles.container}>
        <Text>Group not found</Text>
      </View>
    );
  }
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [paidBy, setPaidBy] = useState(currentUser.id);
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [customSplit, setCustomSplit] = useState<{ [key: string]: string }>(
    group.members.reduce((acc: Record<string, string>, member) => {
      acc[member.id] = (100 / group.members.length).toFixed(2);
      return acc;
    }, {} as Record<string, string>)
  );
  
  const handleSelectCategory = (selectedCategory: string) => {
    setCategory(selectedCategory);
  };
  
  const handleSplitTypeChange = (isCustom: boolean) => {
    setSplitType(isCustom ? 'custom' : 'equal');
    
    // Reset the split to equal when switching to equal
    if (!isCustom) {
      const equalShare = (100 / group.members.length).toFixed(2);
      const newSplit = group.members.reduce((acc: Record<string, string>, member) => {
        acc[member.id] = equalShare;
        return acc;
      }, {} as Record<string, string>);
      setCustomSplit(newSplit);
    }
  };
  
  const handleCustomSplitChange = (userId: string, value: string) => {
    setCustomSplit((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };
  
  const validateCustomSplit = () => {
    const total = Object.values(customSplit).reduce(
      (sum, val) => sum + parseFloat(val || '0'),
      0
    );
    return Math.abs(total - 100) < 0.01; // Account for floating point precision
  };
  
  const handleAddExpense = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an expense title');
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    if (splitType === 'custom' && !validateCustomSplit()) {
      Alert.alert('Error', 'Custom split must add up to 100%');
      return;
    }
    
    // Convert string percentage values to numbers for storage
    const shares = Object.entries(customSplit).reduce(
      (acc: Record<string, number>, [userId, value]) => {
        acc[userId] = parseFloat(value || '0');
        return acc;
      },
      {} as Record<string, number>
    );
    
    addExpense(groupId, {
      title: title.trim(),
      description: description.trim() || undefined,
      amount: parseFloat(amount),
      paidBy,
      category,
      date: Date.now(),
      split: {
        type: splitType,
        shares,
      },
    });
    
    navigation.goBack();
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.content}>
        {/* Basic Expense Details */}
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Dinner"
          autoFocus
        />
        
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add some details about this expense"
          multiline
          numberOfLines={2}
          textAlignVertical="top"
        />
        
        <Text style={styles.label}>Amount *</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="0"
          keyboardType="numeric"
        />
        
        {/* Category Selection */}
        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                category === cat && styles.categoryChipSelected,
              ]}
              onPress={() => handleSelectCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  category === cat && styles.categoryChipTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Paid By Selection */}
        <Text style={styles.label}>Paid By</Text>
        <View style={styles.paidByContainer}>
          {group.members.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={[
                styles.paidByChip,
                paidBy === member.id && styles.paidByChipSelected,
              ]}
              onPress={() => setPaidBy(member.id)}
            >
              <Text
                style={[
                  styles.paidByChipText,
                  paidBy === member.id && styles.paidByChipTextSelected,
                ]}
              >
                {member.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Instructions for adding more members */}
        <Text style={styles.helperText}>
          Note: Members are automatically added to the group when you create the group or add expenses. 
          There is no separate "add member" function.
        </Text>
        
        {/* Split Type */}
        <View style={styles.splitTypeContainer}>
          <Text style={styles.label}>Split Type</Text>
          <View style={styles.splitTypeToggle}>
            <Text>Equal</Text>
            <Switch
              value={splitType === 'custom'}
              onValueChange={handleSplitTypeChange}
              trackColor={{ false: '#d1d1d1', true: '#4A56E2' }}
              thumbColor={splitType === 'custom' ? '#ffffff' : '#f4f3f4'}
            />
            <Text>Custom</Text>
          </View>
        </View>
        
        {/* Split Details */}
        <View style={styles.splitContainer}>
          {group.members.map((member) => (
            <View key={member.id} style={styles.splitRow}>
              <Text style={styles.splitName}>{member.name}</Text>
              {splitType === 'equal' ? (
                <Text style={styles.splitValue}>
                  {(100 / group.members.length).toFixed(2)}%
                </Text>
              ) : (
                <TextInput
                  style={styles.splitInput}
                  value={customSplit[member.id]}
                  onChangeText={(value) => handleCustomSplitChange(member.id, value)}
                  keyboardType="numeric"
                  placeholder="0"
                  maxLength={5}
                />
              )}
            </View>
          ))}
          
          {splitType === 'custom' && (
            <Text style={[
              styles.splitTotal,
              !validateCustomSplit() && styles.splitTotalError,
            ]}>
              Total: {Object.values(customSplit).reduce(
                (sum, val) => sum + parseFloat(val || '0'),
                0
              ).toFixed(2)}%
              {!validateCustomSplit() && ' (must be 100%)'}
            </Text>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            (!title.trim() || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) &&
              styles.buttonDisabled,
          ]}
          onPress={handleAddExpense}
          disabled={!title.trim() || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
        >
          <Text style={styles.buttonText}>Add Expense</Text>
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
    height: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#4A56E2',
  },
  categoryChipText: {
    color: '#555',
  },
  categoryChipTextSelected: {
    color: '#ffffff',
  },
  paidByContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  paidByChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
    marginRight: 8,
    marginBottom: 8,
  },
  paidByChipSelected: {
    backgroundColor: '#4A56E2',
  },
  paidByChipText: {
    color: '#555',
  },
  paidByChipTextSelected: {
    color: '#ffffff',
  },
  helperText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 16,
  },
  splitTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  splitTypeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  splitContainer: {
    marginBottom: 16,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  splitName: {
    fontSize: 16,
  },
  splitValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  splitInput: {
    backgroundColor: '#f1f3f4',
    borderRadius: 8,
    padding: 8,
    width: 80,
    textAlign: 'center',
  },
  splitTotal: {
    marginTop: 8,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '600',
  },
  splitTotalError: {
    color: '#ff3b30',
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

export default AddExpenseScreen; 