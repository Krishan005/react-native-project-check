import { Platform } from "react-native";

export const OS_TYPE = Platform.OS == 'ios' ? "ios" : "android";
export const APP_VERSION = Platform.OS == 'ios' ? "0.0.1" : "0.0.1";
export const secretKey = 'AhaanKundu@20!9';

// UAT base url
export const URL = "https://apisheecementuat.mjunction.in";
const BASE_URL = "https://apisheecementuat.mjunction.in/api/v1";
export const AccessToken = '+ZpBzhQiTWxAmYYJ1nxWNytDdaq2ld4lqm8Ayl+aadlWrxhDYA93VAPDVoZAgIkQif4QgsD8kn4E4M14gzPA++nAZ7WZWc2b7sGT88jKrun5k2Qk3s3+BA==';
export const hashKey = "HYVBbIEdyjkQhisEE7VP4VzVN//qb+kLy96tAtrzFLY=";

// LIVE base url
/* const BASE_URL = "https://api.shreenirmanmitra.com/api/v1";
export const AccessToken = 'c04d4b2555455bc093e5a57b824b5ee9c25917ee'; */

export {BASE_URL};