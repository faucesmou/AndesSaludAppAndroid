import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PermissionsAndroid } from 'react-native';

const QRscanner4 = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);

/*     const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Permiso de Cámara',
                    message: 'Esta aplicación necesita acceso a tu cámara para escanear el código QR de tu DNI.',
                    buttonNeutral: 'Pregúntame después',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'Aceptar',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setIsScanning(true);
            } else {
                Alert.alert('Permiso de cámara denegado');
            }
        } catch (err) {
            console.warn(err);
        }
    }; */

    const handleBarCodeRead = (event) => {
        setScannedData(event.nativeEvent.codeStringValue);
        // Aquí puedes guardar los datos en un JSON o en el estado de tu aplicación
        // Por ejemplo, podrías hacer algo como:
        const jsonData = { data: event.nativeEvent.codeStringValue };
        console.log('Datos guardados:', jsonData);

        Alert.alert('Datos guardados', 'Los datos se han guardado correctamente.');
        setIsScanning(false); // Cierra la cámara después de escanear
    };

    return (
        <View style={styles.container}>
            {isScanning ? (
                <Camera
                    style={styles.camera}
                    onReadCode={handleBarCodeRead}
                    cameraType={CameraType.Back}
                    flashMode="auto"
                    focusMode="on"
                    zoomMode="on"
                />
            ) : (
                <TouchableOpacity style={styles.scanButton} onPress={requestCameraPermission}>
                    <Text style={styles.scanButtonText}>Escanear DNI</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    scanButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        elevation: 3,
    },
    scanButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default QRscanner4;