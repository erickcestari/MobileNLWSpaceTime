import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link, useRouter} from "expo-router";
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from 'expo-secure-store'
import { Image } from "react-native";
import { useEffect, useState }from 'react'
import { api } from "../src/lib/api";
import dayjs from "dayjs";

interface Memory {
  coverUrl: string
  content: string
  excerpt: string
  id: string
  createdAt: string
}

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>()

  async function signOut() {
    SecureStore.deleteItemAsync('token')

    router.push('/')
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token')

    const response = await api.get('/memories', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log(response.data)
    setMemories(response.data)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  return (
    <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}>
      <View className="flex-row items-center justify-between">
        <NLWLogo />
        <View className="flex-row gap-2">
        <TouchableOpacity onPress={signOut} className="w-10 h-10 items-center justify-center rounded-full bg-red-500">
              <Icon name="log-out" size={16} color="#000" />
        </TouchableOpacity>
          <Link href='/newMemory' asChild>
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="mt-6 space-y-10">
        {memories?.map((memory) => (
        <View className="space-y-4" key={memory.id}>
          <View className="flex-row items-center gap-2">
            <View className="h-px w-5 bg-gray-50"/>
            <Text className="font-body text-xs text-gray-100">
              {dayjs(memory.createdAt).format("DD MMMM YYYY")}
            </Text>
          </View>
          <View className="space-y-4">
            <Image 
            source={{uri: memory.coverUrl}}
            className="aspect-video w-full rounded-lg"
            />
            <Text className="font-body text-base leading-relaxed text-gray-100">
              {memory.excerpt}
            </Text>
            <Link href="/memories/id" asChild>
              <TouchableOpacity className="flex-row items-center gap-2">
                <Text className="font-body text-sm text-gray-200">Read More</Text>
                <Icon name="arrow-right" size={16} color="#9e9ea0"/>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
        ))}
      </View>
    </ScrollView>
  )
}