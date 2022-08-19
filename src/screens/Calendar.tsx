import moment from 'moment';
import { Text, useTheme, VStack } from 'native-base';
import { CalendarBlank } from 'phosphor-react-native';
import { useState } from 'react';
import {Calendar as CalendarRN, CalendarList, Agenda} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import { Header } from '../components/Header';

LocaleConfig.locales['br'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul.', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter.', 'Qua.', 'Qui.', 'Sex', 'Sab'],
  today: "Sábado"
};
LocaleConfig.defaultLocale = 'br';
export function Calendar() {
  const {colors} = useTheme()
  const [markedDates, setMarkedDates] = useState<any>({})
  const [selectedDate, setSelectedDate] = useState<any>('')
  
  const getSelectedDayEvents = (date: string) => {
    let markedDate: any = {};
    markedDates[date] = { activeOpacity: .5, selected: true, dotColor: colors.green[300] };
    let serviceDate: any = moment(date);
    serviceDate = serviceDate.format("YYYY-MM-DD");
    setSelectedDate(serviceDate)
    setMarkedDates(markedDate)
  };
  console.log(selectedDate)
  return (
    <VStack flex="1" bg="gray.100">
      <Header title="Calendário" icon={CalendarBlank}  />
      <CalendarRN
        theme={{
          selectedDayTextColor: 'white',
          selectedDayBackgroundColor: colors.green[300],
          selectedDotColor: '#fff',
          dotColor: colors.green[300]
        }}
        style={{ paddingTop: 30, height: "100%"}} 
        markingType="dot"
        minDate={'2022-01-01'}
        markedDates={{
          selectedDate: markedDates
        }}
        onDayPress={(date) => {
          getSelectedDayEvents(date.dateString)
        }}
        
      />
    </VStack>
  );
}