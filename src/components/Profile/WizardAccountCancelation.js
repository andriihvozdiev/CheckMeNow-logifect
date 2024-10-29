import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AccountCancelation from './AccountCancelation';
import withReduxStore from '../../utils/withReduxStore';
import HeaderImage from '../HeaderImage';

const Stack = createStackNavigator();

class WizardAccountCancelation extends React.Component {
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
                initialRouteName="AccountCancelation">
                <Stack.Screen
                    name="AccountCancelation"
                    component={AccountCancelation}
                />
            </Stack.Navigator>
        );
    }
}

export default withReduxStore(WizardAccountCancelation);
