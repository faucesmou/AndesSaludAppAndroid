import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const globalColors = {
  primary: '#7037eb',
  secondary: '#f72585',
  tertiary: '#3a0ca3',
  success: '#4cc9f0',
  warning: '#fca3100',
  danger: '#e71d36',
  dark: '#22223b',
  profile: '#577CEE',
  profile2: '#3457e6',
  orange: '#ed843e',
  select: '#efe3e3',
  disabled: '#c4d2da',
  pressed: '#3d8ee5',
  pressed2: '#ee5a3d',
  orange2: '#d83414',
  brown: '#362521',
  yellow: '#d25e1b',
  yello3: '#e3d14b',
  brown2: '#ea9991',
  brown3: '#eb7e74',
  yellow2: '#f2ecbc',
  yellow3: '#ecdb5f',
  gray:'#505050',
  gray2:'#878383',
  black:'#1c1919',
/*   gray3:'#c1b9bb',  */
/*   gray3:'#c1c1c1', */
gray3:'#DCDCDC', 
  white1:'##d8d8cf',
  white2:'#ffffff',
  background: '#fff',
/* ------- */
babyPowder: '#FDFDF8ff',
earthYellow: '#E0A058ff',
earthYellow2: '#E4B576ff',
earthYellow3: '#FFFF00',
Yellow4: '#f5f502',
Yellow5: '#f8ffb2',
whiteColor: '#FFFFFFff',
white22: '#F7C552',
NaranjaCoral: '#f48c42 ',
NaranjaPastel: '#ffe2b2',
NaranjaPastel2: '#ffd2a2',

}
export const globalStyles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',/* globalColors.gray3 *//* 'yellow' */ /* 'gray' */ /* globalColors.background */
    textAlign: 'center',
    justifyContent: 'center',
    marginBottom:5,
  },
  inputIOS: {
    padding: 0,
    flex:1, /* esto lo agregamos para la imagen es prueba */
    width: '100%',
    height: '100%',
    color: 'black',
    fontSize: 10,
    fontFamily: 'Quicksand-Light',
    borderRadius: 15,
    backgroundColor: 'white' /* '#efe3e3' */,
  },
  inputIOS2: {
    padding: 0,
    flex:1, /* esto lo agregamos para la imagen es prueba */
    width: '100%',
    height: '80%',
    color: 'black',
    fontSize: 10,
    fontFamily: 'Quicksand-Light',
    borderRadius: 15,
    backgroundColor: 'white' /* '#efe3e3' */,
  },
  itemStyle: {
    fontSize: 15,
    fontFamily: 'Quicksand-Light',
    flex: 1,
    justifyContent: 'center',
    padding: 0,
    margin: 0,
    color: 'black',
    alignItems: 'center',
    borderRadius: 15,
  },
  //para la imagen de flechita:
  arrowImage: {
    width: 50,
    height: 50,
    marginLeft: 10, // Ajusta el margen según sea necesario
    backgroundColor:'orange'
  },
  //segunda prueba para colocar flecha en estudios medicos
  icon: {
    alignItems: 'flex-start',
    /*     backgroundColor: 'yellow', */
    marginBottom: 0,
  },
  //para la sombra: 
  pickerWrapper: {
    width: '100%',
    height: 50,
    marginBottom: 10,
    padding: 0,
    borderRadius: 15,
    backgroundColor: 'white', // Fondo para ver el borderRadius
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: -5, height: 6 }, // Desplazamiento de la sombra
    shadowOpacity: 0, // Opacidad de la sombra
    shadowRadius: 8, // Radio de la sombra
    flexDirection: 'row', // Esto permite que el Picker y la imagen se alineen en fila
  },
  pickerWrapper2: {
    width: '90%',
    height: 50,
    marginBottom: 10,
    padding: 0,
    borderRadius: 15,
    backgroundColor: 'white', // Fondo para ver el borderRadius
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: -5, height: 6 }, // Desplazamiento de la sombra
    shadowOpacity: 0, // Opacidad de la sombra
    shadowRadius: 8, // Radio de la sombra
    flexDirection: 'row', // Esto permite que el Picker y la imagen se alineen en fila
  
  },
  primaryButton: {
    backgroundColor: globalColors.profile2,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    marginBottom: 5,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center'

  },
  secondaryButton: {
    backgroundColor: 'white',
    borderColor: globalColors.orange,
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    marginBottom: 5,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center'

  },
  searchButton: {
    borderRadius: 5,
    padding: 0,
    margin: 0,
    marginBottom: 5,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',

  },
  searchButtonText: {
    fontSize: 18,
    paddingHorizontal: 5,
    fontWeight: 'normal',
    color: 'white',
    fontFamily: 'Quicksand-Light',
  },
  buttonText: {
    color: globalColors.background,
    fontSize: 18,
    textAlign: 'center',
  },
  buttonText2: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
  },
  productScreen: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: globalColors.white2  

  },
  /* estilos para el input numero 2: */
  containerInput2: {
    marginTop: 5,
    marginBottom: 10,
    justifyContent: 'center',
    paddingHorizontal: wp('5%'),
    color:'black'
 
  /*   paddingHorizontal: 30, */
   /*   backgroundColor: 'yellow'  */
  },
  estilosInput2: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: hp('1%'),
   /*  paddingLeft: 15, */
    fontSize: hp('2.1%'),
    fontFamily: 'Quicksand-Light',
    borderRadius: 13,
  /*   alignSelf: 'center', */
    flexWrap:'wrap',
    color:'black',
   /*  minWidth:wp('15%') */
  },
  /* estilos para estudios medicos enviados: */
  containerEstudiosMedicosEnv: {
    /*  flex: 0.5, */
    paddingHorizontal: wp('2%'),
    marginTop: wp('2%'),
    /*   backgroundColor: 'yellow',  */
    marginBottom: wp('2%'),

  },
  titleEstudiosMedicosEnv: {
    marginBottom: 5,
    fontSize: 21,
    fontFamily: 'Quicksand-Light',
    textAlign: 'center',
  },
  infoEstudiosMedicosEnv: {
    marginBottom: wp('1%'),
    marginTop:wp('1%'),
    fontSize: 20,
    fontFamily: 'Quicksand-Light',
    textAlign: 'center',
    color:'#030136',
    fontWeight:'bold',
  },
  resultText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Light',
    margin: 10,
    marginTop: 10,
    alignItems: 'flex-start',
    color:'black',
  },
  resultTextAprobado: {
    fontSize: 18,
    fontFamily: 'Quicksand-Light',
    margin: 10,
    marginTop: wp('1%'),
    alignItems: 'flex-start',
   /*  alignItems: 'flex-start', */
  },
  resultTextAprobadoIndicacion: {
    fontSize: 18,
    fontFamily: 'Quicksand-Light',
    margin: 10,
    marginTop: wp('0%'),
    alignItems: 'center',
   /*  alignItems: 'flex-start', */
  },
  resultFecha: {

    fontSize: 17,
    fontFamily: 'Quicksand-Light',
    marginHorizontal: 10,
    marginTop: 0,
   alignItems: 'flex-start', 
    color:'black',
/*    textAlign: 'center', */
    /* flexWrap: 'nowrap' */
  },
  resultOrdenText: {
    fontSize: 17,
    fontFamily: 'Quicksand-Light',
    marginHorizontal: 10,
    marginTop: 0,
    fontWeight: 'bold',
   textAlign: 'center',
    flexWrap: 'nowrap',
    alignItems: 'flex-start', 
    color:'#030136',
  }, 

  errorContainerEstudios: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#d7e5f8',
    borderRadius: 5,
  },
  titleErrorEstMedicosEnv: {
    marginBottom: 5,
    fontSize: 25,
    fontFamily: 'Quicksand-Light',
    textAlign: 'center',
  },
  errorTextEstudios: {
    fontSize: 18,
    color: '#721c24',
    fontFamily: 'Quicksand-Light',
    textAlign: 'center',
  },
  /* estilos para estudios consulta de facturas: */
  containerEstudiosMedicosEnv2: {
    /*    flex: 0.5,  */
    paddingHorizontal: 0,
    marginTop: 20,
    alignItems: 'center',
/*      backgroundColor: 'yellow',  */
    marginBottom: 10,

  },
  resultText2: {
    fontSize: 18,
    fontFamily: 'Quicksand-Light',
    margin: 0,
    marginTop: 0,
    color: 'black',
  },
  resultText3: {
    fontSize: 18,
    fontFamily: 'Quicksand-Light',
    margin: 0,
    marginTop: 10,
    color: 'black',
  },

  primaryButton2: {
    backgroundColor: '#b74a4a',/* globalColors.profile2 */
    borderRadius: 5,
    padding: 5,
    margin: 10,
    marginTop: 15,
    marginBottom: 15,
    marginHorizontal: 60,
    paddingHorizontal: 10,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center'

  },
  paidButton: {
    backgroundColor: '#39b536',/* globalColors.profile2 */
    borderRadius: 5,
    padding: 5,
    margin: 10,
    marginTop: 15,
    marginBottom: 20,
    marginHorizontal: 60,
    paddingHorizontal: 10,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center'
  },
  paidSign: {
    backgroundColor: '#39b536',/* globalColors.profile2 */
    borderRadius: 0,
    padding: 5,
    margin: 10,
    marginTop: 15,
    marginBottom: 20,
    marginHorizontal: 60,
    paddingHorizontal: 10,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center'
  },
  notAvailableButton: {
    backgroundColor:  globalColors.gray3,
    borderRadius: 5,
    padding: 5,
    margin: 10,
    marginTop: 15,
    marginBottom: 15,
    marginHorizontal: 60,
    paddingHorizontal: 10,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center'
  },
  primaryButton3: {
    backgroundColor: 'lightgrey'/* globalColors.profile2 */,
    borderRadius: 5,
    padding: 5,
    margin: 10,
    marginTop: 0,
    marginBottom: 15,
    marginHorizontal: 60,
    paddingHorizontal: 10,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',

  },
  /* probando nuesvos estilos de botones: SecondaryButton componente:  */
  buttonText3: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'normal',
/*     marginLeft: 5,  */
    flexWrap: 'wrap',
  },
  secondaryButton2: {
    backgroundColor: 'white',
  /*   minWidth: '50%', */ 
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 0 }, // Desplazamiento de la sombra
    shadowOpacity: 0.60, // Opacidad de la sombra
    shadowRadius: 20, // Radio de la sombra
    padding: 10,
    margin: 5,
    marginBottom: 5,
    marginHorizontal: 5,//distancia entre botones 
    paddingHorizontal: 20,//este si afecta
    paddingVertical:20,
    alignItems: 'flex-start',
    textAlign: 'center',
    justifyContent: 'center'

  },
  contentWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal:5,  
  },
    icon2: {
    marginRight: 0, // Espacio entre el icono y el texto
  },
  iconWrapper: {
    alignItems: 'center', // Alinea el icono al centro horizontalmente
    marginBottom: 5, // Añadir margen inferior para separar el icono del texto
 /*    marginLeft:5 */
  },
  descriptionText: {
    color: 'gray',
    fontSize: 18,
    flexWrap: 'wrap',
  },
    /* probando nuesvos estilos de botones: TertiaryButton componente:  */

    TertiaryButton: {
      backgroundColor: 'white',
      minWidth: '50%', 
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 15,
      shadowColor: '#000', // Color de la sombra
      shadowOffset: { width: 0, height: 0 }, // Desplazamiento de la sombra
      shadowOpacity: 0.60, // Opacidad de la sombra
      shadowRadius: 20, // Radio de la sombra
      padding: 10,
      margin: 5,
      marginBottom: 5,
      marginHorizontal: 15,//distancia entre botones 
      paddingHorizontal: 10,//este si afecta
      paddingVertical:15,
      alignItems: 'center',
      textAlign: 'center',
      justifyContent: 'center'
  
    },
    contentWrapper2: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    
    },
      icon2: {
      marginRight: 5, 
      alignItems: 'flex-end',
    },
    iconWrapper2: {
      alignItems: 'flex-end', 
      marginBottom: 0, 
      marginLeft:75
    },


})