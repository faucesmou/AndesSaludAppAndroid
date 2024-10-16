import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNotificationStore } from '../../store/notification-store';
import { IonIcon } from './IonIcon';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
interface Props {
  counter?:number;

}
interface Props2 {
  IonIconSize?:number;
}

const NotificationBadge = ( {counter }: Props) => {
  return (
    <View style={styles.badge}>
      <Text style={{display: 'flex', flexWrap: 'nowrap', color: 'black',
    fontSize: wp('2.4%'),
    fontWeight: 'bold', marginTop:wp('-0.5%')}/* styles.badgeText */}>{counter}</Text>
    </View>
  );
};


const NotiMensajes = ( {IonIconSize}: Props2) => {

  let IconSize = IonIconSize || 35
  
  const combinedNotifications = useNotificationStore((state) => state.combinedNotifications); 
  // Calcular el número de notificaciones no vistas
  const unseenNotificationsCount = combinedNotifications.filter(notification => notification.visto === 'no visto').length;
  console.log(' Los mensajes no vistos son.--->',unseenNotificationsCount );
  
  
  return (
    <View style={{ display: 'flex', flexWrap: 'nowrap', /* marginTop: 15, */  marginTop: wp('6%'), /* backgroundColor:'green' */ }}>
      <IonIcon name='notifications-outline' color={'white'} size={IconSize} />
      {unseenNotificationsCount > 0 && (
        <NotificationBadge counter={unseenNotificationsCount} />
      )}
    </View>
  );
};



const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5, // Ajustar según sea necesario
    right: -5, // Ajustar según sea necesario
    backgroundColor: 'yellow',
    borderRadius: 20,
    width: 22, // Establecer el ancho igual al borderRadius
    height: 20, // Establecer la altura igual al borderRadius
    padding: 5,
    zIndex: 1, // Asegurarse de que esté por encima del ícono
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default NotiMensajes;


    {/*  {unseenNotificationsCount > 0 ? (
       <>
         <Text style={{ color: 'white', marginLeft: 10 }}>
           {unseenNotificationsCount}
         </Text>
       </>
     ) : (
       <>
       </>
     )} */}