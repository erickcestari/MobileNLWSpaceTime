import { View, Text, TouchableOpacity } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import Stripes from '../src/assets/stripes.svg'
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { styled } from 'nativewind'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { useEffect } from 'react'
import { api } from '../src/lib/api'
import { useRouter } from 'expo-router'

const StyledStripes = styled(Stripes)

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndPoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/6aaaaf9c0813031c9cb7'
}

export default function App() {

  const router = useRouter()

 
  
  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '6aaaaf9c0813031c9cb7',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'NLWspacetime',
    }),
    },
    discovery,
  )

  async function handleGithubOAuthCode(code: string){
    const response = await api.post('/register', { code })
    const { token } = response.data
    await SecureStore.setItemAsync('token', token)

    router.push('/newMemory')
  }
  useEffect(() => {
    /*
          console.log(makeRedirectUri({
            scheme: 'NLWspacetime'
          }))
          */
    if(response?.type === 'success'){
      const { code } = response.params
      handleGithubOAuthCode(code)
      
    }
  },[response])

  
  

  return (
    <View
      className="flex-1 items-center"
    >
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Your time capsule
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Collect memorable moments from your journey and share (if you like)
            with the world!
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-3"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Register Memory
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW Rockseat
      </Text>

      
    </View>
  )
}
