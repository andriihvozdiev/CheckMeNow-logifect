import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VaccinationDateExplanation from './VaccinationDateExplanation';
import InputLinkageKey from './InputLinkageKey';
import ScanLinkageKey from './ScanLinkageKey';
import InsertLinkageKey from './InsertLinkageKey';
import OperationFailed from './OperationFailed';
import PersonalDetailsForLinkage from './PersonalDetailsForLinkage';
import AccessHealthDataConsent from './AccessHealthDataConsent';
import LinkToGP from './LinkToGP';
import withReduxStore from '../../utils/withReduxStore';
import HeaderImage from '../HeaderImage';
import InformationScreen from './InformationScreen';


const Stack = createStackNavigator();

class WizardNoNhsLinkage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            linkageKey: '',
            accountID: '',
			gpOdsCode: '',
        };

        this.handleLinkAgeKeyUpdate = this.handleLinkAgeKeyUpdate.bind(this);
        this.handleAccountIDUpdate = this.handleAccountIDUpdate.bind(this);
        this.handleGpOdsCodeUpdate = this.handleGpOdsCodeUpdate.bind(this);
    }

    handleLinkAgeKeyUpdate(_linkageKey) {
        this.setState({ linkageKey: _linkageKey });
    }

    handleAccountIDUpdate(_accountID) {
        this.setState({ accountID: _accountID })
    }
    
    handleGpOdsCodeUpdate(_gpOdsCode) {
        this.setState({ gpOdsCode: _gpOdsCode })
    }

    render() {
        return (
            <Stack.Navigator
                headerMode="float"
                screenOptions={{
                    headerShown: this.props.navigationData.profileHeaderShown,
                    headerBackTitleVisible: false,
                    headerTitle: () => <HeaderImage />,
                    headerTitleAlign: 'center'
                }}
                initialRouteName="InformationScreen">
                <Stack.Screen
                    name="InformationScreen"
                    component={InformationScreen}
                />
                <Stack.Screen
                    name="AccessHealthDataConsent"
                    component={AccessHealthDataConsent}
                />
                <Stack.Screen
                    name="LinkToGP"
                    component={LinkToGP}
                />
                <Stack.Screen
                    name="VaccinationDateExplanation"
                    component={VaccinationDateExplanation}
                />
                <Stack.Screen
                    name="PersonalDetailsForLinkage"
                    component={PersonalDetailsForLinkage}
                />
                <Stack.Screen
                    name="InputLinkageKey"
                >
                    {props => <InputLinkageKey {...props} linkageKey={this.state.linkageKey}
                                    accountID={this.state.accountID}
                                    gpOdsCode={this.state.gpOdsCode} />}
                </Stack.Screen>
                <Stack.Screen
                    name="ScanLinkageKey"
                    component={ScanLinkageKey}
                />
                <Stack.Screen
                    name="InsertLinkageKey"
                >
                    {props => <InsertLinkageKey {...props} handleLinkAgeKeyUpdate={this.handleLinkAgeKeyUpdate} 
                                    handleAccountIDUpdate={this.handleAccountIDUpdate}
                                    handleGpOdsCodeUpdate={this.handleGpOdsCodeUpdate} />}
                </Stack.Screen>
                <Stack.Screen
                    name="OperationFailed"
                    component={OperationFailed}
                    options={{ headerLeft: null }}
                />
            </Stack.Navigator>
        );
    }
}

export default withReduxStore(WizardNoNhsLinkage);
