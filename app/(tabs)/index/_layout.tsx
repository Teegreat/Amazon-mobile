import { View, Text } from 'react-native'
import React from 'react'
import { StyledStack } from '@/components/navigation/stack'
import { Stack } from 'expo-router'

const Layout = () => {
  return (
    <StyledStack
      contentClassName="bg-gray-100 dark:bg-background"
      headerClassName="bg-dark text-white"
    >
      <Stack.Screen name="index" options={{ title: "" }} />
    </StyledStack>
  );
}

export default Layout