import React, { Component } from 'react';
import { View, Text, Button, Item, Input } from 'native-base';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';
import Consents from '../../constants/consents';

class InsertLinkageKey extends Component {
	constructor(props) {
		super(props);
		this.state = {
			key: ''
		}
	}
	componentDidMount = () => {
		this.unsubscribe = this.props.navigation.addListener('focus', () => {
			this.props.updateNavigation({ profileHeaderShown: true });
		});

		this.setKey(this.props.route.params.key)
	};

	componentWillUnmount = () => {
		this.unsubscribe();
	};

	arePersonalDetailsReady = () => {
		return this.props.user.firstName &&
			this.props.user.lastName &&
			this.props.user.dateOfBirth
	}

	setKey = (value) => {
		this.setState({ key: value });
	};

	showTitle = () => {
		switch (this.props.route.params.type) {
			case 'linkageKey':
				return <Text style={styles.h3}>Insert Linkage Key</Text>
			case 'accountID':
				return <Text style={styles.h3}>Insert Account ID</Text>
			case 'gpOdsCode':
				return <Text style={styles.h3}>Insert GP ODS Code</Text>
			default:
				return <Text style={styles.h3}>Insert Linkage Key</Text>;
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.upperSection}>
					<View style={{ flex: 1 }}>
						{this.showTitle()}
					</View>
					<View style={{ flex: 3 }}>
						<Text style={{ ...styles.defaultText }}>
							The recognized
							{this.props.route.params.type == 'linkageKey' ? ` Linkage Key value is the following` :
								this.props.route.params.type == 'accountID' ? ` Account ID value is the following` :
									this.props.route.params.type == 'gpOdsCode' ? ` ODS Code value is the following` : null}
						</Text>

						<Item style={{ marginVertical: 50 }}>
							<Input
								style={{ ...styles.h3 }}
								placeholder="Key"
								onChangeText={this.setKey}
								returnKeyType="done"
								textAlign="center"
								value={this.state.key}
							/>
						</Item>

						<Text style={styles.defaultText}>
							Would you like to insert it?
						</Text>
					</View>
				</View>
				<View style={styles.bottomSection}>
					<Button
						primary
						onPress={() => {
							if (this.props.route.params.type == 'linkageKey') {
								this.props.handleLinkAgeKeyUpdate(this.state.key);
							} else if (this.props.route.params.type == 'accountID') {
								this.props.handleAccountIDUpdate(this.state.key);
							} else if (this.props.route.params.type == 'gpOdsCode') {
								this.props.handleGpOdsCodeUpdate(this.state.key);
							}

							this.props.navigation.navigate('InputLinkageKey')
						}}
						style={styles.button}>
						<Text style={styles.buttonTextSize}>Yes</Text>
					</Button>

					<Text
						style={styles.noThanks}
						onPress={() => this.props.navigation.navigate('ScanLinkageKey')}>
						Scan again
					</Text>
				</View>
			</View>
		);
	}
}
export default withReduxStore(InsertLinkageKey);