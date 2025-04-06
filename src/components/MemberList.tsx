// components/MemberList.tsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { User } from '../types';

type MemberListProps = {
  members: User[];
  currentUserId: string;
  showActions?: boolean;
  onRemove?: (id: string) => void;
};

const MemberList: React.FC<MemberListProps> = ({ 
  members, 
  currentUserId,
  showActions = false,
  onRemove
}) => {
  return (
    <View style={styles.container}>
      {members.map(member => (
        <View key={member.id} style={styles.memberItem}>
          <Text style={styles.memberName}>
            {member.name} 
            {member.id === currentUserId && ' (You)'}
          </Text>
          {showActions && onRemove && member.id !== currentUserId && (
            <TouchableOpacity 
              onPress={() => onRemove(member.id)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f1f3f4',
    borderRadius: 8,
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
});

export default MemberList;