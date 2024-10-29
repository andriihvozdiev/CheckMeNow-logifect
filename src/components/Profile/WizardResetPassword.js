import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ResetPassword from './ResetPassword';
import CheckSecurityQuestion from './CheckSecurityQuestion';
import CheckOldPasswordInput from './CheckOldPasswordInput';
import ConfirmationCodeForResetPassword from './ConfirmationCodeForResetPassword';
import NewPasswordInput from './NewPasswordInput';
import withReduxStore from '../../utils/withReduxStore';
import HeaderImage from '../HeaderImage';

const Stack = createStackNavigator();

class WizardResetPassword extends React.Component {
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
                initialRouteName="ResetPassword">
                <Stack.Screen
                    name="ResetPassword"
                    component={ResetPassword}
                />

                <Stack.Screen
                    name="CheckSecurityQuestion"
                    component={CheckSecurityQuestion}
                    options={{ title: '' }}
                />

                <Stack.Screen
                    name="CheckOldPasswordInput"
                    component={CheckOldPasswordInput}
                    options={{ title: '' }} />

                <Stack.Screen
                    name="ConfirmationCodeForResetPassword"
                    component={ConfirmationCodeForResetPassword}
                    options={{ title: '' }}
                />

                <Stack.Screen
                    name="NewPasswordInput"
                    component={NewPasswordInput}
                    options={{ title: '' }}
                />

            </Stack.Navigator>
        );
    }
}

export default withReduxStore(WizardResetPassword);
