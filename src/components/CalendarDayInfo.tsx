import React, { useEffect, useState } from 'react';
import { Box, HStack, ScrollView, Text, VStack } from 'native-base';
import HomeworkModel, { IHomework } from '../services/sqlite/HomeworkModel';
import moment from 'moment';
import { categorysHomework } from '../utils/categorysHomework';
import { Book, Check, Pencil } from 'phosphor-react-native';

type CalendarDayInfoProps = {
  date: number | string
}

export function CalendarDayInfo({ date }: CalendarDayInfoProps) {
  const [scheduleForToday, setScheduleForToday] = useState([])

  useEffect(() => {
    HomeworkModel.findByDate(date)
    .then((data: IHomework[]) => {
      if(data.length === 0) {
        setScheduleForToday([])
      }else {
        setScheduleForToday(data)
      }
    })
    .catch((error) => {
      console.log('error',error)
    })
  }, [date])

  return (
      
    <HStack flex={1} px={3} pt={5}>
      <Box rounded="full" w={12} h={12} bg="white" ml={2} mr={5} justifyContent="center" alignItems="center">
        <Text fontSize="27px" fontWeight="bold" color="secondary">{moment(date).format('DD')}</Text>
      </Box>
      <VStack>
      {
        scheduleForToday.length === 0 
        ? <Text mt={3} fontSize="xs" color="gray.300">Você não possui nada na agenda pra esse dia!</Text>
        : (
          <ScrollView
            w="full"
            h="full" 
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              pb: 10,
            }}
          >
         { 
         scheduleForToday.map((schedule) => (
            <VStack key={schedule.id} mb={5}>
              <Text fontSize="md" fontWeight="bold">{schedule.title}</Text>
              <HStack>
                <Box mr="2" flexDirection="row" alignItems="center">
                  <Book size={16} weight="bold" color="white" />
                  <Text ml={1} fontSize="xs" color="white">{schedule.subject_tagName}</Text>
                </Box>
                <Box mr="2" flexDirection="row" alignItems="center">
                  <Pencil size={16} weight="bold" color="white" />
                  <Text ml={1} fontSize="xs" color="white">{categorysHomework[schedule.category].label}</Text>
                </Box>
                <Box mr="2" flexDirection="row" alignItems="center">
                  <Check size={16} weight="bold" color="white" />
                  <Text ml={1} fontSize="xs" color="white">{schedule.completed ? 'Entregue' : 'À entregar'}</Text>
                </Box>
              </HStack>
            </VStack>
          ))
         }
        </ScrollView>
        )
      }
      </VStack>
    </HStack>
  );
}