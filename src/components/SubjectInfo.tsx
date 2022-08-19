import { Box, Heading, HStack, IModalProps, ScrollView, Spinner, Text, VStack } from 'native-base';
import { Book, CalendarBlank, Sparkle, Tag, TextAlignLeft, User } from 'phosphor-react-native';
import { ISubject } from '../services/sqlite/Subject';
import { weekDays } from '../utils/weekDays';
import { Title } from './Title';

type SubjectInfo =  IModalProps & {
  subject: ISubject | null,
}

export function SubjectInfo({subject}: SubjectInfo) {
  return (
    <VStack
      shadow={3} 
      py={3}
      px={4}
    >
      {
        !subject ? <Spinner color="primary" size="sm" accessibilityLabel={`Carregando informações da disciplina`} />
        : (
          <>
            <Heading color="gray.300" py={3} textAlign="center"  mb={5} borderBottomWidth={2} borderBottomColor="gray.300">Disciplina</Heading>
            <Box mb={3}>
              <Title primary title="Nome" icon={Book} iconSize={27} titleSize="md" />
              <Text fontSize="md" pl={8} color="gray.300">{subject?.name}</Text>
            </Box>
          <Box mb={3}>
            <Title primary title="Professor" icon={User} iconSize={27} titleSize="md" />
            <Text fontSize="md" pl={8} color="gray.300">{subject?.professor}</Text>
          </Box>
          <Box mb={3}>
            <Title primary title="Tag" icon={Tag} iconSize={27} titleSize="md" />
            <Text fontSize="md" pl={8} color="gray.300">{subject?.tagName}</Text>
          </Box>
          <Box mb={3}>
            <Title primary title="Média necessária" icon={Sparkle} iconSize={27} titleSize="md" />
            <Text fontSize="md" pl={8} color="gray.300">{subject?.average.toFixed(1)}</Text>
          </Box>
          <Box mb={3}>
            <Title primary title="Horário" icon={CalendarBlank} iconSize={27} titleSize="md" />
            <HStack pl={8}>
            {
              JSON.parse(subject?.classesInAWeek).map((day: string, index) => (
                <Text key={day} fontSize="md" color="gray.300">{day}-feira{JSON.parse(subject?.classesInAWeek).length - 1 !== index ? ', ' : ''}</Text>
              ))
            }
            </HStack>
          </Box>
          <Box mb={3}>
            <Title primary title="Descrição" icon={TextAlignLeft} iconSize={27} titleSize="md" />
            <ScrollView>
              <Text fontSize="md" pl={8} color="gray.300">{subject?.description}</Text>
            </ScrollView>
          </Box>
          </>
        )
      }
    </VStack>

  );
}

