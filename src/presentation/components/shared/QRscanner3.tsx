import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import Permissions from 'react-native-permissions';

const QRscanner3 = ({ onScanned }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permiso de Cámara',
            message: 'Necesitamos tu permiso para acceder a la cámara',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn(err);
      }
    };

    requestCameraPermission();
  }, []);

  const handleBarCodeRead = (event) => {
    setIsScanning(false);
    // Aquí puedes guardar los datos escaneados en un JSON o realizar otras acciones
    console.log('Datos escaneados:', event.nativeEvent.codeStringValue);
    onScanned(event.nativeEvent.codeStringValue); // Pasa los datos al componente padre
    Alert.alert('Datos guardados', 'El código QR ha sido escaneado correctamente.');
  };
  
  if (hasPermission === null) {
    return <View />;
  } else if (hasPermission === false) {
    return <Text>No tienes permiso para usar la cámara</Text>;
  } else {
    return (
      <View style={styles.container}>
        {isScanning ? (
          <Camera
            style={styles.camera}
            onReadCode={handleBarCodeRead}
            cameraType={CameraType.back}
            flashMode="auto"
          />
        ) : (
          <>
            <TouchableOpacity style={styles.scanButton} onPress={() => setIsScanning(true)}>
              <Text style={styles.buttonText}>Escanear DNI</Text>
            </TouchableOpacity>
            <Text style={styles.instructions}>Apunta la cámara al código QR de tu DNI</Text>
          </>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
  },
  scanButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  instructions: {
    color: 'gray',
    fontSize: 14,
  },
});

export default QRscanner3;