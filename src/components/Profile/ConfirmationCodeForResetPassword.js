/*
 *   Copyright (c) 2020 Grigore Crudu
 *   All rights reserved.
 */

import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { View, Text, Button } from 'native-base';
import { isCodeValid } from '../../utils/validation';
import { Auth } from 'aws-amplify';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';
import { Alert } from 'react-native';
import Colors from '../../constants/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import {
	CodeField,
	useClearByFocusCell,
	useBlurOnFulfill,
	Cursor
} from 'react-native-confirmation-code-field';

const ConfirmationCodeForResetPassword = (props) => {
	const [code, setCode] = useState("");
	const [isLoading, setIsLoading] = useState(false)

	const ref = useBlurOnFulfill({ code, cellCount: 6 });
	const [propss, getCellOnLayoutHandler] = useClearByFocusCell({
		value: code,
		setValue: setCode,
	});

	const maskEmail = (email) => {
		const [username, domain] = email.split('@');
		return username[0] + username.substr(1).replace(/./g, '*')
			+ '@' + domain[0] + domain.substr(1, domain.lastIndexOf('.')).replace(/./g, '*')
			+ domain.substr(domain.lastIndexOf('.'));
	}

	const checkConfirmCodeHandler = async () => {
		if (!isCodeValid(code)) {
			Alert.alert('Warning', 'Please, enter valid Code', [{ text: 'OK' }]);
			return;
		}
		try {
			setIsLoading(true);
			await Auth.verifyCurrentUserAttributeSubmit("email", code);
			if (props.route.params.to == 'password') {
				props.navigation.navigate('NewPasswordInput', {
					email: props.route.params.email
				});
			} else if ((props.route.params.to == 'pin')) {
				props.navigation.navigate('SetPinCode');
			}
		} catch (error) {
			Alert.alert('Warning', error.message, [{ text: 'OK' }]);
			setIsLoading(false);
		}
	};


	return (
		<KeyboardAvoidingView
			behavior="height"
			keyboardVerticalOffset='50'
			style={styles.container}>

			<View style={styles.upperSection}>
				<Text style={styles.h3}>Enter the 6-digit code</Text>

				<Text style={{ ...styles.defaultText, marginTop: 30 }}>
					We have sent an email to {maskEmail(props.route.params.email)}
					{'. '}Check your inbox including your spam and junk folders.
				</Text>

				<CodeField
					ref={ref}
					cellCount={6}
					{...propss}
					value={code}
					onChangeText={setCode}
					rootStyle={localStyles.codeFieldRoot}
					keyboardType="number-pad"
					textContentType="oneTimeCode"
					renderCell={({ index, symbol, isFocused }) => (

						<View
							onLayout={getCellOnLayoutHandler(index)}
							key={index}
							style={[localStyles.cellRoot, isFocused && localStyles.focusCell]}>
							<Text style={styles.cellText}>
								{symbol || (isFocused ? <Cursor /> : null)}
							</Text>
						</View>
					)}
					caretHidden={false} />


			</View>

			<View style={{ ...styles.bottomSection, paddingTop: 30 }}>
				<Button
					disabled={!code}
					style={code ? styles.button : styles.buttonDisabled}
					onPress={checkConfirmCodeHandler}>
					<Text style={code ? { ...styles.buttonTextSize, color: 'white' } : { ...styles.buttonTextSize, color: Colors.link }}>Continue</Text>
				</Button>
			</View>

		</KeyboardAvoidingView>
	);

}

const localStyles = StyleSheet.create({
	descriptionText: {
		fontSize: RFValue(17),
		fontFamily: 'Avenir Next Medium',
		marginTop: 30
	},
	codeFieldRoot: {
		marginTop: 20,
		width: 300,
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	cellRoot: {
		width: 40,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
	},
	cellText: {
		color: '#000',
		fontSize: 32,
		textAlign: 'center',
	},
	focusCell: {
		borderBottomColor: '#007AFF',
		borderBottomWidth: 2,
	},
});

export default withReduxStore(ConfirmationCodeForResetPassword);
