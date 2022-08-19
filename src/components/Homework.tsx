import moment from 'moment';
import { Box, Heading, HStack, Pressable, Text, VStack } from 'native-base';
import { Book, Bookmark, CalendarCheck, Check, Pencil } from 'phosphor-react-native';
import { IHomework } from '../services/sqlite/HomeworkModel';
import { categorysHomework } from '../utils/categorysHomework';

type HomeworkProps = {
  data: IHomework,
  handleShowHomeworkInfo: (homework: IHomework | null) => void
}

export function Homework({data, handleShowHomeworkInfo}: HomeworkProps) {
  return (
    <Pressable mb="4" onPress={() => handleShowHomeworkInfo(data)}>
      <HStack 
        bg={{ 
          linearGradient: { 
            colors: ['#cb69c1', '#6c72cb'], 
            start: [0, 0], 
            end: [1, 1] 
          } 
        }} 
        h="24" 
        px={2} 
        shadow="3" 
        rounded="md" 
        alignItems="center">
        <Bookmark color="white" size={45} />
        <VStack ml={2}>
          <Heading color="white" fontSize="lg">{data.title.length >= 20 ? `${data.title.substring(0, 20)}...` : data.title}</Heading>
          <HStack mt="1" justifyContent="space-between">
                <Box mr="2" flexDirection="row" alignItems="center">
                  <Book size={18} weight="bold" color="white" />
                  <Text  fontSize="xs" color="white">{data.subject_tagName}</Text>
                </Box>
                <Box mr="2" flexDirection="row" alignItems="center">
                  <Pencil size={18} weight="bold" color="white" />
                  <Text  fontSize="xs" color="white">{categorysHomework[data.category].label}</Text>
                </Box>
                <Box mr="2" flexDirection="row" alignItems="center">
                  <CalendarCheck size={18} weight="bold" color="white" />
                  <Text  fontSize="xs" color="white">{moment.unix(Number(data.deadline_date)).format('DD/MM')}</Text>
                </Box>
                <Box mr="2" flexDirection="row" alignItems="center">
                  <Check size={18} weight="bold" color="white" />
                  <Text  fontSize="xs" color="white">{data.completed ? 'Entregue' : 'À entregar'}</Text>
                </Box>
              </HStack>
        </VStack>
      </HStack>
    </Pressable>
  );
}