import { create } from "zustand";
import { User } from "../../../domain/entities/user";
import { AuthStatus } from "../../../infrastructure/interfaces/auth.status";
import { authCheckStatus, authLogin, register } from "../../../actions/auth/auth";
import { StorageAdapter } from "../../config/adapters/storageAdapter";
import { useNavigation, DrawerActions, NavigationProp } from '@react-navigation/native';
import axios from "axios";
import { xml2js } from 'xml-js';

//Este es el Store que creamos con zustand para tener un Context de los datos y acceder a los mismos desde cualquier parte de la aplicacion.
//@ts-ignore
import { USUARIO, PASSWORD, ADMINISTRADORA, STAGE } from '@env';

type ResultadoXML = {
  Resultado: {
    fila: {
      tablaPrestadores: {
        idConvenio: { _text: string };
        nombre: { _text: string };
      } | {
        idConvenio: { _text: string }[];
        nombre: { _text: string }[];
      };
    };
  };
}; /* esto no pareciera funcionar para eliminar el error de Resultado */

interface RecoverData {
  usuarioAfiliado: string;
  passAfiliado: string;
}


export interface AuthState {
  status: AuthStatus;
  token?: string;
  /*   user?: User; */
  queryIdAfiliado?: string;
  idAfiliado?: string;
  idAfiliadoTitular?: string;
  cuilTitular: string;
  nombreCompleto?:string;
  numeroCredencial?:string;
  tipoPlan?:string;
  estadoAfiliacion?:string;
  tipoPago?:string;
  mail?:string;
  numCelular?:string;
  idsFamiliares?: string[];
  idsEspecialidades?: string;
  idPrestacion?: string;
  idPrestador?: string;
  idAfiliadoSeleccionado?: string;
  idCartillaSeleccionada?: string;
  nombreEspecialidadSeleccionada?: string;
  cadena: string;
  imagen1: string | undefined;
  imagenes: (string | null)[];
  User: string | null;
  UserName: string | null;
  UserLastName: string | null;

  setUser: (user: string) => void;
  pass: string | null;
  setPass: (pass: string) => void;
  getUser: () => string | null;
  getPass: () => string | null;
  getUserName: () => string | null;
  getUserLastName: () => string | null;
  setUserName: (user: string) => void;
  setUserLastName: (pass: string) => void;
  actualizarNotificaciones: boolean;

  loginGonzaMejorado: (usuario: string, /* email: string,  */password: string, dni: string) => Promise<boolean>;
  loginGonzaMejorado2: (usuario: string, password: string, ) => Promise<boolean>;
  recuperarDatos: (numeroAfiliado: string, dni: string) => Promise<RecoverData | undefined>;

  /*  ObtenerFamiliares: (idAfiliado: string)=> Promise<string[]>; */
  ObtenerFamiliares: (idAfiliado: string, /* apellidoYNombre:string */) => Promise<any[]>;
  ObtenerEspecialidades: (idAfiliado: string, idAfiliadoTitular: string) => Promise<any[]>;
  ObtenerPrestadores: (idAfiliado: string, idAfiliadoTitular: string, idPrestacion: string) => Promise<any[]>;
  ObtenerPrestadoresEstudiosMedicos: (idAfiliado: string, cadena: string) => Promise<any[]>;
  GuardarIdPrestador: (idPrestador: string) => Promise<boolean>;

  GuardarImagenes: (newImages: (string | null)[]) => Promise<boolean>;
  /*  GuardarImagenes: (base64String: string) => Promise<boolean>; */
  GuardarIdFamiliarSeleccionado: (idAfiliado: string) => Promise<any[]>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;
  registerUser: (email: string, password: string, fullName: string) => Promise<void>;
  GuardarIdCartillaSeleccionada: (idCartilla: string, nombreEspecialidadSeleccionada: string) => Promise<any[]>;
  setShouldUpdateNotifications: (estado: boolean) => void;
  guardarDatosLoginEnContext: (idAfiliado: string) => Promise<boolean>;
}



export const useAuthStore = create<AuthState>()((set, get) => ({
  status: 'checking',
  token: undefined,
  user: undefined,
  idAfiliado: undefined,
  idAfiliadoTitular: undefined,
  cuilTitular: '',
  idsFamiliares: [],
  idsEspecialidades: undefined,
  idPrestacion: undefined,
  idAfiliadoSeleccionado: undefined,
  idCartillaSeleccionada: undefined,
  idUnicoFactura: undefined,
  cadena: '',
  imagen1: '',
  imagenes: [null, null, null, null, null],
  idPrestador: '',
  User: null,
  setUser: (User) => set({ User }),
  pass: null,
  setPass: (pass) => set({ pass }),
  getUser: () => get().User,
  getPass: () => get().pass,
  UserName: null,
  UserLastName: null,
  setUserName: (UserName) => set({ UserName }),
  setUserLastName: (UserLastName) => set({ UserLastName }),
  getUserName: () => get().UserName,
  getUserLastName: () => get().UserLastName,
  actualizarNotificaciones: false,
  setShouldUpdateNotifications: (value: boolean) => set({ actualizarNotificaciones: value }),

  loginGonzaMejorado: async (usuario: string, password: string, dni: string) => {
    try {

      
      const respuestaFrancoMejorada = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/consultarAfiliadoJson?usuario=${USUARIO}&password=${PASSWORD}&administradora=${ADMINISTRADORA}&datosAfiliado=${usuario}`);

   

      if (respuestaFrancoMejorada && respuestaFrancoMejorada.data && respuestaFrancoMejorada.data.length > 0) {
        const idAfiliado = respuestaFrancoMejorada.data[0].idAfiliado;
        const idAfiliadoTitular = respuestaFrancoMejorada.data[0].idAfiliadoTitular;
        const cuilTitular = respuestaFrancoMejorada.data[0].cuilTitular;
        const dniAfiliado = respuestaFrancoMejorada.data[0].nroDocumento;
        const usuarioAfiliado = respuestaFrancoMejorada.data[0].usuAPP;
        const passAfiliado = respuestaFrancoMejorada.data[0].passAPP;

   

        /* Logica para establecer usuario y contraseña:  */


        if (usuario === usuarioAfiliado && password === passAfiliado) {

          console.log('Ingreso aprobado');
          set({ status: 'authenticated', idAfiliado: idAfiliado, idAfiliadoTitular: idAfiliadoTitular, cuilTitular: cuilTitular });
          return true;

        }
        else {
          console.log('dni o contraseña incorrectos');
          return false
        }
      } else {
        console.log('El servidor respondió con un estado diferente a 200');
        set({ status: 'unauthenticated' })
        return false
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  },
  loginGonzaMejorado2: async (usuario: string, password: string) => {
    try {
     /*  console.log('usuario y password recibido en loginGonza2:', usuario, password); */
console.log('hola soy gonzalo estoy entrando a login---------->');

      // Realizando la petición a la API
      const resultadoLogin = await axios.get(
        `https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/APPVerificaLoginSoyAfiliado?usuario=${usuario}&pass=${password}`
      );
    
      const xmlData = resultadoLogin.data;

      // Convertir XML a JSON
      const result = xml2js(xmlData, { compact: true });

        //@ts-ignore
      const resultadoMensaje = result.Resultado?.fila?.mensaje?._text;
      //@ts-ignore
      const resultadoIdAfiliado = result.Resultado?.fila?.idAfiliado?._text;
      console.log('resultadoMensaje en loginGonza2----->:', resultadoMensaje);
      console.log('resultadoIdAfiliado en loginGonza2----->:', resultadoIdAfiliado);

      if (resultadoMensaje === 'Usuario y pass correctos') {
        console.log('Ingreso aprobado');
        /* cambio esto para abrir la app solucion temporal--------------- descomente el status authenticated-------------->>>  */
        set({ status: 'authenticated', idAfiliado: resultadoIdAfiliado, });
        return true; // Devuelve true si el login es exitoso
      } else {
        console.log('Usuario o contraseña incorrectos.');
        set({ status: 'unauthenticated' });
        return false; // Devuelve false si las credenciales son incorrectas
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      set({ status: 'unauthenticated' });
      return false; // Devuelve false si ocurre un error
    }
  },
  guardarDatosLoginEnContext: async (idAfiliado) => {


    try {
      console.log('Iniciando consulta para recabar datos---> ');
   /*    console.log('USUARIO----------------->', USUARIO);
      console.log('--> el PASSWORD es:', PASSWORD);
      console.log('--> el ADMINISTRADORA es:', ADMINISTRADORA);
      console.log('--> el idAfiliado es:', idAfiliado); */

      /* consulta para recabar informacion y guardar en el context: */

      const respuestaFrancoMejorada = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/consultarAfiliadoJson?usuario=${USUARIO}&password=${PASSWORD}&administradora=${ADMINISTRADORA}&datosAfiliado=${idAfiliado}`);



      if (respuestaFrancoMejorada && respuestaFrancoMejorada.data && respuestaFrancoMejorada.data.length > 0) {
        const idAfiliado = respuestaFrancoMejorada.data[0].idAfiliado;
        const idAfiliadoTitular = respuestaFrancoMejorada.data[0].idAfiliadoTitular;
        const cuilTitular = respuestaFrancoMejorada.data[0].cuilTitular;
        const nombrePila = respuestaFrancoMejorada.data[0].nombre;

        const nombreCompleto = respuestaFrancoMejorada.data[0].apellNomb;
        const numeroCredencial = respuestaFrancoMejorada.data[0].nroAfiliado;
        const tipoPlan = respuestaFrancoMejorada.data[0].planPrestacional;
        const estadoAfiliacion = respuestaFrancoMejorada.data[0].estadoAfiliacion;
        const tipoPago = respuestaFrancoMejorada.data[0].tipoPago;
        const numCelular = respuestaFrancoMejorada.data[0].numCelular;
        const mail = respuestaFrancoMejorada.data[0].mail;

   /*      const dniAfiliado = respuestaFrancoMejorada.data[0].nroDocumento;
        const usuarioAfiliado = respuestaFrancoMejorada.data[0].usuAPP;
        const passAfiliado = respuestaFrancoMejorada.data[0].passAPP; */
 /*        console.log('idAfiliado----------------->', idAfiliado);
        console.log('--> el idAfiliadoTitular es:', idAfiliadoTitular);
        console.log('--> el cuilTitular es:', cuilTitular);
        console.log('--> el nombrePila es:', nombrePila);

        console.log('nombreCompleto----------------->', nombreCompleto);
        console.log('--> el numeroCredencial es:', numeroCredencial);
        console.log('--> el tipoPlan es:', tipoPlan);
        console.log('--> el estadoAfiliacion es:', estadoAfiliacion); */
     

        /* Logica para establecer usuario y contraseña:  */

        if (idAfiliado != undefined && idAfiliadoTitular != undefined && cuilTitular != undefined) {

          set({  idAfiliadoTitular: idAfiliadoTitular, cuilTitular: cuilTitular, UserName: nombrePila, nombreCompleto: nombreCompleto, numeroCredencial:numeroCredencial, tipoPlan:tipoPlan, estadoAfiliacion:estadoAfiliacion, tipoPago:tipoPago, numCelular:numCelular, mail:mail });
          console.log('los datos de idAfiliado, idAfiliadoTitular y cuilTitular fueron guardados en el context correctamente');
          console.log('los datos de nombreCompleto, numeroCredencial, tipoPlan y estadoAfiliacion fueron guardados en el context correctamente');

          set({  status: 'authenticated', });
          return true;
        }
        else {
          console.error('no se pudo obtener el idAfiliado, idAfiliadoTitular y cuilTitular');
          return false
        }
      }
      else {
        console.log('respuestaFrancoMejorada && respuestaFrancoMejorada.data && respuestaFrancoMejorada.data.length no es mayor a 0');
        console.error('No se encontraron datos para guardar en el context');
        return false
      }

    } catch (error) {
      console.error('Error al consultar datos y guardarlos en el context:', error);
      return false;
    }
  },
recuperarDatos: async (numeroAfiliado: string, dni: string) => {
  try {

    const respuestaFrancoMejorada = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/consultarAfiliadoJson?usuario=${USUARIO}&password=${PASSWORD}&administradora=${ADMINISTRADORA}&datosAfiliado=${dni}`);

    if (respuestaFrancoMejorada && respuestaFrancoMejorada.data && respuestaFrancoMejorada.data.length > 0) {
     /*  const idAfiliadoApi = respuestaFrancoMejorada.data[0].idAfiliado;
      const idAfiliadoTitular = respuestaFrancoMejorada.data[0].idAfiliadoTitular;
      const cuilTitular = respuestaFrancoMejorada.data[0].cuilTitular; */

      const dniAfiliado = respuestaFrancoMejorada.data[0].nroDocumento;

      const numeroAfiliadoApi = respuestaFrancoMejorada.data[0].nroAfiliado;

      const usuarioAfiliado = respuestaFrancoMejorada.data[0].usuAPP;
      const passAfiliado = respuestaFrancoMejorada.data[0].passAPP;
      const usuarioNombre = respuestaFrancoMejorada.data[0].nombre;
      const usuarioApellido = respuestaFrancoMejorada.data[0].apellido;

/*       console.log('numeroAfiliadoApi CONSULTA', numeroAfiliadoApi);
      console.log('idAfiliadoTitular', idAfiliadoTitular);
      console.log('cuilTitular', cuilTitular);
      console.log('dniAfiliado', dniAfiliado);
      console.log('usuarioAfiliado', usuarioAfiliado);
      console.log('passAfiliado', passAfiliado);
      console.log('usuarioNombre', usuarioNombre);
      console.log('usuarioApellido', usuarioApellido); */

      /* Logica para establecer usuario y contraseña:  */


      if (numeroAfiliado === numeroAfiliadoApi && dni === dniAfiliado) {

        console.log('Recuperación aprobada');
        return {
          usuarioAfiliado,
          passAfiliado,
          usuarioNombre,
          usuarioApellido
        };

      }
      else {
        console.log('dni o idAfiliado incorrectos');
        return
      }
    } else {
      console.log('El servidor respondió con un estado diferente a 200');
      set({ status: 'unauthenticated' })
      return
    }
  } catch (error) {
    console.error('Error al intentar recuperar los datos:', error);
    return
  }
},

  ObtenerFamiliares: async (idAfiliado: string): Promise<any[]> => {
    //funcion para manejar la respuesta de la API y guardar solo los ids de cada familiar
    const obtenerFamiliaresObjeto = (respuestaApi: string) => {
      try {
        const respuesta = JSON.parse(respuestaApi);
        const idsFamiliares: string[] = [];
        const infoFamiliares: any[] = [];
        respuesta.data.forEach((familiar: { idAfiliado: string, apellidoYNombre: string }) => {
          idsFamiliares.push(familiar.idAfiliado)
          const familiaresObj = {
            idAfiliado: familiar.idAfiliado,
            apellidoYNombre: familiar.apellidoYNombre
          };
          infoFamiliares.push(familiaresObj);
        });

        return infoFamiliares;
      } catch (error) {
        console.log('error en la funcion obtenerIdsFamiliares');
        return []
      }
    }

    try {
      const grupoFamiliar = await axios.get(`https://andessalud.createch.com.ar/api/obtenerFamiliares?idAfiliado=${idAfiliado}`)


      const Familiares2 = obtenerFamiliaresObjeto(JSON.stringify(grupoFamiliar.data))


      /* set({ Familiares: Familiares2 }) *//* esto no esta funcionando resolver */
      return Familiares2;
    } catch (error) {
      console.log('ha ocurrido un error al obtener los familiares');
      return [];
    }
  },
    ObtenerEspecialidades: async (idAfiliado: string, idAfiliadoTitular: string): Promise<string[]> => {
      //funcion para manejar la respuesta de la API y guardar solo los ids de cada familiar
      const obtenerIdsEspecialidades = (respuestaApi: string) => {
        try {
          const respuesta = JSON.parse(respuestaApi);
          const infoEspecialidades: any[] = [];

          respuesta.data.forEach((especialidad: any) => {
            const especialidadObj = {
              idPrestacion: especialidad.idPrestacion,
              nombreParaAfiliado: especialidad.nombreParaAfiliado
            };
            infoEspecialidades.push(especialidadObj);
            /*   const arrayEspecialidad = [especialidad.idPrestacion, especialidad.nombreParaAfiliado,]
              idsEspecialidades.push(arrayEspecialidad); */

          });

          return infoEspecialidades;
        } catch (error) {
          console.log('error en la funcion obtenerIdsFamiliares');
          return []
        }
      }

      try {
        const grupoEspecialidades = await axios.get(`https://andessalud.createch.com.ar/api/obtenerEspecialidad?idAfiliado=${idAfiliado}&idAfiliadoTitular=${idAfiliadoTitular}`)

        const idsEspecialidades = obtenerIdsEspecialidades(JSON.stringify(grupoEspecialidades.data))
        return idsEspecialidades;
      } catch (error) {
        console.log('ha ocurrido un error al obtener los familiares');
        return [];
      }
    },
      ObtenerPrestadores: async (idAfiliado: string, idAfiliadoTitular: string, idPrestacion: string): Promise<string[]> => {
        //funcion para manejar la respuesta de la API y guardar solo los ids de cada familiar:
        //guardo el id de la especialidad elegida en el context para recuperarla luego en la orden de consulta.
        set({ idPrestacion: idPrestacion })
        console.log(' Se guardo correctamente el idPrestacion seleccionado en el useAuthStore');
        const obtenerPrestadoresObjeto = (respuestaApi: string) => {
          try {
            const respuesta = JSON.parse(respuestaApi);
            const infoPrestadores: any[] = [];

            respuesta.data.forEach((prestador: any) => {
              const prestadoresObj = {
                idPrestador: prestador.idPrestador,
                prestador: prestador.prestador
              };
              infoPrestadores.push(prestadoresObj);
              /*   const arrayEspecialidad = [especialidad.idPrestacion, especialidad.nombreParaAfiliado,]
                idsEspecialidades.push(arrayEspecialidad); */

            });

            return infoPrestadores;
          } catch (error) {
            console.log('error en la funcion obtenerPrestadoresObjeto');
            return []
          }
        }

        try {

          const grupoPrestadores = await axios.get(`https://andessalud.createch.com.ar/api/obtenerPrestador?idAfiliado=${idAfiliado}&idAfiliadoTitular=${idAfiliadoTitular}&idPrestacion=${idPrestacion}`)
          const informacionPrestadores = obtenerPrestadoresObjeto(JSON.stringify(grupoPrestadores.data))
          /* console.log('el useState informacionPrestadores --&&&----&&--&&-->:', informacionPrestadores); */
          return informacionPrestadores;
        } catch (error) {
          console.log('ha ocurrido un error al obtener informacionPrestadores');
          return [];
        }
      },

        ObtenerPrestadoresEstudiosMedicos: async (idAfiliado: string, cadena: string): Promise<{ idConvenio: string; nombre: string }[]> => {
          /*   Función para manejar la respuesta de la API y transformar XML a JSON */
          const RecepcionRespuestaPrestadores = (xmlData: string) => {
            try {
              /*    Convertir XML a JSON */
              const result = xml2js(xmlData, { compact: true });
              console.log('Datos JSON convertidos ----->>:', result);

              /*    Verificación de la estructura del resultado */
              //@ts-ignore
              if (!result || !result.Resultado || !result.Resultado.fila || !result.Resultado.fila.tablaPrestadores) {
                console.log('se disparò ObtenerPrestadoresEstudiosMedicos y la recepcion de respuesta prestadores dice :  La respuesta XML no contiene los datos esperados');
                return [];
              }
//@ts-ignore
              const prestadoresData = result.Resultado.fila.tablaPrestadores;


              /*   Mapear los datos correctamente */
              //@ts-ignore
              let infoPrestadores: Prestador[];

              if (Array.isArray(prestadoresData.idConvenio)) {
                // Si hay múltiples respuestas
                infoPrestadores = prestadoresData.idConvenio.map((_, index) => ({
                  idConvenio: prestadoresData.idConvenio[index]._text,
                  nombre: prestadoresData.nombre[index]._text,
                  ordenAccion: prestadoresData.ordenAccion[index]._text // Incluir ordenAccion si es necesario
                }));
              } else {
                // Si hay una sola respuesta
                infoPrestadores = [{
                  idConvenio: prestadoresData.idConvenio._text,
                  nombre: prestadoresData.nombre._text,
                  ordenAccion: prestadoresData.ordenAccion._text // Incluir ordenAccion si es necesario
                }];
              }

              return infoPrestadores;
            } catch (error) {
              console.log('Error en la función RecepcionRespuestaPrestadores', error);
              return [];
            }
          };

          // Función para realizar la consulta a la API
          const ObtenerInformacionPrestadores = async (idAfiliado: string, cadena: string) => {
            try {
              const response = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/APPBuscarCartillaPrestadoresPracticas?IMEI=&idAfiliado=${idAfiliado}&cadena=${cadena}`);
              const xmlData = response.data;
              const informacionPrestadores = RecepcionRespuestaPrestadores(xmlData);
              // console.log('el useState informacionPrestadores --&&&----&&--&&-->:', informacionPrestadores);
              set({ cadena: '' }); // Este set es para que el useEffect no entre en bucle
              return informacionPrestadores;
            } catch (error) {
              console.log('Ha ocurrido un error al obtener informacionPrestadores de Estudios Médicos:--->', error);
              return [];
            }
          };

          return ObtenerInformacionPrestadores(idAfiliado, cadena);
        },
          GuardarIdPrestador: async (idPrestador: string): Promise<boolean> => {
            try {
              set({ idPrestador: idPrestador })
              console.log(' Se guardo correctamente el idPrestador en el useAuthStore');
              return true;
            } catch (error) {
              console.log('ha ocurrido un error al guardar idPrestador en el useAuthStore');
              return false;
            }
          },
            /*  GuardarImagenes: async ( base64String: string): Promise<boolean> => {
                try {
                  set({ imagen1: base64String })
                  console.log('Se han guardado correctamente las imagenes en el context de zustand');
                return true; 
              } catch (error) {
                  console.log('Ocurrió un error al guardar las imagenes en el context de zustand');
                 return false;
                }
              }, */
            GuardarImagenes: async (newImages: (string | null)[]): Promise<boolean> => {
              try {
                set({ imagenes: newImages });
                console.log('Se han guardado correctamente las imágenes en el contexto de Zustand: son las siguientes:',);

                return true;
              } catch (error) {
                console.log('Ocurrió un error al guardar las imágenes en el contexto de Zustand');
                return false;
              }
            },
              GuardarIdFamiliarSeleccionado: async (idAfiliado: string): Promise<string[]> => {
                try {
                  set({ idAfiliadoSeleccionado: idAfiliado })
                  console.log(' Se guardo correctamente el idFamiliar seleccionado en el useAuthStore');
                  return [];
                } catch (error) {
                  console.log('ha ocurrido un error al guardar idAfiliado en el useAuthStore');
                  return [];
                }
              },
                GuardarIdCartillaSeleccionada: async (idCartilla: string, nombreEspecialidadSeleccionada: string): Promise<string[]> => {
                  try {
                    set({ idCartillaSeleccionada: idCartilla, nombreEspecialidadSeleccionada: nombreEspecialidadSeleccionada })

                    return [];
                  } catch (error) {
                    console.log('ha ocurrido un error al guardar idCartilla o el nombreEspecialidad en el useAuthStore');
                    return [];
                  }
                },

                  /* set({ idsEspecialidades: idsEspecialidades })esto no esta funcionando resolver */
                  registerUser: async (email: string, password: string, fullName: string) => {
                    try {
                      const resp = await register(email, password, fullName);
                      console.log('Respuesta de la petición de registro:', resp);
                      if (!resp) {
                        set({ status: 'unauthenticated', token: undefined, user: undefined })
                        throw new Error('Registro fallido perro');
                      }
                      //TODO: Save token and user in storage 
                      /*    await StorageAdapter.setItem( 'token', resp.token ); */
                      
                      set({ status: 'registered', token: resp.token, user: resp.user });

                    } catch (err) {
                      console.error('Error en el registro:', err);
                      throw err;
                    }

                  },

                    checkStatus: async () => {
                      const resp = await authCheckStatus();
                      if (!resp) {
                        set({ status: 'unauthenticated', token: undefined, user: undefined })
                        return;
                      }
                      await StorageAdapter.setItem('token', resp.token);
                      set({ status: 'authenticated', token: resp.token, user: resp.user });
                    },

                      logout: async () => {
                        await StorageAdapter.removeItem('token')

                        set({ status: 'unauthenticated', token: undefined, user: undefined })

                        console.log('se cerró la sesion gonzalito');
                        return

                      },


}))

/* navigation.closeDrawer(); */
/*    navigation.navigate('LoginScreen'); */