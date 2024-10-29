import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import withReduxStore from '../../utils/withReduxStore';
import CertificateDetails from './CertificateDetails';
import OperationFailed from './OperationFailed';

const Stack = createStackNavigator();

class WizardCertificateDetails extends React.Component {
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
                    headerTitleAlign: 'center',
                }}
                initialRouteName="CertificateDetails">
                <Stack.Screen
                    name="CertificateDetails"
                    component={CertificateDetails}
                    options={{ title: 'Vaccine Certificate' }}
                />
                <Stack.Screen
                    name="OperationFailed"
                    component={OperationFailed}
                    options={{ headerShown: false }}
                />


            </Stack.Navigator>
        );
    }
}

export default withReduxStore(WizardCertificateDetails);
