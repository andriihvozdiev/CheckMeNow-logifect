import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyDetails from './MyDetails';
import withReduxStore from '../../utils/withReduxStore';
import HeaderImage from '../HeaderImage';

const Stack = createStackNavigator();

class WizardMyDetails extends React.Component {
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
                initialRouteName="MyDetails">
                <Stack.Screen
                    name="MyDetails"
                    component={MyDetails}
                />
            </Stack.Navigator>
        );
    }
}

export default withReduxStore(WizardMyDetails);
