import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link } from "expo-router";
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

export default function NewMemory() {

  const { bottom, top } = useSafeAreaInsets()

  const [isPublic, setIsPublic] = useState<boolean>(false)

  return (
    <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}>
      <View className="flex-row items-center justify-between">
        <NLWLogo />
        <Link href='/memories' asChild>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            thumbColor={isPublic ? '#9b79ea' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#764fd0' }}
          />
          <Text className="font-body text-base text-gray-100">
            Make this memory public
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.6} className="h-36 justify-center items-center rounedd-lg border border-dashed boder-gray-500 bg-black/20">
          <View className="flex-row items-center gap-2">
            <Icon name="image" size={20} color="#fff" />
            <Text className="font-body text-sm text-gray-200">
              Add photo or video
            </Text>
          </View>
        </TouchableOpacity>

        <TextInput
          multiline
          className="p-0 font-body text-lg text-gray-50"
          placeholderTextColor="#56565a"
          placeholder="Feel free to add photos, videos and stories about that experience you want to remember forever. It's your time capsule! 🚀"
        />

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-3 items-center self-end"
        >
          <Text className="font-alt text-sm uppercase text-black">
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}