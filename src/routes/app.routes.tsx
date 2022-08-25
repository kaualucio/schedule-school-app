
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from '../screens/Home';
import { Schedule } from '../screens/Schedule';
import { Calendar } from '../screens/Calendar';
import { Settings } from '../screens/Settings';
import {  Calendar as CalendarIcon, GearSix, PlusCircle, NotePencil, Books } from 'phosphor-react-native';
import { useTheme } from 'native-base';
import { StyleSheet } from 'react-native';
import { AddSubject } from '../screens/AddSubject';
import { AddHomework } from '../screens/AddHomework';
import { EditHomework } from '../screens/EditHomework';
import { EditSubject } from '../screens/EditSubject';

const { Navigator, Screen } = createBottomTabNavigator()

export function AppRoutes() {
  const { colors } = useTheme()

  return (
    <Navigator  
      screenOptions={{
        tabBarHideOnKeyboard: true, 
        headerShown: false, 
        // tabBarShowLabel: false, 
        tabBarInactiveTintColor: colors.white,
        tabBarActiveTintColor: String(colors.primary),
        tabBarLabelStyle: {
          marginTop: -20,
          marginBottom: 10,
          fontWeight: 'bold',
          textTransform: 'uppercase'
        },
        tabBarStyle: {
          borderTopWidth: 2,
          borderTopColor: colors.gray[400], 
          backgroundColor: colors.black[700],
          height:80 ,
          paddingBottom: 5
        },

      }}>
      <Screen 
        name="disciplinas"
        component={Home}
         options={{
          
          tabBarIcon: ({ focused }) => (
              <Books  size={30} color={focused ? String(colors.primary) : colors.white} />
          )
         }}
      />

      <Screen 
        name="agenda"
        component={Schedule}
        options={{
          tabBarIcon: ({focused}) => (
              <NotePencil size={30} color={focused ? String(colors.primary) : colors.white} />
          )
         }}
      />

      <Screen 
        name="calendário"
        component={Calendar}
        options={{
          tabBarIcon: ({focused}) => (
            <CalendarIcon  size={30} color={focused ? String(colors.primary) : colors.white} />
          )
         }}
      />

      {/* <Screen 
        name="settings"
        component={Settings}
        options={{
          tabBarIcon: ({focused}) => (
            <GearSix  size={30} color={focused ? String(colors.primary) : colors.white} />
          )
         }}
      /> */}

       <Screen options={{
         tabBarItemStyle: {
            display: "none"
         },
       }}
          name="newSubject"
          component={AddSubject}
        />

        <Screen options={{
         tabBarItemStyle: {
            display: "none"
         },
       }}
          name="editSubject"
          component={EditSubject}
        />

         <Screen options={{
          tabBarItemStyle: {
              display: "none"
          },
        }}
          name="newHomework"
          component={AddHomework}
        />

        <Screen options={{
          tabBarItemStyle: {
              display: "none"
          },
        }}
          name="editHomework"
          component={EditHomework}
        />
    </Navigator>
  )
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  }
})