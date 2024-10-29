import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DemoScenarios from './DemoScenarios';
import withReduxStore from '../../utils/withReduxStore';
import HeaderImage from '../HeaderImage';

const Stack = createStackNavigator();

class WizardDemoScenarios extends React.Component {
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
                initialRouteName="DemoScenarios">
                <Stack.Screen
                    name="DemoScenarios"
                    component={DemoScenarios}
                />
            </Stack.Navigator>
        );
    }
}

export default withReduxStore(WizardDemoScenarios);
