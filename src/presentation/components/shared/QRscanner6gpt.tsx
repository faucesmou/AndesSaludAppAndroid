import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  Modal,
} from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type DNIData =  {
  numTram: string;
  apellido: string;
  nombre: string;
  dni: string;
  fechNacimiento: string;
  fecEmision: string;
};

const QRscanner6gpt = ({ onScanComplete }: { onScanComplete: (data: DNIData) => void }) => {


  const [isCameraVisible, setIsCameraVisible] = useState(false);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permiso para usar la cámara',
          message: 'Se requiere acceso a la cámara para escanear el QR de tu DNI',
          buttonPositive: 'Aceptar',
          buttonNegative: 'Cancelar',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // En iOS, los permisos son gestionados automáticamente por react-native-camera-kit
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      setIsCameraVisible(true);
    } else {
      Alert.alert('Permiso denegado', 'No se puede acceder a la cámara sin permisos.');
    }
  };

 
  const handleBarCodeRead = (event: any) => {
    console.log("se activó handleBarCodeRead");
    const scannedData = event.nativeEvent.codeStringValue;
    console.log("Código detectado:", scannedData);
  
    // Separar los datos por el carácter "@"
    const dataParts = scannedData.split("@");
  
    // Construir el objeto JSON ordenado
    const jsonData = {
      numTram: dataParts[0],
      apellido: dataParts[1],
      nombre: dataParts[2],
      dni: dataParts[4],
      fechNacimiento: dataParts[6],
      fecEmision: dataParts[7],
    };
  
    console.log("Datos estructurados:", jsonData);
  
    // Cerrar la cámara
    setIsCameraVisible(false);
  
    // Pasar los datos estructurados a onScanComplete
    onScanComplete(jsonData);

    
   /*  Alert.alert("Datos escaneados", "El código QR fue procesado correctamente."); */
  };
  
  

  const closeCamera = () => {
    console.log('se tocó en volver a la app');
    
    setIsCameraVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Botón para abrir la cámara */}
      <TouchableOpacity style={styles.scanButton} onPress={openCamera}>
        <Text style={styles.scanButtonText} onPress={openCamera}>Escanear DNI</Text>
      </TouchableOpacity>

      {/* Modal con la cámara */}
      <Modal visible={isCameraVisible} animationType="slide" onRequestClose={closeCamera}>
        <View style={styles.modalContainer}>
          {/* Cámara */}
          <View style={styles.cameraWrapper}>
            <Camera
              style={styles.camera}
              onReadCode={handleBarCodeRead}
              scanBarcode={true} 
              cameraType={CameraType.Back}
              flashMode="auto"
              focusMode="on"
              zoomMode="on"
            />
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={closeCamera}>
            <Text style={styles.closeButtonText} onPress={closeCamera}>Volver a la app</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
 
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 2,
    /* backgroundColor:'blue' */
  },
  scanButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    maxWidth: hp('20%'),
    minWidth: hp('15%'),
    elevation: 2,
  },
  scanButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#000',
  },
  cameraWrapper: {
    flex: 1,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  closeButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QRscanner6gpt;
