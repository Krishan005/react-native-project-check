import { StyleSheet } from "react-native";

export const baseColor = "#2A358B";
export const baseLightColor = "#fbf9fe";
export const baseSemiColor = "#ebedff";
export const dangerColor = "#DA4C51";
export const successColor = "#4BA54D";
export const warningColor = "#ff7300";
export const lightColor = "#ffffff";
export const darkColor = "#000000";
export const greyColor = "#DFDFDF";
export const lightGrey = "#F4F4F4";
export const darkGrey = "#707274";

export const fontRegular = "Mulish-Regular";
export const fontBold = "Mulish-Bold";
export const fontSemiBold = "Mulish-SemiBold";

const MainStyle = StyleSheet.create({
    spincontainer: { position: 'absolute', zIndex: 99, left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(1, 3, 27, 0.9)' },
    logo: { height: 50, resizeMode: 'contain' },
    lable: { fontFamily: fontSemiBold, color: darkColor, marginBottom: 5 },
    inputbox: { backgroundColor: lightColor, borderColor: greyColor, borderWidth: 1, borderRadius: 8, width: '100%', position: 'relative', overflow: 'hidden' },
    solidbtn: { height: 45, backgroundColor: baseColor, borderRadius: 8, overflow: 'hidden' },
    outlinebtn: { height: 43, borderColor: baseColor, borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
    pagibox: { width: 35, height: 35, borderRadius: 30 },
    popbox: { width: '80%', backgroundColor: "#fcfcfc", borderRadius: 15, overflow: 'hidden', minHeight: 300, justifyContent: 'center', alignItems: 'center', padding: 30 },
    quickbox: { width: '29.33%', padding: 2, height: 125, borderColor: greyColor, borderWidth: 1, borderRadius: 12, margin: '2%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    quickicon: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#eeeeee", marginBottom: 5 },
    tabbtn: {borderTopLeftRadius: 8, borderTopRightRadius: 8, overflow: 'hidden' , borderRadius: 0, width: '24%'}
});

export { MainStyle };