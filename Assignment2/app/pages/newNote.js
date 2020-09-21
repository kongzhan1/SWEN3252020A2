import React from 'react';
import { TextInput, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { fb, database } from '../../firebaseConfig/config';

class newNote extends React.Component {

    // Constructor of the class
    constructor(props) {
        super(props);
        this.state = {
            // initial state with empty attributes.
            Date: '',
            Schedule: '',
            Category: '',
            Time: '',
            Location: '',
            noteId: this.generateId()
        }
    }

    /**
     * This method generate a 4 char random number sequence, (e.g. e7av.)
     */
    randomId = () => {
        return Math.floor((Math.random() + 1) * 0x10000)
            .toString(16)
            .substring(1);
    }

    /**
     * This method generates a long sequence of ID consist of multiple random 4 bits sequences.
     */
    generateId = () => {
        return this.randomId() + this.randomId() + '-' + this.randomId() + '-'
            + this.randomId() + '-' + this.randomId() + '-' + this.randomId() + '-' + this.randomId()
            + '-' + this.randomId();
    }

    createNewNote = () => {
        if (this.state.Date == '' || this.state.Schedule == ''
         || this.state.Category == '' || this.state.Time == '' || this.state.Location == ''){
             console.log('hey');
             alert('Please fill up all the fields');
         } else {
             var noteID = this.state.noteId;
             var noteObj = {
                 author: fb.auth().currentUser.uid,
                 category: this.state.Category,
                 date: this.state.Date,
                 time: this.state.Time,
                 location: this.state.Location,
                 schedule: this.state.Schedule,
                 url: 'https://picsum.photos/200/300'
             };

             database.ref('/notes/'+noteID).set(noteObj);
             this.props.navigation.navigate('List');
         }
    }

    // Render method for rendering the screen.
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', hieght: 70, paddingTop: 40, backgroundColor: 'white', borderColor: 'lightgrey', borderBottomWidth: 0.5, justifyCategory: 'center', justifyCategory: 'space-between', alignItems: 'center' }}>
                    {/* Touchable back button to navigate back to the list page. */}
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Text style={{ paddingBottom: 5, paddingLeft: 20, fontWeight: 'bold', color: 'darkblue' }}> Back </Text>
                    </TouchableOpacity>
                    <Text style={{ paddingBottom: 10, paddingRight: 52, fontSize: 18, fontWeight: 'bold' }}> New Note </Text>
                    <Text></Text>
                </View>

                {/* This is the view for date input. */}
                <View style={{ padding: 5 }}>
                    <Text style={{ marginTop: 10, fontSize: 16 }}>Date of the schedule: </Text>
                    <TextInput
                        editable={true}
                        placeholder={'DD.MM.YYYY (e.g. 01.01.2019)'}
                        maxLength={10}
                        onChangeText={(text) => this.setState({ Date: text })}
                        style={{ marginVertical: 5, height: 30, padding: 5, borderColor: 'lightgrey', borderWidth: 1, borderRadius: 5, backgroundColor: 'white', color: 'black' }}
                    />
                </View>

                {/* This is the view for the schedule input. */}
                <View style={{ padding: 5 }}>
                    <Text style={{ fontSize: 16 }}>Category of the schedule: </Text>
                    <TextInput
                        editable={true}
                        placeholder={'e.g. Study or Work'}
                        maxLength={25}
                        multiline={true}
                        onChangeText={(text) => this.setState({ Schedule: text })}
                        style={{ marginVertical: 5, height: 30, padding: 5, borderColor: 'lightgrey', borderWidth: 1, borderRadius: 5, backgroundColor: 'white', color: 'black' }}
                    />
                </View>

                {/* This is the view for the study's category input. */}
                <View style={{ padding: 5 }}>
                    <Text style={{ fontSize: 16 }}>Schedule that you are going to do: </Text>
                    <TextInput
                        editable={true}
                        placeholder={'e.g. Join a interview'}
                        maxLength={25}
                        onChangeText={(text) => this.setState({ Category: text })}
                        style={{ marginVertical: 5, height: 30, padding: 5, borderColor: 'lightgrey', borderWidth: 1, borderRadius: 5, backgroundColor: 'white', color: 'black' }}
                    />
                </View>

                {/* This is the view for the time estimation input. */}
                <View style={{ padding: 5 }}>
                    <Text style={{ fontSize: 16 }}>Estimated time spend: </Text>
                    <TextInput
                        editable={true}
                        placeholder={'e.g. One week'}
                        maxLength={15}
                        onChangeText={(text) => this.setState({ Time: text })}
                        style={{ marginVertical: 5, height: 30, padding: 5, borderColor: 'lightgrey', borderWidth: 1, borderRadius: 5, backgroundColor: 'white', color: 'black' }}
                    />
                </View>

                {/* This is the view for the location input. */}
                <View style={{ padding: 5 }}>
                    <Text style={{ fontSize: 16 }}>Location: </Text>
                    <TextInput
                        editable={true}
                        placeholder={'e.g. Company or school'}
                        maxLength={25}
                        onChangeText={(text) => this.setState({ Location: text })}
                        style={{ marginVertical: 5, height: 30, padding: 5, borderColor: 'lightgrey', borderWidth: 1, borderRadius: 5, backgroundColor: 'white', color: 'black' }}
                    />
                </View>

                {/* This is the view for the create note button. */}
                <View style={{ flex: 0.3, justifyCategory: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => this.createNewNote()}
                        style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'lightblue', borderRadius: 5, width: '40%', borderWidth: 0.5, borderColor: 'grey' }}>
                        <Text style={{ justifyCategory: 'center', alignItems: 'center', fontSize: 20, paddingLeft: 10, paddingBottom: 2, color: 'white' }}>Create Note</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default newNote;