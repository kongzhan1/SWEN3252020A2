import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Imports for firebase configrations and react navigations.
 */
import { fb, database, auth } from './firebaseConfig/config.js';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

/**
 * Imports for each page of the app. 
 */
import home from './app/pages/home.js';
import list from './app/pages/list.js';
import profile from './app/pages/profile.js';
import newNote from './app/pages/newNote.js';
import detail from './app/pages/detail.js';
import login from './app/pages/login.js';
import register from './app/pages/register.js';


/**
 * BottomStack contains navigation for bottom navigation bar on screen.
 */
const BottomStack = createBottomTabNavigator(
  {
    Home: { screen: home },
    List: { screen: list },
    Profile: { screen: profile }
  }
);

/**
 * MainStack specifies all the other navigations except 
 * the navigations in bottom navigation bar.
 */
const MainStack = createStackNavigator(
  {
    Initial: { screen: BottomStack },
    NewNote: { screen: newNote },
    Detail: { screen: detail },
    Login: {screen: login},
    Register: {screen: register}
  },
  {
    initialRouteName: 'Initial',
    mode: 'model',
    // headerMode set to none since the code will design the header bar. 
    headerMode: 'none'
  }
);


/**
 * Main class of the app. 
 */
export default class App extends React.Component {

  constructor(props){
    super(props);
    this.forceLogin();
  }

  /**
   * This method force the app is under loggined status at the beginning. 
   */
  forceLogin = async() => {
    try{
      let user = await auth.signInWithEmailAndPassword('testUser@test.com', 'password');
    } catch(error) {
      console.log(error);
    }
  }

  
  /**
   * This render method essentially renders nothing, instead it handles the 
   * main navigation stack and plays the role as the entrance of the app. 
   */
  render() {
    return (
      <MainStack />
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
