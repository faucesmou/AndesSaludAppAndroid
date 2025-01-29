/* import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';


const QRScanner = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const devices = useCameraDevices();
  const device = devices.back;


  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });


  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      if (cameraPermission === ('authorized' as string)) {
        setHasPermission(true);
      } else {
        Alert.alert('Permiso denegado', 'Por favor habilita el acceso a la cámara en la configuración del dispositivo.');
        setHasPermission(false);
      }
    })();
  }, []);


  useEffect(() => {
    if (barcodes.length > 0) {
      const qrData = barcodes[0].displayValue; 
      if(qrData){

      try {
        const parsedData = JSON.parse(qrData);
        setScannedData(parsedData); 
        Alert.alert('QR Escaneado', `Datos: ${qrData}`);
      } catch (error) {
        setScannedData({ rawData: qrData }); 
        Alert.alert('QR Escaneado', `Datos (sin formato JSON): ${qrData}`);
      }
    }
    }
  }, [barcodes]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No tienes permiso para usar la cámara.</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>Cargando la cámara...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {scannedData ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Datos escaneados:</Text>
          <Text style={styles.resultText}>{JSON.stringify(scannedData, null, 2)}</Text>
        </View>
      ) : (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          frameProcessorFps={5} // Procesa 5 frames por segundo
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  resultContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});

export default QRScanner;
 */


/* import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Alert, StyleSheet, Button } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';

const QRScanner = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const cameraRef = useRef<Camera>(null);


  const devices = useCameraDevices();
  const device = devices.back;


  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);


  useEffect(() => {
    const requestPermission = async () => {
      const status = await Camera.requestCameraPermission();
      if (status === ('authorized' as string)) {
        setHasPermission(true);
      } else {
        Alert.alert(
          'Permiso denegado',
          'Necesitas conceder acceso a la cámara para escanear el QR.'
        );
        setHasPermission(false);
      }
    };

    requestPermission();
  }, []);


  useEffect(() => {
    if (barcodes.length > 0) {
      const qrInfo = barcodes[0].displayValue; 
      try {
        if(qrInfo){

          const jsonData = JSON.parse(qrInfo); 
          console.log('la información extraída y guardada en jsonData es: ===>>>', jsonData);
          
          setQrData(jsonData);
          Alert.alert('QR detectado', 'Información extraída correctamente.');
        }
        else{
          console.log('no hay qrData pibe');
          
        }
      } catch (error) {
        Alert.alert(
          'Error al leer el QR',
          'El código QR no contiene datos en formato JSON válido.'
        );
      }
    }
  }, [barcodes]);
 */
 
 







/* import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { Camera } from 'react-native-vision-camera';

const QrPermissions = () => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      if ( status === ('authorized' as string)) {
        setHasPermission(true);
        console.log('permiso para usar la cámara concedido bestia--->>>');
        
      } else {
        Alert.alert('Permiso denegado', 'No puedes usar la cámara sin conceder permisos.');
        setHasPermission(false);
      }
    })();
  }, []);

  return (
    <View>
      {hasPermission ? (
        <Text>Tienes permiso para usar la cámara.</Text>
      ) : (
        <Text>No tienes permiso para usar la cámara.</Text>
      )}
    </View>
  );
};

export default QrPermissions; */



/* import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

const QRScanner = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === ('authorized' as string));
    })();
  }, []);

  useEffect(() => {
    if (barcodes.length > 0) {
      const qrData = barcodes[0]?.displayValue;
      if (qrData) {
        Alert.alert('QR Detectado', `Información: ${qrData}`);
        // Aquí puedes procesar la información extraída del QR del DNI
      }
    }
  }, [barcodes]);

  if (device == null || !hasPermission) {
    return <Text>Cargando cámara o esperando permisos...</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default QRScanner; */
