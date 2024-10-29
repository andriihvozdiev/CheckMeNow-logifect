import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { View, Text, Button } from 'native-base';
import LocationsMap from '../Chat/LocationsMap';
import withReduxStore from '../../utils/withReduxStore';
import moment from 'moment';
import { styles } from '../registration/styles';

const AppointmentDetails = (props) => {
    const [centerNameState, setCenterNameState] = useState(props.user.vaccinationCenter);

    /*const markerClickHandler = (marker) => {
        setCenterNameState(marker.gpSurgery.Name);
        props.updateUser({ vaccinationCenter: marker.gpSurgery.Name });
    };*/

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            props.updateNavigation({ profileHeaderShown: true });
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.h3}>Appointment Details</Text>
            </View>
            <View style={{ flex: 5, marginVertical: '10%' }}>
                <Text style={{ ...styles.defaultText, fontWeight: '400', marginRight: 10, textAlign: 'center', marginBottom: '10%' }}>
                    Date and time:{' '} {moment(props.user.vaccinationDate).format('DD/MM/YYYY HH:mm')}
                </Text>


                <LocationsMap
                    postCodeLocation={props.user.postCode ? props.user.postCode : 'TN48JX'}
                    bookedGP={centerNameState}
                //markerClick={markerClickHandler}
                />
            </View>
            <View style={{ flex: 1 }}>
                <View>
                    <Text style={{ ...styles.h3, fontWeight: '500' }}>Selected Centre</Text>
                </View>
                <View style={{ marginTop: '5%', alignItems: 'center' }}>
                    <Text style={styles.defaultText}>{props.user.vaccinationCenter}</Text>
                </View>
            </View>

            <View style={styles.bottomSection}>
                <TouchableOpacity block warning
                    onPress={() => {
                        Alert.alert(
                            'Cancel appointment',
                            'Are you sure?',
                            [
                                {
                                    text: 'Yes',
                                    onPress: () => {
                                        props.updateUser({
                                            vaccinationCenter: null,
                                            vaccinationDate: null
                                        });
                                        props.navigation.navigate('Main');
                                    }
                                },
                                {
                                    text: 'No'
                                }
                            ]);

                    }}>
                    <Text style={{ ...styles.defaultText, color: 'red', textAlign: 'center', fontWeight: '500' }}>Cancel appointment</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default withReduxStore(AppointmentDetails);
