/* import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { TouchableOpacity } from 'react-native-gesture-handler';

const QRscanner1 = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);

    const handleBarCodeRead = (result:any) => {
        setIsScanning(false);
        setScannedData(result.data);
    };

    return (
        <View style={styles.container}>
            {isScanning ? (
                <RNCamera
                    style={styles.camera}
                    onBarCodeRead={handleBarCodeRead}
                    type={RNCamera.Constants.Type.back}
                    androidCameraPermissionOptions={{
                        title: 'Permiso de cámara',
                        message: 'Esta aplicación necesita acceso a tu cámara para escanear el código QR de tu DNI',
                        buttonPositive: 'Aceptar',
                        buttonNegative: 'Cancelar',
                    }}
                />
            ) : (
                <View style={styles.scanButton}>
                    <TouchableOpacity onPress={() => setIsScanning(true)}>
                        <Text>Iniciar escaneo</Text>
                    </TouchableOpacity>
                </View>
            )}

            {scannedData && (
                <View style={styles.result}>
                    <Text>Datos escaneados:</Text>
                    <Text>{scannedData}</Text>
                </View>
            )}
        </View>
    );
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
   
    },
    result: {
     
    },
});

export default QRscanner1; */