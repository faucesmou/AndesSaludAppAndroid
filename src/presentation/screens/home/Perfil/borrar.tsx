notificaciones.length > 0 ?
                  (
                    <>
                      

                      {notificaciones.map((notificacion, index) => (
                      <Pressable
                      key={index} 
                        onPress={() => {
                          console.log('se toco en la notificacion')
                        }}

                      >
                        <View style={styles.TertiaryButton}>
                         
                          <View style={styles.contentWrapper2}>
                            <View style={styles.textWrapper}>

                            <Text style={styles.buttonText}>
                                  
                                (notificacion.messageId)
                                </Text>

                              {notificacion.title && (
                                <Text style={styles.buttonText}>
                            
                                (notificacion.title)
                                </Text>
                              )}

                              {notificacion.messageBody && (
                                <Text style={styles.descriptionText}>
                                   {notificacion.messageBody}
                                </Text>
                              )}
                              {notificacion.extraInfo && (
                                <Text style={styles.descriptionText}>
                                   {notificacion.extraInfo}
                                </Text>
                              )}
                              {notificacion.timestamp && (
                                <Text style={styles.descriptionText}>
                                   {notificacion.timestamp}
                                </Text>
                              )}
                            </View>

                          </View>

                        </View>
                      </Pressable>
                      )
                      ) } 