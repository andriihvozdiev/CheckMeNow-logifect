import React, { Component } from 'react';
import { Button, Text, View } from 'native-base';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';
import { vh, vw } from 'react-native-expo-viewport-units';

class OperationFailed extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	handleNotNow = () => {
		this.props.navigation.navigate('Main')
	}

	render() {
		return (
			<View style={styles.container} >
				<View style={styles.upperSection} >
					<View style={localStyles.logoContainer}>
						<Image
							source={require('../../../assets/operation_failed.png')}
							style={{
								height: vh(20),
								width: vw(40),
								resizeMode: 'contain',
							}}
						/>
					</View>
					<View style={{ paddingHorizontal: vh(3), marginTop: 30, alignItems: 'flex-start' }}>
						<Text style={styles.h3}>Operation Failed</Text>
					</View>
					<View style={{ ...styles.defaultText, paddingHorizontal: vh(3), marginTop: 20 }}>
						<View>
							<Text style={{ lineHeight: 24 }}>
								Unfortunately, the connection to your Electronic Health Records has failed. Please check again that the personal details and linkage details are correct.
							</Text>
						</View>
					</View>

				</View>

				<View style={styles.bottomSection}>
					<Button
						primary
						onPress={() => {
							this.props.navigation.push('PersonalDetailsForLinkage');
						}}
						block>
						<Text style={styles.defaultText}>Verify personal details</Text>
					</Button>
					<View style={localStyles.bottomTextContainer}>
						<TouchableOpacity onPress={() => this.handleNotNow()} disabled={this.state.isLoading}>
							<Text style={{ ...styles.link, ...styles.buttonTextSize }}>
								Not now
                </Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}

const localStyles = StyleSheet.create({
	logoContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: '10%',
	},
	bottomTextContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 20
	},
});

export default withReduxStore(OperationFailed);
