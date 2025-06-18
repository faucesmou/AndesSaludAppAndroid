import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import axios from 'axios';
import { useAuthStore } from '../src/presentation/store/auth/useAuthStore';
import { IngresoLAD } from '../src/presentation/screens/MiGestion/llamandoAlDoctor/IngresoLAD';

//control sobre las respuestas de Jest
jest.mock('axios', () => ({
  get: jest.fn(),
}));



//Mock de la API
jest.mock('../src/presentation/config/api/tesloApi.ts', () => ({
  tesloApi: {
    interceptors: {
      request: {
        use: jest.fn(),
      },
    },
  },
}));


// Mock de navegación
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    setOptions: jest.fn(),
    dispatch: jest.fn(),
  }),
}));


jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

// Mock de otros hooks
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0 }),
}));

// Mock de axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('axios');
/* axios.get.mockResolvedValue({ data: 'some data' }); */ //esto no lo toma.

// Mock del store
jest.mock('../src/presentation/store/auth/useAuthStore');

const mockedUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('IngresoLAD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar correctamente cuando los datos están completos', async () => {
    mockedUseAuthStore.mockReturnValue({
      nombreCompleto: 'Gonzalo Test',
      dni: '12345678',
      sexo: 'M',
      numCelular: '5492612345678',
      tipoPlan: 'PLAN JOVEN FULL',
      numeroCredencial: '123456789',
      mail: 'gonzalo@test.com',
      fecNacimiento: '1990-01-01',
      grupoFamiliar: [],
    });

    mockedAxios.post.mockResolvedValue({
      data: { token: 'mocked-token' },
    });

    const { getByText, queryByText } = render(<IngresoLAD />);

    await waitFor(() => {
      expect(queryByText('¡Todo Listo!')).toBeTruthy();
    });

    expect(getByText('Ingresar al sistema')).toBeTruthy();
  });

  it('debe mostrar mensaje de error si axios falla', async () => {
    mockedUseAuthStore.mockReturnValue({
      nombreCompleto: 'Gonzalo Test',
      dni: '12345678',
      sexo: 'M',
      numCelular: '5492612345678',
      tipoPlan: 'BLACK VIP',
      numeroCredencial: '123456789',
      mail: 'gonzalo@test.com',
      fecNacimiento: '1990-01-01',
      grupoFamiliar: [],
    });

    mockedAxios.post.mockRejectedValue(new Error('Request failed'));

    const { getByText } = render(<IngresoLAD />);

    await waitFor(() => {
      expect(getByText(/No se pudo cargar/i)).toBeTruthy();
    });
  });
});
