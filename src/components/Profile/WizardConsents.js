import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Consents from './Consents';
import withReduxStore from '../../utils/withReduxStore';
import HeaderImage from '../HeaderImage';

const Stack = createStackNavigator();

class WizardConsents extends React.Component {
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
                    headerTitle: () => <HeaderImage />,
                    headerTitleAlign: 'center'
                }}
                initialRouteName="Consents">
                <Stack.Screen
                    name="Consents"
                    component={Consents}
                />
            </Stack.Navigator>
        );
    }
}

export default withReduxStore(WizardConsents);