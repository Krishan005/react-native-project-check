import {
  Button,
  NativeBaseProvider,
  Select,
  Stack,
  Text,
  VStack,
} from 'native-base';
import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  APP_VERSION,
  AccessToken,
  BASE_URL,
  OS_TYPE,
  URL,
  hashKey,
} from '../auth_provider/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import i18n from '../assets/language/i18n';
import Toast from 'react-native-simple-toast';
import {
  MainStyle,
  baseColor,
  dangerColor,
  darkColor,
  darkGrey,
  fontBold,
  fontRegular,
  fontSemiBold,
  greyColor,
  lightColor,
  successColor,
  warningColor,
} from '../assets/MainStyle';

import CRC32 from 'crc-32';

import DeviceInfo, {useIsEmulator} from 'react-native-device-info';
import JailMonkey from 'jail-monkey';
import {isDeviceRooted} from 'react-native-detect-frida';
import {useFreeRasp} from 'freerasp-react-native';
import {fetch} from 'react-native-ssl-pinning';

const IntroScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [versionFound, setVersionFound] = React.useState(false);
  const [storeUrl, setStoreUrl] = React.useState('');
  const [currentLanguage, setLanguage] = React.useState('Eng');
  const [userType, setUserType] = React.useState('');
  const [foundEmulator, setFoundEmulator] = React.useState(false);
  const [deviceRooted, setDeviceRooted] = React.useState(false);
  const {isEmloading, isEmresult} = useIsEmulator();

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
        navigation.replace('Splash');
        BackHandler.exitApp();
        return true;
      } // Rooted or jailbroken detected
    }
    return false; // No signs of rooting or jailbreaking
  };

  const config = {
    androidConfig: {
      packageName: 'com.shree.bangur',
      certificateHashes: ['PeoyMZdegGTt62ZVAePnPZPgUr3UhmIomLodE4PqtFY='],
      supportedAlternativeStores: ['com.sec.android.app.shree.bangur'],
    },
    iosConfig: {
      appBundleId: 'com.shree.bangur',
      appTeamId: 'your_team_ID',
    },
    watcherMail: 'gourab.kundu@beas.co.in',
    isProd: true,
  };

  // reactions for detected threats
  const actions = {
    // Android & iOS
    privilegedAccess: () => {
      navigation.replace('Splash');
      //console.log('privilegedAccess'); //Rooted
      setDeviceRooted(true);
      BackHandler.exitApp();
    },
    // Android & iOS
    debug: () => {
      navigation.replace('Splash');
      //console.log('debug'); //Rooted
      setDeviceRooted(true);
      BackHandler.exitApp();
    },
    // Android & iOS
    simulator: () => {
      navigation.replace('Splash');
      //console.log('simulator'); //EMulator or Rooted
      setFoundEmulator(true);
      BackHandler.exitApp();
    },
    // Android & iOS
    appIntegrity: () => {
      navigation.replace('Splash');
      //console.log('appIntegrity'); //Rooted
      setDeviceRooted(true);
      BackHandler.exitApp();
    },
    // Android & iOS
    unofficialStore: () => {
      //console.log('unofficialStore');
    },
    // Android & iOS
    hooks: () => {
      navigation.replace('Splash');
      //console.log('hooks'); //Rooted
      setDeviceRooted(true);
      BackHandler.exitApp();
    },
    // Android & iOS
    deviceBinding: () => {
      navigation.replace('Splash');
      //console.log('deviceBinding'); //Rooted
      setDeviceRooted(true);
      BackHandler.exitApp();
    },
    // Android & iOS
    secureHardwareNotAvailable: () => {
      navigation.replace('Splash');
      //console.log('secureHardwareNotAvailable'); //Rooted
      setDeviceRooted(true);
      BackHandler.exitApp();
    },
    // Android & iOS
    systemVPN: () => {
      //console.log('systemVPN');
    },
    // Android & iOS
    passcode: () => {
      //console.log('passcode');
    },
    // iOS only
    deviceID: () => {
      //console.log('deviceID');
    },
    // Android only
    obfuscationIssues: () => {
      // console.log('obfuscationIssues');
    },
    // Android only
    devMode: () => {
      //console.log('devMode');
    },
  };

  useFreeRasp(config, actions);

  useEffect(() => {
    const checkRoot = async () => {
      const rooted = await checkForRootFiles();
      console.log('rooted: ', rooted);
      if (rooted) {
        setDeviceRooted(true);
        navigation.replace('Splash');
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
            navigation.replace('Splash');
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

  // useEffect(() => {
  //   const checkForFrida = async () => {
  //     const isFrida = await isDeviceRooted();

  //     if (isFrida) {
  //       console.log('Frida detected!', isFrida);
  //       navigation.replace('Splash');
  //       BackHandler.exitApp();
  //     } else {
  //       console.log('No Frida detected.');
  //     }
  //   };
  //   checkForFrida();
  // });

  useEffect(() => {
    const checkJailBreak = () => {
      if (
        JailMonkey.isJailBroken() ||
        JailMonkey.trustFall() ||
        JailMonkey.hookDetected() ||
        JailMonkey.canMockLocation()
      ) {
        console.log('rooted: true');
        setDeviceRooted(true);
        navigation.replace('Splash');
        BackHandler.exitApp();
      }
    };
    checkJailBreak();
  });

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
    setLoading(true);
    AsyncStorage.getItem('language').then(val => {
      if (val != null) {
        setLanguage(val);
        i18n
          .changeLanguage(val)
          .then(() => console.log(val))
          .catch(err => console.log(err));
      }
    });
    let formdata = new FormData();
    formdata.append('lang_code', currentLanguage);
    formdata.append('app_ver', `${APP_VERSION}`);
    formdata.append('os_type', `${OS_TYPE}`);
    fetch(`${BASE_URL}/app-version-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        accesstoken: `${AccessToken}`,
      },
      pkPinning: true,
      sslPinning: {
        certs: [
          'sha256/HYVBbIEdyjkQhisEE7VP4VzVN//qb+kLy96tAtrzFLY=',
          'sha256/SDG5orEv8iX6MNenIAxa8nQFNpROB/6+llsZdXHZNqs=',
          'sha256/i7WTqTvh0OioIruIfFR4kMPnBqrS2rdiVPl/s2uC/CY=',
        ],
      },
      body: formdata,
    })
      .then(response => response.json())
      .then(responseJson => {
        setLoading(false);
        console.log('verssion Check:', responseJson);
        if (responseJson.version_details.update_available == 0) {
          AsyncStorage.getItem('userToken').then(val => {
            if (val != null) {
              navigation.replace('Home');
            }
          });
        } else {
          setLoading(false);
          AsyncStorage.clear();
          setStoreUrl(responseJson.version_details.store_url);
          setVersionFound(true);
        }
      })
      .catch(error => {
        setLoading(false);
        if (error.toString().includes('Network request failed')) {
          console.log(
            'Secure connection error or network issue! Please try again later.',
          );
        }
        console.log('after login Error:', error);
      });
  }, []);

  const closeApp = () => {
    navigation.replace('Splash');
    BackHandler.exitApp();
  };

  const onSaveLang = val => {
    setLanguage(val);
    AsyncStorage.setItem('language', val);
    i18n
      .changeLanguage(val)
      .then(() => setLoading(true))
      .catch(err => console.log(err));
    setTimeout(function () {
      setLoading(false);
    }, 500);
  };

  const onContinueForVerssion = () => {
    Linking.openURL(storeUrl);
  };

  const goNext = (page, user) => {
    if (userType === '') {
      Toast.show(t('Please select Login As'), Toast.LONG);
    } else {
      navigation.replace('Login', {pageName: page, type: user});
    }
  };

  return (
    <NativeBaseProvider>
      <StatusBar barStyle="dark-content" backgroundColor={lightColor} />
      <VStack flex={1} backgroundColor={lightColor}>
        <ScrollView>
          <VStack space={5} alignItems="center">
            <Image
              source={require('../assets/images/construction.jpg')}
              style={{
                width: '100%',
                height: 400,
                resizeMode: 'cover',
                position: 'relative',
              }}
            />
            <Image
              source={require('../assets/images/logo.jpg')}
              style={MainStyle.logo}
            />
          </VStack>
          <VStack space={1} paddingX={10} paddingY={5}>
            <Text
              color={darkColor}
              fontFamily={fontBold}
              fontSize="md"
              textAlign="center">
              {t('Welcome to Nirman Mitra 2.0')}
            </Text>
            {/* <Text color={darkGrey} fontFamily={fontRegular} fontSize="xs" textAlign="center">{t("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non pulvinar ipsum. Etiam sodales.")}</Text> */}
            <Stack marginTop="4" space={3}>
              <View>
                <Text style={MainStyle.lable} fontSize="xs">
                  {t('Language')} <Text color={dangerColor}>*</Text>
                </Text>
                <View style={MainStyle.inputbox}>
                  <Select
                    variant="unstyled"
                    size="md"
                    height={43}
                    selectedValue={currentLanguage}
                    onValueChange={value => onSaveLang(value)}
                    style={{paddingLeft: 15}}
                    fontFamily={fontRegular}
                    dropdownCloseIcon={
                      <Icon
                        name="chevron-down-outline"
                        style={{marginRight: 10}}
                        size={20}
                      />
                    }
                    dropdownOpenIcon={
                      <Icon
                        name="chevron-up-outline"
                        style={{marginRight: 10}}
                        size={20}
                      />
                    }
                    _selectedItem={{
                      backgroundColor: greyColor,
                      endIcon: (
                        <Icon
                          name="checkmark-circle"
                          size={20}
                          color={successColor}
                          style={{right: 0, position: 'absolute'}}
                        />
                      ),
                    }}>
                    <Select.Item label="English" value="Eng" />
                    <Select.Item label="Hindi" value="Hn" />
                    <Select.Item label="Telugu" value="Te" />
                    <Select.Item label="Tamil" value="Ta" />
                    <Select.Item label="Malayalam" value="Ml" />
                    <Select.Item label="Kannada" value="Kn" />
                  </Select>
                </View>
              </View>
              <View>
                <Text style={MainStyle.lable} fontSize="xs">
                  {t('Login As')} <Text color={dangerColor}>*</Text>
                </Text>
                <View style={MainStyle.inputbox}>
                  <Select
                    variant="unstyled"
                    size="md"
                    height={43}
                    selectedValue={userType}
                    onValueChange={value => setUserType(value)}
                    style={{paddingLeft: 15}}
                    placeholder={t('Select')}
                    fontFamily={fontRegular}
                    dropdownCloseIcon={
                      <Icon
                        name="chevron-down-outline"
                        style={{marginRight: 10}}
                        size={20}
                      />
                    }
                    dropdownOpenIcon={
                      <Icon
                        name="chevron-up-outline"
                        style={{marginRight: 10}}
                        size={20}
                      />
                    }
                    _selectedItem={{
                      backgroundColor: greyColor,
                      endIcon: (
                        <Icon
                          name="checkmark-circle"
                          size={20}
                          color={successColor}
                          style={{right: 0, position: 'absolute'}}
                        />
                      ),
                    }}>
                    <Select.Item label="Contractor" value="Contractor" />
                    <Select.Item label="Dealer" value="Dealer" />
                    <Select.Item label="TSO" value="TSO" />
                    <Select.Item label="TTO" value="TTO" />
                    <Select.Item label="STH" value="STH" />
                  </Select>
                </View>
              </View>
              <VStack space={2} marginTop={4}>
                <Button
                  style={MainStyle.solidbtn}
                  onPress={() => goNext('Sign In', userType)}>
                  <Text
                    color={lightColor}
                    fontFamily={fontSemiBold}
                    fontSize="sm">
                    {t('Sign In')}
                  </Text>
                </Button>
                {userType == 'Contractor' && (
                  <Button
                    variant="unstyled"
                    style={MainStyle.outlinebtn}
                    onPress={() => goNext('Sign Up', userType)}>
                    <Text
                      color={baseColor}
                      fontFamily={fontSemiBold}
                      fontSize="sm">
                      {t('Sign Up')}
                    </Text>
                  </Button>
                )}
              </VStack>
            </Stack>
          </VStack>
        </ScrollView>
      </VStack>
      {versionFound && (
        <View style={MainStyle.spincontainer}>
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
            <Text mt={5} mb={3} fontSize="xl" fontWeight="bold" color="#111111">
              {t('Update Warning')}!
            </Text>
            <Text
              textAlign="center"
              fontSize="sm"
              fontWeight="medium"
              color="#111111"
              mb={3}>
              {t(
                'App need Update to the Latest Version. Please click on Update Now button to Continue',
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
              onPress={() => onContinueForVerssion()}
              marginY={4}>
              <Text color="#ffffff" fontSize="sm" fontWeight="medium">
                {t('Update Now')}
              </Text>
            </Button>
          </VStack>
        </View>
      )}
      {loading && (
        <View style={MainStyle.spincontainer}>
          <ActivityIndicator
            animating={loading}
            size="large"
            color={warningColor}
          />
        </View>
      )}
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

const styles = StyleSheet.create({});

export default IntroScreen;
