import React, { useState, useEffect } from 'react';
import { View, Text, Button, Input } from 'native-base';
import { TouchableOpacity, Alert } from 'react-native';
import withReduxStore from '../../utils/withReduxStore';
import { styles } from '../registration/styles';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';


const SecondVaccinationAppointment = (props) => {

    const [appointmentDateTime, setAppointmentDateTime] =
        useState(moment(props.user.vaccinationDate).isValid() ?
            props.user.vaccinationDate : new Date());
    const [pickerVisible, setPickerVisible] = useState(false);
    const [mode, setMode] = useState('date');
    const [minuteInterval, setMinuteInterval] = useState(5);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            props.updateNavigation({ profileHeaderShown: true });
        });

        return () => unsubscribe();
    }, []);

    const showMode = currentMode => {
        setPickerVisible(true);
        setMode(currentMode);
    };

    const showDatePicker = () => {
        showMode('date');
    };

    const showTimePicker = () => {
        showMode('time');
    };


    const setDate = (event, selectedDate) => {
        if (selectedDate)
            if (Platform.OS === 'ios') {
                const currentDate = selectedDate || appointmentDateTime;
                setAppointmentDateTime(currentDate);
            }
        if (event.type === 'set') {

            const currentDate = selectedDate || appointmentDateTime;
            setAppointmentDateTime(currentDate);

            setPickerVisible(false);
        }

    }

    const setAppointmentDateHandler = () => {
        console.log('appointmentDateTime');
        console.log(moment(appointmentDateTime).toDate().getHours());
        const hour = moment(appointmentDateTime).toDate().getHours();
        if (hour < 8 || hour >= 20) {
            alert('Appointment time should be between 08.00am - 07.55pm.');
        }
        else {
            props.updateUser({
                vaccinationDate: appointmentDateTime,
            });
            console.log(props.user.vaccinationDate);

            props.navigation.push('SecondHaveBooked');
        }
    }

    useEffect(() => {
        setMinuteInterval(5);
    }, []);



    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.h3}>Vaccination appointment</Text>
            </View>
            <View style={{ marginTop: '15%' }}>
                <Text style={{ ...styles.defaultText, marginBottom: '5%' }}>
                    Please select the available date and time for the second
                    vaccination appointment.
                </Text>
            </View>

            <View style={{ flex: 1, marginTop: '10%' }}>

                {Platform.OS === 'ios' ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <Text style={{ ...styles.defaultText, fontWeight: '300', marginRight: 10 }}>
                            Date and time:
                        </Text>
                        <DateTimePicker
                            value={moment(appointmentDateTime).toDate()}
                            mode="datetime"
                            minuteInterval={minuteInterval}
                            style={{ height: 50, width: '100%' }}
                            minimumDate={new Date()}
                            onChange={setDate}
                        /></View>
                ) : (
                    <View>
                        <View>
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <Text style={{ fontWeight: 'bold' }}>Date: </Text>
                                <TouchableOpacity onPress={() => showDatePicker()}>
                                    <Text style={{ ...styles.defaultText, marginLeft: 10 }}>
                                        {
                                            appointmentDateTime
                                                ? moment(appointmentDateTime).format('DD/MM/YYYY')
                                                : '__/__/____'
                                        }
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', width: '100%', marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>Time: </Text>
                                <TouchableOpacity onPress={() => showTimePicker()}>
                                    <Text style={{ ...styles.defaultText, marginLeft: 10 }}>
                                        {
                                            appointmentDateTime
                                                ? moment(appointmentDateTime).format('HH:mm')
                                                : 'HH:MM'
                                        }
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {pickerVisible ? (
                            <DateTimePicker
                                mode={mode}
                                minuteInterval={minuteInterval}
                                display='spinner'
                                value={moment(appointmentDateTime).toDate()}
                                minimumDate={new Date()}
                                onChange={setDate}
                            />
                        ) : null}
                    </View>
                )}
            </View>

            <View style={styles.bottomSection}>
                <Button primary block
                    disabled={!appointmentDateTime}
                    onPress={setAppointmentDateHandler}
                >
                    <Text>Continue</Text>
                </Button>

                <Text
                    style={styles.noThanks}
                    onPress={() => props.navigation.navigate('Main')}>
                    No thanks
                </Text>
            </View>
        </View>
    );
};

export default withReduxStore(SecondVaccinationAppointment);
