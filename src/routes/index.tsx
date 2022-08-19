
import { NavigationContainer } from '@react-navigation/native'
import { Host } from 'react-native-portalize'
import { AppRoutes } from './app.routes'

export function Routes() {

  return (
    <NavigationContainer>
      <Host>
        <AppRoutes />
      </Host>
    </NavigationContainer>
  )
}