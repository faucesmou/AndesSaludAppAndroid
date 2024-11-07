package com.ar.andessalud.andessalud

import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import android.app.NotificationManager
import androidx.core.app.NotificationCompat
import android.util.Log

class FcmService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        remoteMessage.notification?.let {
            Log.d("FCM", "Cuerpo de la notificación del mensaje: ${it.body}")
            showNotification(it.title ?: "Notificación", it.body ?: "Nuevo mensaje")
        }

        remoteMessage.data.isNotEmpty().let {
            Log.d("FCM", "Carga útil de datos del mensaje: ${remoteMessage.data}")
        }
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d("FCM", "Nuevo Token FCM: $token")
    }

    private fun showNotification(title: String, message: String) {
        val notificationManager = getSystemService(NotificationManager::class.java)
        val notification = NotificationCompat.Builder(this, MainApplication.NOTIFICATION_CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(message)
            .setSmallIcon(R.drawable.logoBlanco3)  // Asegúrate de tener un icono en `res/drawable`
            .setAutoCancel(true)
            .build()
        notificationManager.notify(1, notification)
    }
}
