import React, { Component } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { View, Text, Button } from 'native-base';
import { styles } from '../registration/styles';
import { vh } from 'react-native-expo-viewport-units';
import withReduxStore from '../../utils/withReduxStore';

import { getVaccineDetails } from '../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import moment from 'moment';
import { initUserFromDb } from '../../store/actions';
import userStatus from '../../constants/userStatus';
import Colors from '../../constants/colors';

class CheckVaccinationRecords extends Component {
    constructor(props) {
        super(props);

    }
    state = {
        isLoading: false,
        getDataFinished: false,
        vaccineDetails: [],
    }
    componentDidMount = async () => {
        this.setState({ isLoading: true })
        console.log("userStatus")
        console.log(this.props.user.userStatus)
        try {
            const queryResult = await API.graphql(
                graphqlOperation(getVaccineDetails, {
                    userId: this.props.user.id
                }),
            );
            console.log("STATUS:")
            console.log(queryResult.data.getVaccineDetails)
            this.setState({
                isLoading: false,
                getDataFinished: true,
                vaccineDetails: queryResult.data.getVaccineDetails.vaccineDetails
            })
            this.props.initUserFromDb({
                userStatus: queryResult.data.getVaccineDetails.userStatus,
                vaccineDetails: queryResult.data.getVaccineDetails.vaccineDetails,
                vaccineName: queryResult.data.getVaccineDetails.vaccineName
            })
        }
        catch (err) {
            this.setState({ isLoading: false });
            if (err.errors != null && err.errors.toString() == 'Network Error') {
                
                Alert.alert('Error', "No internet connection. Please try again later.", [
                    {
                        text: 'OK',
                        onPress: () => this.props.navigation.navigate('Main')
                    },
    
                ]);
            } else {
                Alert.alert('Error', "Operation failed. Please try again later.", [
                    {
                        text: 'OK',
                        onPress: () => this.props.navigation.navigate('Main')
                    },
    
                ]);
            }
            
        }
        console.log("VaccineResult:");
        console.log(this.state.vaccineDetails);

        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.props.updateNavigation({ profileHeaderShown: true });
        });
    };

    componentWillUnmount = () => {
        this.unsubscribe();
    };

    nrDaysTillImmunityConfirmed = () => {
        const secondDose = this.state.vaccineDetails && this.state.vaccineDetails[1] ? this.state.vaccineDetails[1] : null;
        console.log("secondDose");
        console.log(secondDose);

        if (secondDose) {
            const secondDoseDate = moment(secondDose.doseDate);
            console.log("secondDoseDate");
            console.log(secondDoseDate);
            const nrDays = moment().diff(secondDoseDate, 'days');
            console.log(nrDays);
            this.props.navigation.navigate('NotYetImmune', { nrDaysFromLastVaccination: nrDays });
        } else {
            this.props.navigation.navigate('Main');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.upperSection}>
                    <View >
                        <Text style={styles.h3}>Retrieving your vaccination details</Text>
                    </View>
                    <ScrollView style={{ paddingBottom: 30 }}>
                        <View>
                            <Text style={{ ...styles.defaultText, marginTop: vh(2) }}>
                                {!this.state.getDataFinished ?
                                    `Our system is searching your electronic health records for the immunization details.` :
                                    `Your health electronic records contain the following vaccination information.`
                                }
                            </Text>
                        </View>


                        {this.state.getDataFinished ? (
                            this.state.vaccineDetails && this.state.vaccineDetails.length > 0 ?
                                <View style={{ marginTop: vh(2) }}>
                                    {this.state.vaccineDetails.map((vaccine, index) => {
                                        return (
                                            <View key={index}>
                                                <Text style={{ ...styles.defaultText, fontWeight: 'bold' }}>
                                                    {`Dose ${index + 1}`}
                                                </Text>
                                                <Text style={{ ...styles.defaultText, fontWeight: '500' }}>
                                                    {`Date:  ${moment(vaccine.doseDate).format('YYYY-MM-DD')}`}
                                                </Text>
                                                <Text style={{ ...styles.defaultText, fontWeight: '500' }}>Details:</Text>
                                                <Text style={{ ...styles.smallText }}>{vaccine.details}</Text>
                                            </View>
                                        )
                                    })
                                    }
                                </View> :
                                <View style={{ marginTop: vh(5) }}>
                                    <Text style={{ ...styles.defaultText, fontWeight: '500' }}>
                                        Unfortunately, there is no vaccine information in your electronic health records.
                                </Text>
                                </View>
                        ) :
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: vh(3) }}>
                                <ActivityIndicator
                                    animating={this.state.isLoading}
                                    size="large"
                                    color="#00ff00"
                                />
                            </View>
                        }
                    </ScrollView>
                </View>
                <View style={styles.bottomSection}>
                    <Button
                        primary
                        disabled={this.state.isLoading}
                        onPress={() => {
                            this.nrDaysTillImmunityConfirmed()
                        }}
                        style={this.state.isLoading ? styles.buttonDisabled : styles.button}>
                        <Text style={!this.state.isLoading ?
                            { ...styles.buttonTextSize, color: 'white' } :
                            { ...styles.buttonTextSize, color: Colors.link }}>Continue</Text>
                    </Button>

                </View>
            </View>
        );
    }
}
export default withReduxStore(CheckVaccinationRecords);