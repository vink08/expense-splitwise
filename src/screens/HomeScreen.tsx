



import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { groups, getTotalBalance, clearAllData } = useStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const totalBalance = getTotalBalance();

  // Initialize empty state if no groups exist
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      console.log("Current groups:", groups.length);
      
      if (groups.length === 0) {
        console.log("No groups exist - ready for user to create new ones");
      }
    }
  }, [groups.length, isInitialized]);

  const handleGroupPress = (groupId: string) => {
    navigation.navigate('GroupDetails', { groupId });
  };

  const handleAddGroup = () => {
    navigation.navigate('AddGroup');
  };
  
  const handleReset = () => {
    Alert.alert(
      "Reset App Data", 
      "This will delete all groups and expenses. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset", 
          style: "destructive",
          onPress: () => {
            clearAllData();
            setIsInitialized(false);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Balance Summary */}
      <View style={styles.balanceSummary}>
        <Text style={styles.balanceHeading}>YOUR TOTAL BALANCE</Text>
        <Text style={[
          styles.balanceAmount,
          totalBalance.amount > 0 ? styles.positiveAmount : 
          totalBalance.amount < 0 ? styles.negativeAmount : null
        ]}>
          {formatCurrency(Math.abs(totalBalance.amount))}
          {totalBalance.amount !== 0 && (
            <Text style={styles.balanceType}>
              {' '}
              {totalBalance.amount > 0 ? 'to be received' : 'to pay'}
            </Text>
          )}
        </Text>
        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>Reset App</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>YOUR GROUPS</Text>
        
        {groups.length > 0 ? (
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.groupCard}
                onPress={() => handleGroupPress(item.id)}
              >
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>{item.name}</Text>
                  <Text style={styles.groupMembers}>
                    {item.members.length} {item.members.length === 1 ? 'member' : 'members'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No groups yet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddGroup}
            >
              <Text style={styles.addButtonText}>+ Create Your First Group</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {groups.length > 0 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddGroup}
        >
          <Text style={styles.addButtonText}>+ New Group</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    balanceSummary: {
      backgroundColor: '#4A56E2',
      padding: 20,
      alignItems: 'center',
    },
    balanceHeading: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 14,
      marginBottom: 8,
    },
    balanceAmount: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    balanceType: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    positiveAmount: {
      color: '#4cd964',
    },
    negativeAmount: {
      color: '#ff3b30',
    },
    resetButton: {
      marginTop: 10,
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 4,
    },
    resetButtonText: {
      color: 'white',
      fontSize: 12,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#333',
    },
    groupCard: {
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    groupInfo: {
      flex: 1,
    },
    groupName: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 4,
    },
    groupMembers: {
      fontSize: 14,
      color: '#666',
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

export default HomeScreen;