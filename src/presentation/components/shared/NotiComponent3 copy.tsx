import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { xml2js } from 'xml-js';
import { useNotificationStore } from '../../store/notification-store';
import { useAuthStore } from '../../store/auth/useAuthStore';


interface Notificacion {
  idOrden: string;
  visto: string;
}

const NotiComponent3 = () => {

  console.log('Inicializando componente de notificaciones (NotiComponent3)->', );
  
  const { idAfiliado, actualizarNotificaciones, setShouldUpdateNotifications } = useAuthStore();
  const setMedicalNotifications = useNotificationStore((state) => state.setMedicalNotifications);
  const setOrderNotifications = useNotificationStore((state) => state.setOrderNotifications); 
  const combinedNotifications = useNotificationStore((state) => state.combinedNotifications);
 const { medicalNotifications, orderNotifications} = useNotificationStore.getState()

  useEffect(() => {

    if (actualizarNotificaciones) {

    const fetchNotifications = async () => {
  const ProductsRequest = async () => {
    console.log('Ingresando en ProductsRequest (Consulta de Estudios Medicos)');
    try {
   
      const response = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/APPBuzonActualizarORDENPRAC?idAfiliado=${idAfiliado}&IMEI=`);
      const xmlData = response.data;
      const result = xml2js(xmlData, { compact: true });
        // @ts-ignore
      const tablaDatos = result.Resultado?.tablaDatos;
       // @ts-ignore
      const tablaDetalle = result.Resultado?.tablaDetalle;


            // @ts-ignore
            const notificacionesData = result.Resultado?.tablaDatos;
            /* console.log('notificacionesData---->', notificacionesData ); */


            if (!notificacionesData) {
              console.log('En ProductsRequest notificacionesData es undefined: No hay notificaciones de Estudios Medicos para este usuario.');
              setMedicalNotifications([]);  
              
              return;
            }
    
        
            // Mapear los datos original
          /*  const mappedNotificaciones: Notificacion[] = Array.isArray(notificacionesData.idOrden) ? notificacionesData.idOrden.map((_: any, index: number) => ({
              idOrden: notificacionesData.idOrden[index]._text,
              visto: 'no visto'
            })) : []; */

            /* prueba 2 */
           
      const mappedNotificaciones: Notificacion[] = Array.isArray(notificacionesData.idOrden)
        ? notificacionesData.idOrden.map((_: any, index: number) => {
          const idOrden = notificacionesData.idOrden[index]._text;

          // Buscar si ya existe una notificación con este idOrden
          const { medicalNotifications  } = useNotificationStore.getState()
          
          const existingNotification = medicalNotifications.find(notification => notification.idOrden === idOrden);

          // Si existe, mantener la propiedad 'visto' que ya tiene
          if (existingNotification) {
       
            return  existingNotification/* { ...existingNotification, idOrden }; */
          }

          // Si no existe, crear una nueva notificación con 'visto: no visto'
          return { idOrden, visto: 'no visto' };
        })
        : [];

            setMedicalNotifications(mappedNotificaciones);  
           


    } catch (error) {
      console.error('Error en ProductsRequest de NOTI COMPONENT3 (notificaciones de Estudios Medicos) error:', error);
    }
  };

  const CombinedData2 = async () => {
    
    try {
   
      const response = await axios.get(`https://srvloc.andessalud.com.ar/WebServicePrestacional.asmx/APPBuzonActualizarORDENAMB?idAfiliado=${idAfiliado}&IMEI=`);
      const xmlData = response.data;
      const result = xml2js(xmlData, { compact: true });
       // @ts-ignore
      const tablaDatos = result.Resultado?.tablaDatos;
       // @ts-ignore
      const tablaDetalle = result.Resultado?.tablaDetalle;

      if (!tablaDatos || !tablaDetalle) {
        console.log('En CombinedData2 tablaDatos o tablaDetalle es undefined: No hay notificaciones de ordenes de consulta para este afiliado.');
        setOrderNotifications([]);
        return;
      }
        const prestador = tablaDatos.prestador.map((item: any) => (item._text || '').trim());
        

      const idOrden = tablaDatos.idOrden.map((item: any) => (item._text || '').trim());

/*       const combinedData = idOrden.map((id: string, index: number) => {
      
        const existingNotification = orderNotifications.find(notification => notification.idOrden === id);
      
        if (existingNotification) {
          return { ...existingNotification, idOrden };
        }
      
        return { idOrden: id, visto: 'no visto' };
      }); */

      const idOrdenArray = tablaDatos.idOrden.map((item: any) => (item._text || '').trim());

      const combinedData = idOrdenArray.flatMap((idList: any, index: number) => {
        
      /*   console.log(`Procesando idList en index ${index}:`, idList);  */// 
      
        // Si idList es un string, lo convertimos en un array con un solo elemento
        if (typeof idList === 'string') {
          idList = [idList];
        } else if (!Array.isArray(idList)) {
          console.error(`Error: idList en index ${index} no es un array ni un string.`, idList);
          return []; // Devolver un array vacío si no es un array ni un string
        }
      
        // Descomponer el array de idOrden en notificaciones individuales
        return idList.map((id: string) => {
          // Buscar si ya existe una notificación con este idOrden en orderNotifications

          const { /* medicalNotifications, */ orderNotifications} = useNotificationStore.getState()

          const existingNotification = orderNotifications.find(notification => notification.idOrden === id);
      
          // Si existe, mantener la propiedad 'visto' que ya tiene
          if (existingNotification) {
            return { idOrden: id, visto: existingNotification.visto };
          }
      
          // Si no existe, crear una nueva notificación con 'visto: no visto'
          return { idOrden: id, visto: 'no visto' };
        });
      });
      
      setOrderNotifications(combinedData); 
     
    } catch (error) {
      console.log('Error en Noti Component 3. en CombinedData2 (las notficaciones de las ordenes de consulta):', error);

    }
  }

    await ProductsRequest();
    await CombinedData2();
    console.log('Si se consultaron las notificaciones-##############>', );
    console.log('se actualizaron las notificaciones-', );
    setShouldUpdateNotifications(false);
    console.log('se actualizo shouldUpdate a false-', );
  }

  fetchNotifications()

/*   const intervalId = setInterval(fetchNotifications, 500000000); 
  return () => clearInterval(intervalId); */
    }
    console.log('No se consultaron las notificaciones------------>', );


}, [actualizarNotificaciones]);

console.log('Finalizacion de lectura de componente de notificaciones (NotiComponent3)---->', );
return null; 
}


export default NotiComponent3;
