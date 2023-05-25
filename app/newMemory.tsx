import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link, useRouter } from "expo-router";
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker'
import { Image } from "react-native";
import * as SecureStore from 'expo-secure-store'
import { api } from "../src/lib/api";

export default function NewMemory() {

  const router = useRouter()

  const { bottom, top } = useSafeAreaInsets()

  const [isPublic, setIsPublic] = useState<boolean>(false)
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  async function openImagePicker() {
    try {

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      })

      if (result.assets[0]) {
        setPreview(result.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    if(preview) {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        uri: preview,
        name: 'image.jpg',
        type: 'image/jpeg'
      } as any)
      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })

      coverUrl = uploadResponse.data.fileUrl
    }

    await api.post('/memories', {
      content,
      isPublic,
      coverUrl,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    router.push('/memories')
  }

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
        <TouchableOpacity
          activeOpacity={0.6}
          className="h-36 justify-center items-center rounedd-lg border border-dashed boder-gray-500 bg-black/20"
          onPress={() => openImagePicker()}
        >
          {preview ? (<Image source={{ uri: preview }} className="h-full w-full rounded-lg object-cover" />) :
            (
              <View className="flex-row items-center gap-2">
                <Icon name="image" size={20} color="#fff" />
                <Text className="font-body text-sm text-gray-200">
                  Add photo or video
                </Text>
              </View>
            )}
        </TouchableOpacity>

        <TextInput
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
          multiline
          className="p-0 font-body text-lg text-gray-50"
          placeholderTextColor="#56565a"
          placeholder="Feel free to add photos, videos and stories about that experience you want to remember forever. It's your time capsule! 🚀"
        />

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-3 items-center self-end"
          onPress={() => handleCreateMemory()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}