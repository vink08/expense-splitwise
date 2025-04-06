// components/MemberInput.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface MemberInputProps {
  onAdd: (name: string) => void;
}

const MemberInput: React.FC<MemberInputProps> = ({ onAdd }) => {
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter member name"
        onSubmitEditing={handleAdd}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAdd}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginRight: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4A56E2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default MemberInput;