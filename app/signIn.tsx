import {
  isClerkAPIResponseError,
  useSignIn,
  useSignUp,
} from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "please enter your password"),
});

type SignInForm = z.infer<typeof signInSchema>;

const SignInScreen = () => {
  const { isLoaded: isLoadedSignUp, signUp } = useSignUp();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [showPassword, setShowpassword] = useState(false);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "teewebbby64@gmail.com", password: "toyin3366" },
  });

  const onSubmit = async (data: SignInForm) => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.dismissTo("/(tabs)/profile");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      if (isClerkAPIResponseError(error)) {
        const errors = error.errors;
        if (errors[0].code === "form_identifier_not_found") {
          createAccount(data);
        } else {
          Alert.alert("Error", "An error occured while signing in");
        }
      }
    }
  };

  const createAccount = async (data: SignInForm) => {
    if (!isLoadedSignUp) return;

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      router.dismissTo("/(tabs)/profile");
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  const signInWithPassKey = async () => {};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <View className="p-4">
        <Text className="text-2xl font-bold mb-2">
          Sign in or create an account
        </Text>
        <Text className="text-base font-medium mb-2">
          Enter mobile number or email
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Mobile number or email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white"
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 mb-2">{errors.email.message}</Text>
        )}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter your password"
              autoCorrect={false}
              secureTextEntry={!showPassword}
              textContentType="password"
              autoCapitalize="none"
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white"
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500 mb-2">{errors.password.message}</Text>
        )}

        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={() => setShowpassword((prev) => !prev)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: showPassword }}
          testID="show-password-checkbox"
        >
          <View
            className={`w-5 h-5 rounded border border-gray-400 mr-2 items-center justify-center ${showPassword ? "bg-green-100 border-green-600" : "bg-white"}`}
          >
            {showPassword && <View className="w-3 h-3 bg-green-600 rounded" />}
          </View>
          <Text className="text-base">Show password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-yellow-400 py-3 rounded-full items-center mb-4 "
        >
          <Text className="text-center text-lg font-medium text-black">
            Sign in
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center mb-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-2 text-gray-500">Or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        <TouchableOpacity
          onPress={signInWithPassKey}
          className="py-3 rounded-full items-center mb-6 border border-gray-400 bg-white"
        >
          <Text className="text-center text-lg font-medium text-black">
            Sign in with a passkey
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
