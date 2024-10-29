import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppointmentDetails from './AppointmentDetails';
import withReduxStore from '../../utils/withReduxStore';

const Stack = createStackNavigator();

class WizardAppointmentDetails extends React.Component {
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
                initialRouteName="AppointmentDetails">
                <Stack.Screen
                    name="AppointmentDetails"
                    component={AppointmentDetails}
                    options={{ title: '' }}
                />
            </Stack.Navigator>
        );
    }
}

export default withReduxStore(WizardAppointmentDetails);
