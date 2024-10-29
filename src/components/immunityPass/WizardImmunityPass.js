import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../styles';

import ImmunityPassDescription from './ImmunityPassDescription';
import SuccessfulImmunityPass from './SuccessfulImmunityPass';
import CertificateDetails from './CertificateDetails';
import TakeSelfiePhoto from './TakeSelfiePhoto';
import PictureIsOk from './PictureIsOk';
import withReduxStore from '../../utils/withReduxStore';
import HeaderImage from '../HeaderImage';

const Stack = createStackNavigator();

class WizardImmunityPass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    setHeaderRight = () => {
		return (
			<TouchableOpacity
				onPress={() => {
					this.closeHandler()
				}}
			>
				<MaterialIcons
					style={styles.closeIcon}
					name={"close"}
					size={30}
				/>
			</TouchableOpacity>
		);
	};

	closeHandler = () => {
		this.props.navigation.navigate('Main');
	}

    render() {
        return (
            <Stack.Navigator
                headerMode="screen"
                screenOptions={{
                    headerShown: this.props.navigationData.profileHeaderShown,
                    headerBackTitleVisible: false,
                    headerTitle: () => <HeaderImage />,
                    headerTitleAlign: 'center',
                    headerRight: () => this.setHeaderRight(),
                }}
                initialRouteName="ImmunityPassDescription">
                <Stack.Screen
                    name="ImmunityPassDescription"
                    component={ImmunityPassDescription}
                />
                <Stack.Screen
                    name="TakeSelfiePhoto"
                    component={TakeSelfiePhoto}
                />
                <Stack.Screen
                    name="PictureIsOk"
                    component={PictureIsOk}
                />
                <Stack.Screen
                    name="CertificateDetails"
                    component={CertificateDetails}
                    options={{ headerTitle: 'Vaccine Certificate' }}
                />
                {/*<Stack.Screen
                    name="SuccessfulImmunityPass"
                    component={SuccessfulImmunityPass}
                    options={{ title: '' }}
                />*/}

            </Stack.Navigator>
        );
    }
}

export default withReduxStore(WizardImmunityPass);
