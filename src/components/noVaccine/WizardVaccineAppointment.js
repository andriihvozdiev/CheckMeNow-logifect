import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SelectVaccinationCenter from './SelectVaccinationCenter';
import VaccinationAppointment from './VaccinationAppointment';
import AppointmentDetails from './AppointmentDetails';
import HaveBooked from './HaveBooked';
import withReduxStore from '../../utils/withReduxStore';

const Stack = createStackNavigator();

class WizardVaccineAppointment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Stack.Navigator
                headerMode="screen"
                screenOptions={{
                    headerShown: this.props.navigationData.profileHeaderShown,
                    headerBackTitleVisible: false,
                }}
                initialRouteName="SelectVaccinationCenter">
                <Stack.Screen
                    name="SelectVaccinationCenter"
                    component={SelectVaccinationCenter}
                    options={{ title: '' }}
                />
                <Stack.Screen
                    name="VaccinationAppointment"
                    component={VaccinationAppointment}
                    options={{ title: '' }}
                />
                <Stack.Screen
                    name="HaveBooked"
                    component={HaveBooked}
                    options={{ title: '' }}
                />
                <Stack.Screen
                    name="AppointmentDetails"
                    component={AppointmentDetails}
                    options={{ title: '' }}
                />


            </Stack.Navigator>
        );
    }
}

export default withReduxStore(WizardVaccineAppointment);
