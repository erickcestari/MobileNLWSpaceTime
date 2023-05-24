import React, { useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import blurBg from '../src/assets/bg-blur.png'
import { styled } from "nativewind";
import Stripes from '../src/assets/stripes.svg'
import { StatusBar } from "expo-status-bar";
import { Slot, Stack } from "expo-router";
import * as SecureStore from 'expo-secure-store'
import { View, Text } from 'react-native'

import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";
import { Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { useFonts } from "expo-font";


const StyledStripes = styled(Stripes)


export default function Layout() {

  const [isUserAuthenticated, setIsUserAuthenticate] = useState<null | boolean>(null)

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  useEffect(() => {
    SecureStore.getItemAsync('token').then(token => {
      setIsUserAuthenticate(!!token)
    })
  },[])

  if (!hasLoadedFonts) {
    return null
  }

  return(
    <ImageBackground
      source={blurBg}
      className="relative flex-1 items-center bg-gray-900 px-8 py-10 -z-50"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StyledStripes className="absolute left-0" />
      <StatusBar style="light" translucent />


        <Slot />
    </ImageBackground>
  )
}