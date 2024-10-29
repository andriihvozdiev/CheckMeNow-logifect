import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'native-base';
import withReduxStore from '../../utils/withReduxStore';
import DatePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Platform } from 'react-native';
import UserStatus from '../../constants/userStatus';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ChooseDate = (props) => {
    const [pickerVisible, setPickerVisible] = useState(false);
    const [chooseDate, setChooseDate]
        = useState(new Date());

    const onVaccinationDateChange = (event, newDate) => {
        setChooseDate(newDate);
        if (Platform.OS !== 'ios') {
            setPickerVisible(false);
        }
    };

    return (
        <View style={{ flex: 1, marginTop: 20 }}>
            <View style={{ flex: 1, alignContent: 'center' }}>
                {Platform.OS === 'ios' ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                        <Text style={{ ...styles.defaultText, fontWeight: '300', marginRight: 20 }}>Choose Date:</Text>
                        <DatePicker
                            style={{ height: 50, width: '50%' }}
                            value={chooseDate}
                            minimumDate={new Date(1900, 1, 1)}
                            maximumDate={new Date()}
                            onChange={onVaccinationDateChange}
                        />
                        <TouchableOpacity
                            onPressIn={() => {
                                props.addMessage(
                                    'default',
                                    moment(chooseDate).format('LL'),
                                );
                            }}>
                            <Material right size={35} name="send-circle" />
                        </TouchableOpacity>
                    </View>
                ) : (
                        <View>
                            <TouchableOpacity onPress={() => setPickerVisible(true)}>
                                <Input
                                    style={{
                                        borderWidth: 1,
                                        padding: 20,
                                        alignContent: 'center',
                                        fontSize: 25,
                                        color: 'black',
                                    }}
                                    value={
                                        '__/__/____'
                                    }
                                    editable={false}
                                />
                            </TouchableOpacity>

                            {pickerVisible ? (
                                <DatePicker
                                    value={chooseDate}
                                    minimumDate={new Date(1900, 1, 1)}
                                    maximumDate={new Date()}
                                    onChange={onVaccinationDateChange}
                                />
                            ) : null}
                        </View>
                    )}
            </View>


        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default withReduxStore(ChooseDate);
