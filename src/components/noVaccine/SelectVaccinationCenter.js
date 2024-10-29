import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';
import LocationsMap from '../Chat/LocationsMap';
import withReduxStore from '../../utils/withReduxStore';
import { styles } from '../registration/styles';

const SelectVaccinationCenter = (props) => {
    const [centerNameState, setCenterNameState] = useState(props.user.vaccinationCenter);
    const markerClickHandler = (marker) => {
        console.log(marker)
        setCenterNameState(marker.gpSurgery.Name);
        props.updateUser({ vaccinationCenter: marker.gpSurgery.Name });
    };

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            props.updateNavigation({ profileHeaderShown: true });
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.h3}>Vaccination Centre</Text>
            </View>
            <View style={{ flex: 5, marginVertical: '10%' }}>
                <Text style={{ ...styles.defaultText, marginBottom: '10%' }}>
                    Bellow is the map of centers where you can book
                    and receive the vaccine. Tap on the center that suits
                    you best.
                    </Text>


                <LocationsMap
                    postCodeLocation={props.user.postCode ? props.user.postCode : 'TN48JX'}
                    markerClick={markerClickHandler}
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
                <Button primary block
                    disabled={!centerNameState}
                    onPress={() => props.navigation.navigate('VaccinationAppointment')}>
                    <Text>Continue</Text>
                </Button>
            </View>
        </View>
    );
};

export default withReduxStore(SelectVaccinationCenter);
