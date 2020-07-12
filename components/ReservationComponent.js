import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button , Alert ,TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions'
import {Notifications} from 'expo' 
import * as Calendar from 'expo-calendar';
import DatePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";


class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: '',
            showdate: false
        }
    }

    static navigationOptions = {
        title: 'Reserve Table',
    };

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    handleReservation() {
        console.log(JSON.stringify(this.state));
        this.addReservationToCalendar(this.state.date);
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        });
    }

    async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.CALENDAR);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to add event to calendar');
            }
        }
        return permission;
    }

    async addReservationToCalendar(date) {
        if (this.obtainCalendarPermission()) {
            const defaultCalendarSource =
                Platform.OS === 'ios'
                    ? await getDefaultCalendarSource()
                    : { isLocalAccount: true, name: 'Expo Calendar' };
                    let details = {
                        title: 'Con Fusion Table Reservation',                       
                        source: defaultCalendarSource,
                        name: 'internalCalendarName',        
                        color: 'blue',         
                        entityType: Calendar.EntityTypes.EVENT,                    
                        sourceId: defaultCalendarSource.id,
                        ownerAccount: 'personal',  
                        accessLevel: Calendar.CalendarAccessLevel.OWNER,            
                        }
    
                        const calendarId = await Calendar.createCalendarAsync(details);
           
                        Calendar.createEventAsync(calendarId, {
                title: 'Con Fusion Table Reservation',
                startDate: new Date(Date.parse(date)),
                endDate: Date.parse(date) + (2 * 60 * 60 * 1000),
                timeZone: 'Asia/Hong_Kong',
                location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
            })
        }
    }
    
    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }

   renderAlert = () =>
    Alert.alert(
        'Your Reservation OK?',
        'Number of Guests: '  + this.state.guests + '\nSmoking ? ' + this.state.smoking + '\nDate and Time : ' + this.state.date,
        [
            { 
                text: 'Cancel', 
                onPress: () => this.resetForm,
                style: ' cancel'
            },
            {
                text: 'OK',
                onPress: () => {
                    this.resetForm;
                    this.presentLocalNotification(this.state.date);
                    this.handleReservation();
                }
            }
        ],
        { cancelable: false }
             );

    setDatePickerVisibility = (show) => {
        this.setState({ showdate: show });
    }
    showDatePicker = () => {
        this.setDatePickerVisibility(true);
    };

    hideDatePicker = () => {
        this.setDatePickerVisibility(false);
    };

    handleConfirm = (date) => {
        this.setState({ date: date })
        this.hideDatePicker();
    };


    render() {
        return(
            <Animatable.View animation="zoomInUp" duration={2000} > 
                <View style={styles.formRow}>
                <Text style={styles.formLabel}>Number of Guests</Text>
                <Picker
                    style={styles.formItem}
                    selectedValue={this.state.guests}
                    onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="6" value="6" />
                </Picker>
                </View>
                <View style={styles.formRow}>
                <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                <Switch
                    style={styles.formItem}
                    value={this.state.smoking}
                    onTintColor='#512DA8'
                    onValueChange={(value) => this.setState({smoking: value})}>
                </Switch>
                </View>
                <View style={styles.formRow}>
                <Text style={styles.formLabel}>Date and Time</Text>
                <TouchableOpacity style={styles.formButton} onPress={this.showDatePicker}>
                        <Text style ={{color:'white'}}>Select date</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                isVisible={this.state.showdate}
                mode="datetime"
                value={this.state.date}
                onConfirm={this.handleConfirm}
                onCancel={this.hideDatePicker}
            />
                </View>

                <View style={styles.formRow}>
                <Button
                    title="Reserve"
                    color="#512DA8"
                    accessibilityLabel="Learn more about this purple button"
                    onPress = {this.renderAlert}
                    />
                </View>
                </Animatable.View>
        );
    }

};

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20,
      padding:30
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    formButton: {
        backgroundColor: "#512DA8",
        flex: 1,
        height:60,
        width: 35,
        justifyContent: 'center',
        alignItems:'center'
    },
    modal: {
        justifyContent: 'center',
        margin: 20
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         backgroundColor: '#512DA8',
         textAlign: 'center',
         color: 'white',
         marginBottom: 20
     },
     modalText: {
         fontSize: 18,
         margin: 10
     }
});

export default Reservation;