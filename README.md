# Expense Tracker (Splitwise Clone)

A mobile application built with Expo and React Native that allows users to split expenses within groups, similar to Splitwise.

## Features

- **Group Management**: Create and join expense groups
- **Expense Tracking**: Add expenses to groups with detailed information and also we can add members
- **Split Options**: Split expenses equally or with custom percentages
- **Balance Tracking**: See how much you owe or are owed in each group
- **Total Balance**: View your overall balance across all groups
- **Persistent Storage**: All data is saved even after app close

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Zustand** for state management
- **AsyncStorage** for persistent data storage
- **React Navigation** for screen navigation

## Screens

- **Home Screen**: View all groups and total balance
- **Group Details**: View group expenses and individual balances
- **Add Expense**: Add a new expense to a group
- **Add Group**: Create a new expense group

## How to Use

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npx expo start` to start the development server
4. Use an emulator or scan the QR code with the Expo Go app on your device

## Project Structure

```
expense-tracker/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Screen components
│   ├── store/            # Zustand store for state management
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions and constants
├── App.tsx               # App entry point with navigation setup
└── package.json          # Dependencies and scripts
```


To build a production version:

```
npx expo prebuild
npx expo build:android  # For Android
npx expo build:ios      # For iOS (requires Mac)
``` 