import { create } from 'zustand';

/* type Notification = {
  idOrden: string;
  afiliado: string;
  fecSolicitud: string;
  estado: string;
  fecFinalizacion: string;
  comentarioRechazo?: string;
  visto: string;
}; */
    type Notification = {
      idOrden: string;
      visto: string;
      fecFinalizacion?: string; 
    };

  /*   type Store = {
      notifications: Notification[];
      setNotifications: (notifications: Notification[]) => void;
      orderNotifications: Notification[];
      setOrderNotifications: (notifications: Notification[]) => void;
    }; */
    type Store = {
      medicalNotifications: Notification[];
      setMedicalNotifications: (notifications: Notification[]) => void;
      orderNotifications: Notification[];
      setOrderNotifications: (notifications: Notification[]) => void;
      combinedNotifications: Notification[];
      setCombinedNotifications: () => void;
    };
    export const useNotificationStore = create<Store>((set, get) => ({
      medicalNotifications: [],
      setMedicalNotifications: (notifications) => {
        set({ medicalNotifications: notifications });
        get().setCombinedNotifications(); // Llama a la combinación después de setear las medical
      },
      orderNotifications: [],
      setOrderNotifications: (notifications) => {
        set({ orderNotifications: notifications });
        get().setCombinedNotifications(); // Llama a la combinación después de setear las order
      },
      combinedNotifications: [],
      setCombinedNotifications: () => {
        const currentDate = new Date();
    
        // Filtra las medical y order notifications eliminando las que tienen `fecFinalizacion` vencida
        const filteredMedical = get().medicalNotifications.filter(
          (notification) =>
            !notification.fecFinalizacion || new Date(notification.fecFinalizacion) >= currentDate
        );
        const filteredOrders = get().orderNotifications.filter(
          (notification) =>
            !notification.fecFinalizacion || new Date(notification.fecFinalizacion) >= currentDate
        );
    
        // Combina las notificaciones filtradas
        const combined = [...filteredMedical, ...filteredOrders];
    
        // Actualiza el estado combinado
        set({ combinedNotifications: combined });
      },
    })
   /*  export const useNotificationStore = create<Store>((set, get) => ({
      medicalNotifications: [],
      setMedicalNotifications: (notifications) => {
        set({ medicalNotifications: notifications });
        get().setCombinedNotifications();
      },
      orderNotifications: [],
      setOrderNotifications: (notifications) => {
        set({ orderNotifications: notifications });
        get().setCombinedNotifications();
      },
      combinedNotifications: [],
      setCombinedNotifications: () => {
        const combined = [...get().medicalNotifications, ...get().orderNotifications];
        set({ combinedNotifications: combined });
      },
    }) */
  
  );