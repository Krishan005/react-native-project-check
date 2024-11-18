package com.shree.bangur;
import com.appmattus.certificatetransparency.CTInterceptorBuilder;
import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.OkHttpClientProvider;

import com.facebook.react.modules.network.ReactCookieJarContainer;
import java.util.concurrent.TimeUnit;

import okhttp3.CertificatePinner;
import okhttp3.OkHttpClient;
import okhttp3.Request;

class SSLPinningFactory : OkHttpClientFactory {
    companion object {
        private const val hostname = "apisheecementuat.mjunction.in"
        private val sha256Keys = listOf("sha256/HYVBbIEdyjkQhisEE7VP4VzVN//qb+kLy96tAtrzFLY=")
    }
    override fun createNewNetworkModuleClient(): OkHttpClient {
        val certificatePinnerBuilder = CertificatePinner.Builder()
        for (key in sha256Keys) {
            certificatePinnerBuilder.add(hostname, key)
        }
        val certificatePinner = certificatePinnerBuilder.build()
        val clientBuilder = OkHttpClientProvider.createClientBuilder()
         return clientBuilder.certificatePinner(certificatePinner).addNetworkInterceptor(CTInterceptorBuilder().build()).build()
    }
}
