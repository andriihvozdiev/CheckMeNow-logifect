import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'native-base';
import withReduxStore from '../../utils/withReduxStore';
import DatePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Platform } from 'react-native';
import UserStatus from '../../constants/userStatus';

const VaccinationDate = (props) => {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [vaccinationDate, setVaccinationDate]
    = useState(props.user.vaccinationDate &&
      moment(props.user.vaccinationDate).isValid()
      ? moment(props.user.vaccinationDate).toDate() : new Date());

  const onVaccinationDateChange = (event, newDate) => {
    setVaccinationDate(newDate);
    if (Platform.OS !== 'ios') {
      setPickerVisible(false);
    }
  };

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <View style={{ flex: 1 }}>
        {Platform.OS === 'ios' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            <Text style={{ ...styles.defaultText, fontWeight: '300', marginRight: 10 }}>Vaccination Date:</Text>
            <DatePicker
              style={{ height: 50, width: '100%' }}
              value={vaccinationDate}
              minimumDate={new Date(1900, 1, 1)}
              maximumDate={new Date()}
              onChange={onVaccinationDateChange}
            />
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
                    props.user.vaccinationDate &&
                      moment(props.user.vaccinationDate).isValid()
                      ? moment(props.user.vaccinationDate).format('DD/MM/YYYY')
                      : '__/__/____'
                  }
                  editable={false}
                />
              </TouchableOpacity>

              {pickerVisible ? (
                <DatePicker
                  value={vaccinationDate}
                  minimumDate={new Date(1900, 1, 1)}
                  maximumDate={new Date()}
                  onChange={onVaccinationDateChange}
                />
              ) : null}
            </View>
          )}
      </View>
      <View style={{ marginTop: 30 }}>
        <Button
          onPress={() => {
            props.updateUser({
              vaccinationDate: moment(vaccinationDate),
              userStatus: UserStatus.AWAITING_VACCINATION,
            });
            props.addMessage(
              'default',
              moment(vaccinationDate).format('LL'),
            );
          }}
          block>
          <Text>SET</Text>
        </Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withReduxStore(VaccinationDate);
