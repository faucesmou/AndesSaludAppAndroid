import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Asegúrate de importar esto

interface AuthState {
  idAfiliadoTitular?: string;
  cuilTitular?: string;
  UserName?: string;
  nombreCompleto?: string;
  numeroCredencial?: string;
  tipoPlan?: string;
  estadoAfiliacion?: string;
  tipoPago?: string;
  numCelular?: string;
  mail?: string;
  status: string;
  setAuthData: (data: Record<string, any>) => void;
}


// Función para cargar datos desde AsyncStorage
export const loadAuthDataFromStorage = async (setAuthData: (data: Partial<AuthState>) => void) => {
    try {
      const storedData = await AsyncStorage.getItem('authData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setAuthData(parsedData); // Restaura los datos al contexto
        console.log('Datos restaurados desde AsyncStorage esto es en useAuthStore::', parsedData);
      } else {
        console.log('No hay datos guardados en AsyncStorage.esto es en useAuthStore:');
      }
    } catch (error) {
      console.error('Error al cargar datos desde AsyncStorage. esto es en useAuthStore:', error);
    }
  };


export const useAuthStore = create<AuthState>((set) => ({
  // Estado inicial
  status: 'unauthenticated',

  // Función para guardar datos en AsyncStorage
  setAuthData: async (data) => {
    const newState = {
      idAfiliadoTitular: data.idAfiliadoTitular || null,
      cuilTitular: data.cuilTitular || null,
      UserName: data.nombrePila || null,
      nombreCompleto: data.nombreCompleto || null,
      numeroCredencial: data.numeroCredencial || null,
      tipoPlan: data.tipoPlan || null,
      estadoAfiliacion: data.estadoAfiliacion || null,
      tipoPago: data.tipoPago || null,
      numCelular: data.numCelular || null,
      mail: data.mail || null,
      status: data.status || 'unauthenticated',
    };

    // Actualiza el estado de Zustand
    set(newState);

    // Guarda en AsyncStorage
    try {
      await AsyncStorage.setItem('authData', JSON.stringify(newState));
      console.log('Datos guardados correctamente en AsyncStorage.');
    } catch (error) {
      console.error('Error al guardar datos en AsyncStorage:', error);
    }
  },
}));
