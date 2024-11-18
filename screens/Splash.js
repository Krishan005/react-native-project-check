import React, {useEffect} from 'react';
import {
  Alert,
  BackHandler,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {
  Button,
  NativeBaseProvider,
  Stack,
  Text,
  View,
  VStack,
} from 'native-base';
import {dangerColor, lightColor, MainStyle} from '../assets/MainStyle';
import {useTranslation} from 'react-i18next';
import {URL} from '../auth_provider/Config';

import DeviceInfo, {useIsEmulator} from 'react-native-device-info';
import JailMonkey from 'jail-monkey';
import { isDeviceRooted } from 'react-native-detect-frida';
import Jailbreak from 'react-native-jailbreak';
import { AppSecurity } from '@sleiv/react-native-app-security';

const SplashScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [foundEmulator, setFoundEmulator] = React.useState(false);
  const [deviceRooted, setDeviceRooted] = React.useState(false);
  const {loading, isEmresult} = useIsEmulator();

  const checkForRootFiles = async () => {
    var RNFS = require('react-native-fs');
    const pathsToCheck = [
      '/system/app/Superuser.apk', // Android rooted device check
      '/system/xbin/su', // Android su binary check
      '/bin/bash', // Common on Linux-based (Android) systems
      '/Applications/Cydia.app', // iOS check for Cydia (jailbroken)
    ];

    for (let path of pathsToCheck) {
      const exists = await RNFS.exists(path);
      if (exists) {
        console.log('rooted: true');
        setDeviceRooted(true);
        BackHandler.exitApp();
        return true;
      } // Rooted or jailbroken detected
    }
    return false; // No signs of rooting or jailbreaking
  };

  useEffect(() => {
    const checkRoot = async () => {
      const rooted = await checkForRootFiles();
      console.log('rooted: ', rooted);
      if (rooted) {
        setDeviceRooted(true);
        BackHandler.exitApp();
      }
    };
    checkRoot();
  }, []);

  useEffect(() => {
    const checkProxy = async () => {
      try {
        const response = await fetch(`${URL}`);
        if (response.headers) {
          const headers = response.headers;
          // Check for common proxy headers
          if (headers.has('X-Forwarded-For') || headers.has('Via')) {
            console.log('Proxy detected via headers');
            BackHandler.exitApp();
          } else {
            console.log('No proxy detected');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    checkProxy();
  });

  useEffect(() => {
    const checkForFrida = async () => {
      const isFrida = await isDeviceRooted();
      if (isFrida) {
        console.log('Frida detected!', isFrida);
        BackHandler.exitApp();
      } else {
        console.log('No Frida detected.');
      }
    };
    checkForFrida();
  });

  // useEffect(() => {
  //   const checkJailBreak = () => {
  //     if (
  //       JailMonkey.isJailBroken() ||
  //       JailMonkey.trustFall() ||
  //       JailMonkey.hookDetected() ||
  //       JailMonkey.canMockLocation()
  //     ) {
  //       console.log('rooted: true');
  //       setDeviceRooted(true);
  //       BackHandler.exitApp();
  //     }
  //   };
  //   checkJailBreak();
  // });

    useEffect(() => {
    const checkJailBreak = async () => {
      const isJailBroken = await Jailbreak.check(); 
      const isRooted = await AppSecurity.isDeviceRooted();
      if (isJailBroken || isRooted) {
        console.log('Device is jailbroken');
        BackHandler.exitApp();
      }
    };

    checkJailBreak();
  }, []);

  useEffect(() => {
    if (!isEmresult) {
      const checkEmulator = async () => {
        const isEmulator = await DeviceInfo.isEmulator();
        const brand = await DeviceInfo.getBrand();
        const model = await DeviceInfo.getModel();
        const systemName = await DeviceInfo.getSystemName();

        // Add additional checks as needed
        if (
          isEmulator ||
          brand === 'generic' ||
          brand.includes('sdk') ||
          model.includes('Emulator') ||
          model.includes('Android SDK built for x86')
        ) {
          setFoundEmulator(true);
          return true; // Running on an emulator
        }
        return false; // Running on a real device
      };
      checkEmulator();
    } else {
      setFoundEmulator(true);
    }
  }, []);

  useEffect(() => {
    if (!foundEmulator && !deviceRooted) {
      setTimeout(function () {
        //navigation.replace('Intro');
      }, 2800);
    }
    /* if (checkEmulator) {
            isEmulator().then(isEmu => {
                if (isEmu) {
                    checkForFrida();
                    setFoundEmulator(true);
                    AsyncStorage.clear();
                } else {
                    setTimeout(function () {
                        navigation.replace('Intro');
                    }, 2800);
                }
            });
        } else {
            setTimeout(function () {
                navigation.replace('Intro');
            }, 2800);
        } */
  }, []);

  const closeApp = () => {
    BackHandler.exitApp();
  };

  return (
    <NativeBaseProvider>
      <StatusBar barStyle="dark-content" backgroundColor={lightColor} />
      <ImageBackground
        source={require('../assets/images/splash.gif')}
        imageStyle={{
          resizeMode: 'cover',
          position: 'absolute',
          bottom: 0,
          top: 0,
          opacity: 1,
        }}
        style={styles.bgimage}
      />
      {foundEmulator && (
        <View style={MainStyle.spincontainer}>
          <Stack
            backgroundColor="#ffffff"
            style={{width: '70%', borderRadius: 10, overflow: 'hidden'}}>
            <VStack
              space={1}
              w="100%"
              paddingY="10"
              paddingX="5"
              alignItems="center"
              justifyContent="center">
              <Image
                source={require('../assets/images/logo.jpg')}
                style={MainStyle.logo}
              />
              <Text
                mt={5}
                mb={3}
                fontSize="xl"
                fontWeight="bold"
                color={dangerColor}>
                {t('Alert')}!
              </Text>
              <Text
                textAlign="center"
                fontSize="sm"
                fontWeight="medium"
                color="#111111"
                mb={3}>
                {t(
                  'This App run on Emulator. Please run in Real Device to use this App',
                )}
                ...
              </Text>
              <Button
                size="sm"
                style={{
                  backgroundColor: '#111111',
                  width: 150,
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
                onPress={() => closeApp()}
                marginY={4}>
                <Text color="#ffffff" fontSize="sm" fontWeight="medium">
                  {t('Close')}
                </Text>
              </Button>
            </VStack>
          </Stack>
        </View>
      )}
      {deviceRooted && (
        <View style={MainStyle.spincontainer}>
          <Stack
            backgroundColor="#ffffff"
            style={{width: '70%', borderRadius: 10, overflow: 'hidden'}}>
            <VStack
              space={1}
              w="100%"
              paddingY="10"
              paddingX="5"
              alignItems="center"
              justifyContent="center">
              <Image
                source={require('../assets/images/logo.jpg')}
                style={MainStyle.logo}
              />
              <Text
                mt={5}
                mb={3}
                fontSize="xl"
                fontWeight="bold"
                color={dangerColor}>
                {t('Alert')}!
              </Text>
              <Text
                textAlign="center"
                fontSize="sm"
                fontWeight="medium"
                color="#111111"
                mb={3}>
                {t(
                  'This is an Rooted Device. Please run in Unrooted Device to use this App',
                )}
                ...
              </Text>
              <Button
                size="sm"
                style={{
                  backgroundColor: '#111111',
                  width: 150,
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
                onPress={() => closeApp()}
                marginY={4}>
                <Text color="#ffffff" fontSize="sm" fontWeight="medium">
                  {t('Close')}
                </Text>
              </Button>
            </VStack>
          </Stack>
        </View>
      )}
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  bgimage: {flex: 1, justifyContent: 'center'},
});

export default SplashScreen;
