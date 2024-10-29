import React, { Component } from 'react';
import { View, Text, Button, Item } from 'native-base';
import { StyleSheet, ScrollView, Platform, ActivityIndicator, Alert } from 'react-native';
import { styles } from '../registration/styles';
import withReduxStore from '../../utils/withReduxStore';
import QRCodeChat from '../Chat/QRCodeChat';
import { vh } from 'react-native-expo-viewport-units';
import moment from 'moment';
import Colors from '../../constants/colors';
import PassKit, { AddPassButton } from 'react-native-passkit-wallet';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import certificateDA from '../../da/certificate';
import userDA from '../../da/user';

class CertificateDetails extends Component {
    constructor(props) {
        super(props);
        this.state = { identifier: "", disabledBtn: false };
    }

    componentDidMount = async () => {
        this.props.updateUser({ isQrCodeReady: true })
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            this.props.updateNavigation({ profileHeaderShown: true });
        })

        const issueCertificateInput = {
            userId: this.props.user.id,
            name: `${this.props.user.firstName} ${this.props.user.lastName}`,
            dateOfBirth: this.props.user.dateOfBirth ? moment(this.props.user.dateOfBirth).format('DD/MM/YYYY') : null,
            vaccineName: this.props.user.vaccineName,
            diseaseAgent: "SARS-CoV-2",
            firstDoseDate: this.props.user.vaccineDetails && this.props.user.vaccineDetails[0] ? moment(this.props.user.vaccineDetails[0].doseDate).format('DD/MM/YYYY') : null,
            secondDoseDate: this.props.user.vaccineDetails && this.props.user.vaccineDetails[1] ? moment(this.props.user.vaccineDetails[1].doseDate).format('DD/MM/YYYY') : null,
            validFrom: this.props.user.vaccineDetails && this.props.user.vaccineDetails[1] ? moment(this.props.user.vaccineDetails[1].doseDate).format('DD/MM/YYYY') : null,
            expirationDate: this.props.user.vaccineDetails && this.props.user.vaccineDetails[1] ? moment(this.props.user.vaccineDetails[1].doseDate).add(6, 'months').format('DD/MM/YYYY') : null,
            country: "GB",
            issuer: "checkmenow.co.uk"
        }

        if (this.props.user.certificate) {
            console.log("Certificate from Redux");
            this.certificateResult = this.props.user.certificate;
        } else {
            console.log("Certificate from Lambda");
            const issueCertificateOutput = await certificateDA.issueCertificate(issueCertificateInput);
            console.log("issueCertificateOutput");
            console.log(issueCertificateOutput);

            if (issueCertificateOutput.statusCode !== '200') {
                this.props.navigation.navigate('OperationFailed',
                    { statusCode: issueCertificateOutput.statusCode });
                return;
            }

            const userDetailsFromDB = await userDA.getByEmail(this.props.user.email);

            this.certificateResult = userDetailsFromDB.certificate;
            console.log("certificateResult!!!!!!");
            console.log(this.certificateResult);

            this.props.initUserFromDb({
                certificate: this.certificateResult
            })

        }
        this.setState({
            signedData: `${this.certificateResult.messageHash}.${this.certificateResult.signature}`,
            identifier: this.certificateResult.identifier,
        })

        PassKit.addEventListener('addPassesViewControllerDidFinish', this.onAddPassesViewControllerDidFinish);
    }

    componentWillUnmount = () => {
        this.unsubscribe();
        PassKit.removeEventListener('addPassesViewControllerDidFinish', this.onAddPassesViewControllerDidFinish);
    };


    onAddPassesViewControllerDidFinish(event) {
        /*console.log("event");
        console.log(event);
        console.log('onAddPassesViewControllerDidFinish');
        /Alert.alert(
            'Info',
            'The certificate pass was succesfully exported.',
            [
                {
                    text: 'OK',
                },

            ]);*/
    }

    addPass = async (os) => {
        if (this.state.signedData) {
            console.log("calling generateCertificatePassKit");

            const passKitInput = {
                barcode: this.state.signedData,
                fullName: this.props.user.firstName + " " + this.props.user.lastName,
                dateOfBirth: moment(this.props.user.dateOfBirth).format('DD/MM/YYYY'),
                certificateIdentifier: this.state.identifier,
                vaccineName: this.props.user.vaccineName,
                diseaseAgent: "SARS-CoV-2",
                validFrom: moment(this.props.user.vaccineDetails[1].doseDate).format('DD/MM/YYYY'),
                expirationDate: moment(this.props.user.vaccineDetails[1].doseDate).add(6, 'months').format('DD/MM/YYYY')
            };

            console.log(JSON.stringify(passKitInput));

            this.setState({ disabledBtn: true });
            var base64 = await certificateDA.generateCertificatePassKit(os, passKitInput);
            this.setState({ disabledBtn: false });

            if (base64) {
                //add to wallet
                PassKit.canAddPasses()
                    .then((canAddPasses) => {
                        console.log("canAddPasses")
                        console.log(canAddPasses)
                        try {
                            if (base64) {
                                PassKit.addPass(base64).then(result => {
                                    console.log("Then addPass")
                                    console.log(result)
                                })
                            } else {
                                Alert.alert(
                                    'Error',
                                    'Failed to generate the certificate pass. Please try again later.',
                                    [
                                        {
                                            text: 'OK',
                                        },

                                    ]);
                            }
                        } catch (err) {
                            console.log("Error adding pass")
                            console.log(err)
                            Alert.alert(
                                'Error',
                                'Failed to export the certificate pass to the wallet.',
                                [
                                    {
                                        text: 'OK',
                                    },
                                ]);
                        }
                    })
            }
            else {
                console.log("pass result is empty");
            }
        }
        else {
            console.log("signed data is not set");
        }
    }

    render() {
        return (
            <View style={{ ...styles.container, paddingBottom: 0 }}>

                {this.state.signedData ?
                    <>
                        <View style={styles.upperSection}>
                            <View>
                                <QRCodeChat value={this.state.signedData} size={200} />
                            </View>

                            <View style={{ ...localStyles.group, marginTop: vh(1) }}>
                                <View>
                                    <View style={{ ...localStyles.row }} >
                                        <Text style={{ ...localStyles.smallText, ...localStyles.column }}>
                                            Full name:
                            </Text>
                                        <Text style={{ ...localStyles.defaultText, ...localStyles.bold }}>
                                            {this.props.user.firstName && this.props.user.lastName ?
                                                `${this.props.user.firstName} ${this.props.user.lastName}` : 'Jonathon Peter Parker'}
                                        </Text>
                                    </View>
                                    <View style={{ ...localStyles.row }} >
                                        <Text style={{ ...localStyles.smallText, ...localStyles.column }}>
                                            Date of birth:
                                </Text>
                                        <Text style={{ ...localStyles.defaultText, ...localStyles.bold }}>
                                            {this.props.user.firstName ?
                                                `${moment(this.props.user.dateOfBirth).format('DD/MM/YYYY')}` : '01.01.1983'}
                                        </Text>
                                    </View>
                                </View>

                            </View>

                            <View style={localStyles.group}>
                                <View style={{ ...localStyles.row }} >
                                    <Text style={{ ...localStyles.smallText, ...localStyles.column }}>
                                        Vaccine name:
                            </Text>
                                    <Text style={{ ...localStyles.defaultText, ...localStyles.bold }}>
                                        {this.props.user.vaccineName}
                                    </Text>
                                </View>
                                <View style={{ ...localStyles.row }} >
                                    <Text style={{ ...localStyles.smallText, ...localStyles.column }}>
                                        Disease agent:
                                </Text>
                                    <Text style={{ ...localStyles.defaultText, ...localStyles.bold }}>
                                        SARS-CoV-2
                                </Text>
                                </View>
                                <View style={{ ...localStyles.row }} >
                                    <Text style={{ ...localStyles.smallText, ...localStyles.column }}>
                                        Dose 1 date:
                                </Text>
                                    <Text style={{ ...localStyles.defaultText, ...localStyles.bold }}>
                                        {this.props.user.vaccineDetails && this.props.user.vaccineDetails[0] ?
                                            moment(this.props.user.vaccineDetails[0].doseDate).format('DD/MM/YYYY') :
                                            null}
                                    </Text>
                                </View>
                                <View style={{ ...localStyles.row }} >
                                    <Text style={{ ...localStyles.smallText, ...localStyles.column }}>
                                        Dose 2 date:
                                    </Text>
                                    <Text style={{ ...localStyles.defaultText, ...localStyles.bold }}>
                                        {this.props.user.vaccineDetails && this.props.user.vaccineDetails[1] ?
                                            moment(this.props.user.vaccineDetails[1].doseDate).format('DD/MM/YYYY') :
                                            null}
                                    </Text>
                                </View>
                                <View style={{ ...localStyles.row }} >
                                    <Text style={{ ...localStyles.smallText, ...localStyles.column }}>
                                        Valid from:
                            </Text>
                                    <Text style={{ ...localStyles.defaultText, ...localStyles.bold }}>
                                        {this.props.user.vaccineDetails && this.props.user.vaccineDetails[1] ?
                                            moment(this.props.user.vaccineDetails[1].doseDate).format('DD/MM/YYYY') :
                                            null}
                                    </Text>
                                </View>
                                <View style={{ ...localStyles.row }} >
                                    <Text style={{ ...localStyles.smallText, ...localStyles.column }}>
                                        Expiration date:
                            </Text>
                                    <Text style={{ ...localStyles.defaultText, ...localStyles.bold }}>
                                        {this.props.user.vaccineDetails && this.props.user.vaccineDetails[1] ?
                                            moment(this.props.user.vaccineDetails[1].doseDate).add(6, 'months').format('DD/MM/YYYY') :
                                            null}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ paddingTop: vh(0.5) }}>
                                <View style={{ ...localStyles.row }} >
                                    <Text style={{ ...localStyles.smallText, ...localStyles.column }}>
                                        Country:
                            </Text>
                                    <Text style={{ ...localStyles.defaultText, ...localStyles.bold }}>
                                        GB
                            </Text>
                                </View>
                                <View style={{ ...localStyles.row }} >
                                    <Text style={{ ...localStyles.smallText, ...localStyles.column }}>
                                        Issuer name:
                            </Text>
                                    <Text style={{ ...localStyles.defaultText, ...localStyles.bold }}>
                                        checkmenow.co.uk
                            </Text>
                                </View>
                                <View>
                                    <Text style={{ ...localStyles.smallText }}>
                                        Certificate identifier:
                            </Text>
                                    <Text style={{ ...localStyles.defaultText, ...localStyles.bold }}>
                                        {this.state.identifier}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ position: 'absolute', top: '50%', right: '50%' }}>
                                <ActivityIndicator
                                    animating={this.state.disabledBtn}
                                    size="large"
                                    color="#00ff00"
                                />
                            </View>
                        </View>

                        <View style={{ ...styles.bottomSection, paddingVertical: 15, flex: 0 }} >


                            {Platform.OS === 'ios' ?
                                <AddPassButton
                                    addPassButtonStyle={PassKit.AddPassButtonStyle.black}
                                    style={!this.state.disabledBtn ?
                                        localStyles.addPassButton :
                                        { ...localStyles.addPassButton, backgroundColor: 'grey' }}
                                    onPress={() => !this.state.disabledBtn ? this.addPass("ios") : null}
                                />
                                : <Button onPress={() => !this.state.disabledBtn ? this.addPass("android") : null}><Text>Add to wallet</Text></Button>
                            }

                            <Text
                                style={styles.noThanks}
                                onPress={() => {

                                    this.props.navigation.navigate('Main')
                                }}>
                                Not now
                            </Text>

                            {/*  <Button
                                disabled={!this.state.signedData}
                                style={this.state.signedData ? styles.button : styles.buttonDisabled}
                                onPress={() => this.props.navigation.navigate('Main')}>
                                <Text style={this.state.signedData ?
                                    { ...styles.buttonTextSize, color: 'white' } :
                                    { ...styles.buttonTextSize, color: Colors.link }}>Close</Text>
                            </Button> */}


                        </View>
                    </> :

                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '50%', height: vh(15) }}>
                        <ActivityIndicator
                            animating={!this.state.signedData}
                            size="large"
                            color="#00ff00"
                        />
                    </View>}
            </View >
        );
    }
}

const localStyles = StyleSheet.create({
    group: {
        //marginTop: vh(2),
        paddingTop: vh(0.5),
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    column: {
        width: '40%'
    },
    addPassButton: {
        alignSelf: 'center',
        width: '100%',
        height: vh(6),
    },
    defaultText: {
        fontSize: RFPercentage(2.4),
        fontFamily: 'Avenir Next Medium',
    },
    smallText: {
        fontSize: RFPercentage(2),
        fontFamily: 'Avenir Next Medium',
    },
});
export default withReduxStore(CertificateDetails);