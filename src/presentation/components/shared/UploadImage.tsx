import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import axios from 'axios';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { globalColors } from '../../theme/theme';

const UploadImage: React.FC = () => {
  /* quiero usar estos estados par mostra la imagen y chequear si estan guardandose o quitandse */
  const [selectedImages, setSelectedImages] = useState<string | null[]>([]);
  const [SelectedFileName, setSelectedFileName] = useState<string | null>(null);
  /* Estados para manejar un posible envio (no se esta usando por ahora) */
  const [fileSent, setFileSent] = useState(false);
  const [fileNotSent, setFileNotSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { GuardarImagenes } = useAuthStore();

  const [base64Image, setBase64Image] = useState<string | null>(null);
  /* Primera prueba cargando varias imagenes:  */
  const [imagenes, setImagenes] = useState<(string | null)[]>([null, null, null, null, null]);
  const [fileNames, setFileNames] = useState<(string | null)[]>([null, null, null, null, null]);

  const convertImageToBase64 = async (imageUri: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Leer la imagen y convertirla a Base64
      RNFS.readFile(imageUri, 'base64')
        .then((base64String: string) => {
          resolve(base64String);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  };

  const handleImagePicker = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
      });

      if (result.didCancel) {
        console.log('El usuario canceló image picker');
      } else if (result.errorCode) {
        console.error('ImagePicker Error: ', result.errorCode);
      } else if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        const base64String = await convertImageToBase64(asset.uri);

        const emptyIndex = imagenes.findIndex(image => image === null);
        if (emptyIndex !== -1) {
          const newImages = [...imagenes];
          newImages[emptyIndex] = base64String;
          setImagenes(newImages);

          const newFileNames = [...fileNames];
          newFileNames[emptyIndex] = asset.fileName || null;
          setFileNames(prev => {
            const newFileNames = [...prev];
            newFileNames[emptyIndex] = asset.fileName || 'Desconocido';
            return newFileNames;
          });
          /*   setFileNames(newFileNames); */

          // Guardar la imagen en el estado global
          const resultado = await GuardarImagenes(newImages);
          if (resultado) {
            console.log('Imagen guardada exitosamente en zustand');
          } else {
            console.log('Un problema para guardar la imagen en zustand');
          }

        } else {
          console.log('No se pueden cargar más de 5 imágenes');
        }
      }
    } catch (error) {
      console.error('ImagePicker Error: ', error);
    }

  };

  const handleImageUpload = async () => {
    try {
      if (!selectedImage) {
        Alert.alert('Error', 'Debes seleccionar una imagen.');
        return;
      }

      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await axios.post('https://your-backend-url.com/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setFileSent(true);
        setFileNotSent(false);
      } else {
        setFileSent(false);
        setFileNotSent(true);
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setFileSent(false);
      setFileNotSent(true);
      setErrorMessage(error.message);
    }
  };

  const handleRemoveImage = async (index: any) => {
    const newImages = [...imagenes];
    const newFileNames = [...fileNames];
    newImages[index] = null;
    newFileNames[index] = null;
    setImagenes(newImages);
    setFileNames(newFileNames);

    // Guardar los cambios en el estado global
    const resultado = await GuardarImagenes(newImages);
    if (resultado) {
      console.log('Imagen removida exitosamente en zustand');
    } else {
      console.log('Un problema para remover la imagen en zustand');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cargá las imágenes de tus Estudios</Text>

    {/* <View  style={{ marginBottom: wp('0.5%'),  marginTop: wp('0.5%'), }}>
      <Button title="Seleccionar Imágenes" onPress={handleImagePicker} />
    </View> */}

    <View style={{ marginBottom: wp('0.5%'), marginTop: wp('0.5%') }}>
  <TouchableOpacity 
    style={{
      backgroundColor: '#4285F4', // Cambia el color de fondo aquí
      padding: 10, 
      borderRadius: 15,
      alignItems: 'center', // Centra el texto
      
    }} 
    onPress={handleImagePicker}
  >
    <Text style={{ color: 'white', fontSize: wp('4.3%'), fontWeight:'bold',
     }}>Seleccionar Imágenes</Text>
  </TouchableOpacity>
</View>

   {/*    <ScrollView style={{ width: '100%',  }} > */}

        {fileNames.map((fileName, index) => (
          fileName && (
            <View key={index} style={ styles.containerTitle } >
              <View key={index} style={{ justifyContent: 'center', display: 'flex', flexDirection:'column', /* backgroundColor:'violet', */ width:'100%', flexWrap:'nowrap'}} >
              <Text style={styles.title}>Imagen {index + 1}:</Text>
              <Text style={styles.subitle}>{fileName}</Text>
              </View>
              {/*       {selectedImages && (
        <Image source={{ uri: selectedImages }} style={styles.image} />
      )} */}

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveImage(index)}
              >
                <Text style={styles.removeButtonText}>Quitar Imagen</Text>
              </TouchableOpacity>
            </View>
          )
        ))}
   {/*    </ScrollView> */}

    </View>
  );
};

  const styles = StyleSheet.create({
    container: {
      /*    flex: 1, */
      padding: wp('1%'),
      marginTop: wp('1%'),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: wp('1%')
  /*   backgroundColor:'green',  */
   /*  maxHeight: '30%', */
    /* marginBottom: wp('0%'), marginTop: hp('0%') */
    },
    containerTitle: {
      marginBottom: 0,
      width: '100%',
    },
    title: {
      /* fontSize: 17, */
      marginBottom: 10,
      fontFamily: 'Quicksand-Regular',
     /*  color: 'black' */
     fontSize: hp('2.5%'),
      color: globalColors.gray2,
    fontWeight: 'bold',
      /* style={[styles.consignaText, { marginHorizontal: dynamicMargin }]} */
    },
    subitle: {
      fontSize: 15,
      marginBottom: 5,
      fontFamily: 'Quicksand-Regular',
      width: '100%',
      color:'black'
    },
    image: {
      width: 200,
      height: 200,
      marginVertical: 20,
    },
    successMessage: {
      color: 'green',
      marginTop: 20,
    },
    errorMessage: {
      color: 'red',
      marginTop: 20,
    },
    imageContainer: {
      marginBottom: 20,
    },
    removeButton: {
      backgroundColor: '#ee5a3d',
      padding: 5,
      borderRadius: 5,
      marginHorizontal:10,
      maxWidth:'70%',
      alignSelf:'center',
      marginTop:5,
    },
    removeButtonText: {
      color: 'white',
      textAlign: 'center',
    },
  });

  export default UploadImage;

  /* return (
    <View style={styles.container}>

      <Text style={styles.title}>Carga las imágenes de tus Estudios</Text>

      <Button title="Seleccionar Imágenes" onPress={handleImagePicker} />
      <ScrollView style={{ width: '100%', backgroundColor: 'green', flex: 1,  }} >

        {fileNames.map((fileName, index) => (
          fileName && (
            <View key={index} style={styles.containerTitle} >
              <View key={index} style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column',  backgroundColor:'violet', width: '100%', flexWrap: 'nowrap' }} >
                <Text style={styles.title}>Imagen {index + 1}:</Text>
                <Text style={styles.subitle}>{fileName}</Text>
              </View>
             

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveImage(index)}
              >
                <Text style={styles.removeButtonText}>Quitar Imagen</Text>
              </TouchableOpacity>
            </View>
          )
        ))}
      </ScrollView>

    </View>
  );
}; */

/* const styles = StyleSheet.create({
  container: {

    padding: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '40%',
  },
  containerTitle: {
    marginBottom: 0,
    width: '100%',
  },
  title: {
    fontSize: 17,
    marginBottom: 10,
    fontFamily: 'Quicksand-Regular',
  },
  subitle: {
    fontSize: 15,
    marginBottom: 5,
    fontFamily: 'Quicksand-Regular',
    width: '100%',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  successMessage: {
    color: 'green',
    marginTop: 20,
  },
  errorMessage: {
    color: 'red',
    marginTop: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  removeButton: {
    backgroundColor: '#ee5a3d',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 10,
    maxWidth: '70%',
    alignSelf: 'center',
    marginTop: 5,
  },
  removeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default UploadImage;
 */
 {/*       {selectedImages && (
            <Image source={{ uri: selectedImages }} style={styles.image} />
            )} */}