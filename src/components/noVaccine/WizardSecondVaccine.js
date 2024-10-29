import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SecondDoseExplanation from './SecondDoseExplanation';
import SecondVaccinationAppointment from './SecondVaccinationAppointment';
import AppointmentDetails from './AppointmentDetails';
import SecondHaveBooked from './SecondHaveBooked';
import withReduxStore from '../../utils/withReduxStore';

const Stack = createStackNavigator();

class WizardSecondVaccine extends React.Component {
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
                initialRouteName="SecondDoseExplanation">
                <Stack.Screen
                    name="SecondDoseExplanation"
                    component={SecondDoseExplanation}
                    options={{ title: '' }}
                />
                <Stack.Screen
                    name="SecondVaccinationAppointment"
                    component={SecondVaccinationAppointment}
                    options={{ title: '' }}
                />
                <Stack.Screen
                    name="SecondHaveBooked"
                    component={SecondHaveBooked}
                    options={{ title: '' }}
                />


            </Stack.Navigator>
        );
    }
}

export default withReduxStore(WizardSecondVaccine);
