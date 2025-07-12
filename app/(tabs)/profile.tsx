import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import React from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const createClerkPasskey = async () => {
    try {
      await user?.createPasskey();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View className="flex-1">
      <SignedOut>
        <View className="pt-10 px-8 items-center">
          <Text className="text-3xl text-center">
            Sign in for the optimal experience
          </Text>
        </View>

        <View className="mt-8 w-full px-8">
          <Link href="/signIn" asChild>
            <TouchableOpacity className="bg-primary py-3 border border-dark">
              <Text className="text-center">Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SignedOut>

      <SignedIn>
        <View className="pt-10 px-8 items-center flex gap-3 ">
          <Text className="text-3xl text-center">You are signed in</Text>
          <Button title="Create Passkey" onPress={createClerkPasskey} />
          <Button title="Sign out" onPress={() => signOut()} />
        </View>
      </SignedIn>
    </View>
  );
};

export default Profile;
