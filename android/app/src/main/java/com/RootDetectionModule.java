package com.shree.bangur;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class RootDetectionModule {

    // List of common root indicators
    private static final String[] ROOT_INDICATORS = {
        "/system/app/Superuser.apk",
        "/system/bin/su",
        "/system/xbin/su",
        "/system/sd/xbin/su",
        "/system/bin/failsafe/su",
        "/data/local/xbin/su",
        "/data/local/bin/su"
    };

    // Method to check for root indicators
    public boolean isDeviceRooted() {
        for (String indicator : ROOT_INDICATORS) {
            if (fileExists(indicator)) {
                return true;
            }
        }
        return false;
    }

    // Helper method to check if a file exists
    private boolean fileExists(String path) {
        try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
            return reader.readLine() != null;
        } catch (IOException e) {
            return false; // File does not exist or an error occurred
        }
    }

    // Main method for testing
    public static void main(String[] args) {
        RootDetectionModule rootDetection = new RootDetectionModule();
        if (rootDetection.isDeviceRooted()) {
            System.out.println("Device is rooted.");
        } else {
            System.out.println("Device is not rooted.");
        }
    }
}
