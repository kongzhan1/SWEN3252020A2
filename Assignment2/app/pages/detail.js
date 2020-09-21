import React from 'react';
import { TextInput, TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';

/**
 * Import for firbase configration.
 */
import { fb, database, storage, auth } from '../../firebaseConfig/config.js';

/**
 * Import for accessing phone camera and its camera roll.
 */
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

/**
 * Main class of the detail page. 
 */
class detail extends React.Component {


    /**
     * Constructor of the page, specifies the initial state of the page. 
     * @param {Can be used to do navigation} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            ChangeText: false,
            imageId: this.generateId(),
            imageSelected: false,
            noteLoaded: false
        }
    }

    /**
     * This is the method that runs each time when user navigate to this page. 
     */
    componentDidMount = () => {
        this.checkNoteLoaded();
    }


    /**
     * This method checks if the identification parameters passed from 'List' page
     * is arrived successfully.
     */
    checkNoteLoaded = () => {
        var params = this.props.navigation.state.params;
        if (params) {
            this.setState({
                noteId: params.id,
                note: params.note,
                uri: params.note.url
            });
            this.fetchNoteData(params.note);
        }
    }



    /**
     * This method fetches the data from the given identification parameter, noteId and a note object.
     */
    fetchNoteData = (note) => {
        var origin = this;
        origin.setState({
            Date: note.date,
            Schedule: note.schedule,
            Category: note.category,
            Time: note.time,
            Location: note.location
        });
    }

    /**
     * An async function that checks the permissions of accessing
     * the camera and the camera roll. 
     */
    _checkCameraAndCameraRollPermissions = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ camera: status });

        const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ cameraRoll: statusRoll });
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

    /**
     * This method is called when user press the upload photo button.
     * It process the behavior from the user did in the image picker GUI
     * and pass the result to the photo upload method.
     */
    selectPhoto = async () => {
        // first check permissions
        this._checkCameraAndCameraRollPermissions();

        let response = await ImagePicker.launchImageLibraryAsync({
            // only searching media types with images.
            mediaTypes: 'Images',
            allowEditing: true,
            // quality is from 0.1 to 1
            quality: 1
        });

        if (!response.cancelled) {
            this.setState({
                imageId: this.generateId(),
                // setting uri inside of the state,
                // so that the page can preview the selected image. 
                uri: response.uri,
                imageSelected: true
            });
        } else {
            this.setState({
                imageSelected: false
            });
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
    /**
     * Upload the selected photo to firebase storage.
     */
    uploadPhoto = async (uri) => {
        if (this.state.imageSelected) {
            var origin = this;
            var userId = fb.auth().currentUser.uid;
            var imageId = this.state.imageId;
            var noteID = this.state.noteId;

            // this statement finds the dot position of the image name
            // e.g. image.png, it will locate the position of the dot.
            var suffix = /(?:\.([^.]+))?$/;
            // this takes the suffix after the dot as the file name extension.
            var extension = suffix.exec(uri)[1];
            this.setState({ currentFileType: extension });

            const result = await fetch(uri);
            const blob = await result.blob();
            var filePath = imageId + '.' + origin.state.currentFileType;

            // creating a path in the storage
            // start with a user fold, inside this folder are specific user's fold
            // distinguish with their userID as their folder name
            // each user fold has an img folder containing the image with unique image id.
            const upload = storage.ref('user/' + userId + '/img').child(filePath).put(blob);

            // This code get the uploaded downloadURL
            upload.on('state_changed', function (snapshot) { },
                function (error) { console.log('Error uploading: ' + error); },
                function () {
                    upload.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        database.ref('notes').child(noteID).child('url').set(downloadURL);
                    });
                });

        } else {
            alert('Please select an image before upload! ');
        }

    }

    /**
     * This method is called when button is used to activate the text input area.
     */
    startEdit = () => {
        this.setState({ ChangeText: true });
    }



    /**
     * Render method of this page. 
     */
    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* This is the header title view of this page. */}
                <View style={{ flexDirection: 'row', height: 70, paddingTop: 40, backgroundColor: 'white', borderColor: 'lightgrey', borderBottomWidth: 0.5, justifyCategory: 'center', justifyCategory: 'space-between', alignItems: 'center' }}>
                    {/* Touchable back button to navigate back to the list page. */}
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Text style={{ paddingBottom: 5, paddingLeft: 10, fontWeight: 'bold', color: 'darkblue' }}> Back </Text>
                    </TouchableOpacity>
                    <Text style={{ paddingBottom: 10, paddingRight: 52, fontSize: 18, fontWeight: 'bold' }}> Note Detail </Text>
                    <Text></Text>
                </View>

                {/* This is the view for the preview image. */}
                <View style={{ padding: 5, justifyCategory: 'center', alignItems: 'center' ,borderTopColor: 'blue'}}>
                    <Image
                        source={{ uri: this.state.uri }}
                        style={{ borderWidth: 1, borderColor: 'grey', resizeMode: 'cover', width: '100%', height: 250 }}
                    />
                </View>

                {/* This is the view for the select and update photo buttons. */}
                <View style={{ padding: 10, flexDirection: 'row', justifyCategory: 'space-between' }}>
                    <View style={{ paddingLeft: 30 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.selectPhoto();
                            }}
                            style={{ justifyCategory: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, backgroundColor: 'lightblue', borderRadius: 5, width: 150, borderWidth: 0.5, borderColor: 'grey' }}>
                            <Text style={{ fontSize: 20, color: 'white' }}>Select Photo</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingRight: 30 }}>
                        <TouchableOpacity
                            style={{ justifyCategory: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, backgroundColor: 'lightblue', borderRadius: 5, width: 150, borderWidth: 0.5, borderColor: 'grey' }}
                            onPress={() => {
                                this.uploadPhoto(this.state.uri);
                            }}>
                            <Text style={{ fontSize: 20, color: 'white' }}>Upload Photo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Top left and top right display for date and location. */}
                <View style={{ padding: 5, flexDirection: 'column', justifyCategory: 'space-between', backgroundColor: '#ffaf5', borderTopColor: 'white', borderTopWidth: 2 }}>
                    <Text style={{ color: 'black' ,fontSize: 20}}>Date: {this.state.Date} </Text>
                    <Text style={{ color: 'black' ,fontSize: 20}}>Location: {this.state.Location}</Text>
                    <Text style={{ color: 'black' ,fontSize: 20}}>Schedule: {this.state.Category}</Text>
                    <Text style={{ color: 'black' ,fontSize: 20}}>Category: {this.state.Schedule}</Text>
                    <Text style={{ color: 'black' ,fontSize: 20}}>Time Spend: {this.state.Time}</Text>
                </View>





            </View >
        );
    }
}

export default detail;