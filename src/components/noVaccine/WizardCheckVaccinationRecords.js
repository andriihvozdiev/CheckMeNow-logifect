import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CheckVaccinationRecords from './CheckVaccinationRecords';
import HeaderImage from '../HeaderImage';
import withReduxStore from '../../utils/withReduxStore';
import NotYetImmune from './NotYetImmune';
import { styles } from '../styles';

const Stack = createStackNavigator();

class WizardCheckVaccinationRecords extends React.Component {
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
				initialRouteName="CheckVaccinationRecords">
				<Stack.Screen
					name="CheckVaccinationRecords"
					component={CheckVaccinationRecords}

				/>
				<Stack.Screen
					name="NotYetImmune"
					component={NotYetImmune}
				/>


			</Stack.Navigator>
		);
	}
}

export default withReduxStore(WizardCheckVaccinationRecords);
