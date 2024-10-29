import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TermsAndConditions from './TermsAndConditions';
import withReduxStore from '../../utils/withReduxStore';
import HeaderImage from '../HeaderImage';

const Stack = createStackNavigator();

class WizardTermsAndConditions extends React.Component {
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
                initialRouteName="TermsAndConditions">
                <Stack.Screen
                    name="TermsAndConditions"
                    component={TermsAndConditions}
                />
            </Stack.Navigator>
        );
    }
}

export default withReduxStore(WizardTermsAndConditions);
