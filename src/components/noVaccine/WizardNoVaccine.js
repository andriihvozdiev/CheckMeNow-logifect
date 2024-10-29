import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HaveVaccine from './HaveVaccine';
import ImmunityPassport from './ImmunityPassport';
import SelectVaccinationCenter from './SelectVaccinationCenter';
import VaccinationAppointment from './VaccinationAppointment';
import HaveBooked from './HaveBooked';
import withReduxStore from '../../utils/withReduxStore';

const Stack = createStackNavigator();

class NoVaccineWizard extends React.Component {
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
                    headerBackTitleVisible: false
                }}
                initialRouteName="ImmunityPassport">
                <Stack.Screen
                    name="ImmunityPassport"
                    component={ImmunityPassport}
                    options={{ title: '' }}
                />
                <Stack.Screen
                    name="HaveVaccine"
                    component={HaveVaccine}
                    options={{ title: '' }}
                />
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
            </Stack.Navigator>
        );
    }
}

export default withReduxStore(NoVaccineWizard);
