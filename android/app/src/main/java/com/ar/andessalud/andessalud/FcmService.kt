package com.ar.andessalud.andessalud

import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import android.util.Log

class FcmService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        // Check if the message contains a notification payload
        remoteMessage.notification?.let {
            Log.d("FCM", "Cuerpo de la notificación del mensaje-->>: ${it.body}")
        }

        // Check if the message contains a data payload
        remoteMessage.data.isNotEmpty().let {
            Log.d("FCM", "Carga útil de datos del mensaje-->>: ${remoteMessage.data}")
        }
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d("FCM", "Nuevo Token FCM: $token")
    }
}
