import React, { Component } from 'react';
import { Button, Input, Item, Text, View } from 'native-base';
import { TouchableOpacity, Alert, ScrollView, Keyboard, ActivityIndicator } from 'react-native';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import UserStatus from '../../constants/userStatus';
import patientRecords from '../../da/patientRecords'
import moment from 'moment';
import { ErrorMessage } from '../../utils/component_utils';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

class InputLinkageKey extends Component {
	constructor(props) {
		super(props);
		this.state = {
			linkageKey: "",
			accountID: "",
			gpOdsCode: "",
			validation: false,
			disabledBtn: false,
		}
	}
	componentDidMount = () => {

		this.keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			this._keyboardDidShow,
		);
		this.keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			this._keyboardDidHide,
		);

		this.unsubscribe = this.props.navigation.addListener('focus', () => {
			this.props.updateNavigation({ profileHeaderShown: true });
		});
	};
	componentDidUpdate = (prevProps, prevState) => {

		if (prevProps != null) {
			if (this.props.linkageKey != prevProps.linkageKey) {
				this.setLinkageKey(this.props.linkageKey)
			}
			if (this.props.accountID != prevProps.accountID) {
				this.setAccountID(this.props.accountID)
			}
			if (this.props.gpOdsCode != prevProps.gpOdsCode) {
				this.setOdsCode(this.props.gpOdsCode)
			}
		}
	}

	componentWillUnmount = () => {
		this.unsubscribe();
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	};

	_keyboardDidShow = () => {
		this.setState({ keyboardOpen: true });
	}

	_keyboardDidHide = () => {
		this.setState({ keyboardOpen: false });
	}

	setLinkageKey = (value) => {
		this.setState({ linkageKey: value });
	};
	setAccountID = (value) => {
		this.setState({ accountID: value });

	};

	setOdsCode = (value) => {
		this.setState({ gpOdsCode: value });
	};

	render() {
		return (
			<View style={styles.container} >
				<View style={styles.upperSection} >
					<View>
						<Text style={styles.h3}>Electronic health record credentials</Text>
					</View>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={{ display: this.state.keyboardOpen ? 'none' : null }}>
							<Text style={{ ...styles.defaultText, marginTop: 6 }}>
								Please input the Linkage Key and the Account ID received from
								the GP surgery to link the application to your electronic health
								records.
							</Text>
							{/*<Text style={{ ...styles.defaultText, color: '#962a2e', fontStyle: 'italic', marginTop: 16 }}>
								This is a beta version and you should receive a test linkage key
								from CheckMeNow. Please check you email inbox.
							</Text>*/}
						</View>
						<View style={{ marginTop: 12 }}>
							<View>
								<Item>
									<Input
										placeholder="Linkage Key"
										onChangeText={this.setLinkageKey}
										returnKeyType="done"
										value={this.state.linkageKey}
									/>
									<TouchableOpacity onPress={() => {
										this.props.navigation.navigate('ScanLinkageKey', {
											type: 'linkageKey'
										});
									}}>
										<MaterialIcons right size={30} name="photo-camera" />
									</TouchableOpacity>
								</Item>
								<ErrorMessage show={this.state.validation && this.state.linkageKey.length < 10}>
									The value is invalid. Please check again.
								</ErrorMessage>
							</View>
							<View style={{ marginTop: 6 }}>
								<Item>
									<Input
										placeholder="Account ID"
										value={this.state.accountID}
										returnKeyType="done"
										onChangeText={this.setAccountID}
									/>

									<TouchableOpacity onPress={() => {
										this.props.navigation.navigate('ScanLinkageKey', {
											type: 'accountID'
										});
									}}>
										<MaterialIcons right size={30} name="photo-camera" />
									</TouchableOpacity>

								</Item>
								<ErrorMessage show={this.state.validation && this.state.accountID.length < 9}>
									The value is invalid. Please check again.
								</ErrorMessage>
							</View>
							<View style={{ marginTop: 6 }}>
								<Item>
									<Input
										placeholder="GP ODS Code"
										value={this.state.gpOdsCode}
										returnKeyType="done"
										onChangeText={this.setOdsCode}
									/>

									<TouchableOpacity onPress={() => {
										this.props.navigation.navigate('ScanLinkageKey', {
											type: 'gpOdsCode'
										});
									}}>
										<MaterialIcons right size={30} name="photo-camera" />
									</TouchableOpacity>
								</Item>
								<ErrorMessage show={this.state.validation && this.state.gpOdsCode.length < 6}>
									The value is invalid. Please check again.
                            </ErrorMessage>
							</View>
						</View>
						<View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '10%' }}>
							<ActivityIndicator
								animating={this.state.disabledBtn}
								size="large"
								color="#00ff00"
							/>
						</View>
					</ScrollView>

				</View>
				<View style={styles.bottomSection}>
					<Button
						primary
						disabled={this.state.disabledBtn}
						onPress={async () => {
							this.setState({ validation: true })
							if (this.state.linkageKey.length >= 10 &&
								this.state.accountID.length >= 9 &&
								this.state.gpOdsCode.length >= 6) {
								const patientDetails = {
									userId: this.props.user.id,
									surname: this.props.user.lastName,
									linkageKey: this.state.linkageKey,
									accountID: this.state.accountID,
									dateOfBirth: moment(this.props.user.dateOfBirth).format("YYYY-MM-DD"),
									gpOdsCode: this.state.gpOdsCode
								};
								console.log("patientDetails")
								console.log(patientDetails)

								this.setState({ disabledBtn: true });
								const registerResult = await patientRecords.registerPatient(patientDetails);
								this.setState({ disabledBtn: false });
								if (registerResult.statusCode === 500) {
									this.props.navigation.navigate('OperationFailed')
									return;
								}

								this.props.updateUser({ userStatus: registerResult.userStatus ? registerResult.userStatus : UserStatus.AWAITING_VACCINATION });
								Alert.alert(
									'Connected',
									'You have successfully connected to your Electronic Health Records.',
									[
										{
											text: 'OK',
											onPress: () => this.props.navigation.navigate('WizardCheckVaccinationRecords')
										},

									]);
							}
						}}
						style={styles.button}>
						<Text style={styles.buttonTextSize}>Continue</Text>
					</Button>

					<Text
						style={styles.noThanks}
						onPress={() => this.props.navigation.navigate('Main')}>
						Cancel
                	</Text>
				</View>
			</ View>
		);
	}
}


export default withReduxStore(InputLinkageKey);