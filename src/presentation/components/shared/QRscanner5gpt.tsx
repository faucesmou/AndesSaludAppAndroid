import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, PermissionsAndroid, Platform } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { TouchableOpacity } from 'react-native-gesture-handler';

const QRscanner5gpt = () => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Permiso para usar la cámara',
                    message: 'Esta aplicación necesita acceso a tu cámara para escanear el QR del DNI.',
                    buttonNeutral: 'Preguntar más tarde',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'Aceptar',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    const handleBarCodeRead = (event: any) => {
        const scannedData = event.nativeEvent.codeStringValue;
        setIsCameraOpen(false);

        // Guardar datos escaneados en un JSON
        const data = { dniQR: scannedData };
        console.log('Datos escaneados:', data);

        // Mostrar mensaje al usuario
        Alert.alert(
            'Datos guardados',
            'Los datos del QR del DNI han sido guardados correctamente.',
            [{ text: 'OK' }]
        );
    };

    const handleScanPress = async () => {
        const hasPermission = await requestCameraPermission();
        if (hasPermission) {
            setIsCameraOpen(true);
        } else {
            Alert.alert(
                'Permiso denegado',
                'No podemos acceder a la cámara sin tu permiso.',
                [{ text: 'OK' }]
            );
        }
    };

    return (
        <View style={styles.container}>
            {isCameraOpen ? (
                <Camera
                    style={styles.camera}
                    onReadCode={handleBarCodeRead}
                    cameraType={CameraType.Back}
                    flashMode="auto"
                    focusMode="on"
                    zoomMode="on"
                />
            ) : (
                <TouchableOpacity style={styles.scanButton} onPress={handleScanPress}>
                    <Text style={styles.scanButtonText}>Escanear DNI</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        marginTop:5,
    },
    camera: {
        flex:1,
        width: '100%',
    },
    scanButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 10,
        elevation: 3,
    },
    scanButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default QRscanner5gpt;
