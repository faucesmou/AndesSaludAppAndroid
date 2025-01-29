import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { TouchableOpacity } from 'react-native-gesture-handler';

const QRscanner2 = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);

    const handleBarCodeRead = (event:any) => {
        setIsScanning(false);
        setScannedData(event.nativeEvent.codeStringValue);
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
            <View style={styles.scanButtonContainer}>
                <TouchableOpacity style={styles.scanButton} onPress={() => setIsScanning(true)}>
                    <Text style={styles.scanButtonText}>Iniciar escaneo</Text>
                </TouchableOpacity>
            </View>
        )}

        {scannedData && (
            <View style={styles.result}>
                <Text style={styles.resultText}>Datos escaneados:</Text>
                <Text style={styles.resultData}>{scannedData}</Text>
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
        backgroundColor: '#f0f0f0', // Color de fondo para mejor visibilidad
    },
    camera: {
        flex: 1,
        width: '50%', // Asegúrate de que la cámara ocupe todo el ancho
    },
    scanButtonContainer: {
        position: 'absolute', // Posiciona el botón en la parte superior
        top: 50, // Ajusta la posición vertical
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    scanButton: {
        backgroundColor: '#007BFF', // Color de fondo del botón
        padding: 15,
        borderRadius: 5,
        elevation: 3, // Sombra para el botón
    },
    scanButtonText: {
        color: '#FFFFFF', // Color del texto del botón
        fontSize: 16,
        fontWeight: 'bold',
    },
    result: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 2,
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultData: {
        fontSize: 16,
        color: '#333',
    },
});

export default QRscanner2;