import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import GroupDetailsScreen from './src/screens/GroupDetailsScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import AddGroupScreen from './src/screens/AddGroupScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.container}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4A56E2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Expense Tracker' }}
          />
          <Stack.Screen
            name="GroupDetails"
            component={GroupDetailsScreen}
            options={({ route }) => ({ title: 'Group Details' })}
          />
          <Stack.Screen
            name="AddExpense"
            component={AddExpenseScreen}
            options={{ title: 'Add Expense' }}
          />
          <Stack.Screen
            name="AddGroup"
            component={AddGroupScreen}
            options={{ title: 'Create New Group' }}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

