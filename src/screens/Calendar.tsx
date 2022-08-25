import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { ScrollView, Spinner, useTheme, VStack } from 'native-base';
import { CalendarBlank } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import {Calendar as CalendarRN} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import { CalendarDayInfo } from '../components/CalendarDayInfo';
import { Header } from '../components/Header';
import { useRefetch } from '../context/RefetchContext';
import HomeworkModel, { IHomework } from '../services/sqlite/HomeworkModel';

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
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
  
};
LocaleConfig.defaultLocale = 'br';
export function Calendar() {
  const {colors} = useTheme()
  const navigation = useNavigation()
  const { refetch } = useRefetch()
  const [isLoading, setIsLoading] = useState(true)
  const [markedDates, setMarkedDates] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<number | string>(moment(new Date()).format('YYYY-MM-DD'))

  const getSelectedDayEvents = (date: string) => {
    let markedObjectDate = {}
    const selectedDayAlreadyExistInMarkedObject = markedDates[date]
    if(selectedDayAlreadyExistInMarkedObject) {
      for (const prop in markedDates) {
        let selected = moment(prop).unix() === moment(date).unix() ? true : false
        if(markedDates[prop].marked === true) {
          markedObjectDate[prop] = { activeOpacity: .5,  marked: true, selected: selected, }
        }else {
          markedObjectDate[prop] = {}
        }
      }
    }else {
      markedObjectDate = {}
      for (const prop in markedDates) {
        if(markedDates[prop].marked === true) {
          markedObjectDate[prop] = { activeOpacity: .5,  marked: true, selected: false, }
        }
      }
      markedObjectDate[date] = { activeOpacity: .5,  marked: false, selected: true, }
    }
    
    setSelectedDate(date)
    setMarkedDates(markedObjectDate)
  };

  useEffect(() => {
    if(navigation.isFocused() || refetch) {
      HomeworkModel.getDates().then((data: IHomework[]) => { 
        let markedObjectDate = {}
        data.map((item) => {
          let selected = moment(Number(item.deadline_date)).toDate() === new Date() ? true : false
          for (const prop in item) {
            if(prop === 'deadline_date') {
              markedObjectDate[`${moment.unix(Number(item[prop])).format('YYYY-MM-DD')}`] = { activeOpacity: .5, marked: true, selected: selected}
            }
          }
        })
        setMarkedDates(markedObjectDate)
        setIsLoading(false)
      }).catch(error => {
        console.log(error)
      })
    }
  }, [navigation, refetch])
  
  return (
    <VStack flex={1} bg="black.700">
      <Header title="Calendário" icon={CalendarBlank}  />
      {
          isLoading 
          ? <Spinner color="primary" size="lg" accessibilityLabel="Buscando suas disciplinas" />
          : (
            <VStack flex={1}>
              <CalendarRN
                theme={{

                  textDisabledColor: "#a8a29e",
                  calendarBackground: colors.black[700],
                  monthTextColor: String(colors.secondary),
                  todayBackgroundColor: String(colors.secondary),
                  dayTextColor: colors.white,
                  todayTextColor: colors.white,
                  selectedDayTextColor: colors.white,
                  selectedDotColor: colors.white,
                  selectedDayBackgroundColor: String(colors.primary),
                  arrowColor: String(colors.secondary),
                  dotColor: colors.white,
                }}
                style={{ marginTop: -10, backgroundColor: colors.black[700]}} 
                markingType="dot"
                minDate={'2022-01-01'}
                markedDates={markedDates}
                onDayPress={(date) => {
                  getSelectedDayEvents(date.dateString)
                }}
                
              />
                <CalendarDayInfo date={selectedDate} />    
            </VStack>
          )
      }
    </VStack>
  );
}