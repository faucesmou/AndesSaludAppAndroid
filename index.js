/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';  // Asegúrate de importar Firebase Messaging
import {Alert, Modal, View, Text, TouchableOpacity} from 'react-native';  // Importar Alert para mostrar las notificaciones
/* import App from './src/App'; */
import {name as appName} from './app.json';
import { App } from './src/App';
import styles from './src/presentation/theme/theme.ts'; 
//let isModalVisible = false; // Cambia según el estado de la app

// Función para mostrar el Modal
/* const showMessageInModal = (title, body, extraInfo) => {
  isModalVisible = true;
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isModalVisible}
      onRequestClose={() => isModalVisible = false}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{body}</Text>
          <Text style={styles.modalMessage}>Información adicional: {extraInfo}</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => isModalVisible = false}  // Puedes mejorar el manejo del cierre del modal según el estado
          >
            <Text style={styles.buttonTextModal}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}; */

// Establece el background message handler
/* messaging().setBackgroundMessageHandler(async remoteMessage => {
  try {
    console.log('Mensaje recibido en segundo plano!---->:', remoteMessage);

    // Verificar si hay datos y si contienen la clave `default`
    if (remoteMessage.data?.default) {
      const data = JSON.parse(remoteMessage.data.default); // Parsear el JSON principal

      if (data.GCM) {
        const gcmData = JSON.parse(data.GCM); // Parsear la parte de `GCM`

        // Extraer título, cuerpo y extraInfo
        const title = gcmData.notification?.title || "Notificación de Andes Salud";
        const body = gcmData.notification?.body || "Tienes un nuevo mensaje";
        const extraInfo = gcmData.data?.extraInfo || "";

        // Mostrar el mensaje en un modal con la información estructurada
        showMessageInModal(title, body, extraInfo);
      }
    } else {
      console.warn("El mensaje no contiene datos en el formato esperado.");
    }
  } catch (error) {
    console.error("Error al procesar el mensaje desde Index.js:", error);
  }
}); */

// Registrar el componente principal de la app

/* const AppContainer = () => {
    // Define estados para almacenar datos y controlar la visibilidad del modal
    const [gcmData, setGcmData] = useState(null);
    const [isModalVisibleNotificacion, setModalVisibleNotificacion] = useState(false);
  
    useEffect(() => {
      // Configura el manejador de mensajes en segundo plano
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        try {
          console.log('Mensaje recibido en segundo plano:', remoteMessage);
          
          if (remoteMessage.data?.default) {
            const data = JSON.parse(remoteMessage.data.default);
            
            if (data.GCM) {
              const gcmDataParsed = JSON.parse(data.GCM);
              const title = gcmDataParsed.notification?.title || "Notificación de Andes Salud";
              const body = gcmDataParsed.notification?.body || "Tienes un nuevo mensaje";
              const extraInfo = gcmDataParsed.data?.extraInfo || "";
              
              // Guarda los datos en el estado y muestra el modal
              setGcmData({ title, body, extraInfo });
              setModalVisibleNotificacion(true);
            }
          } else {
            console.warn("El mensaje no contiene datos en el formato esperado.");
          }
        } catch (error) {
          console.error("Error al procesar el mensaje:", error);
        }
      });
    }, []);
  
    return (
      <>
        <App />
        {isModalVisibleNotificacion && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={isModalVisibleNotificacion}
            onRequestClose={() => setModalVisibleNotificacion(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>{gcmData?.title}</Text>
                <Text style={styles.modalMessage}>{gcmData?.body}</Text>
                <Text style={styles.modalMessage}>{gcmData?.extraInfo}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setModalVisibleNotificacion(false)}
                >
                  <Text style={styles.buttonText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </>
    );
  };
   */
  // Define estilos
/*   const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 10,
      color: '#ff5c5c',
    },
    modalMessage: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      color: '#333',
    },
    button: {
      backgroundColor: '#ff5c5c',
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  }); */


AppRegistry.registerComponent(appName, () => App);
