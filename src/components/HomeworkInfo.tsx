import moment from 'moment';
import { Box, Heading, IModalProps, ScrollView, Spinner, Text, VStack } from 'native-base';
import { Book, CalendarCheck, NotePencil, Tag, TextAlignLeft } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { IHomework } from '../services/sqlite/HomeworkModel';
import Subject, { ISubject } from '../services/sqlite/Subject';
import { categorysHomework } from '../utils/categorysHomework';
import { Title } from './Title';

type SubjectInfo =  IModalProps & {
  homework: IHomework | null,
}

export function HomeworkInfo({homework}: SubjectInfo) {
  const [isLoading, setIsLoading] = useState(true)
  const [subject, setSubject] = useState<ISubject | null>(null)
  useEffect(() => {
   if(homework !== null) {
    Subject.findByTagName(homework?.subject_tagName).then((data: ISubject) => {
     setSubject(data[0])
     setIsLoading(false)
    }).catch((error) => console.log(error))
   }
  }, [homework])

  return (
    <VStack
      shadow={3} 
      py={3}
      px={4}
    >
    {
      isLoading 
      ? <Spinner color="primary" size="lg" accessibilityLabel="Buscando suas disciplinas" /> 
      : (
        <>
          <Heading color="gray.300" py={3} textAlign="center"  mb={5} borderBottomWidth={2} borderBottomColor="gray.300">Anotação</Heading>
            <Box mb={3}>
              <Title primary title="Título" icon={NotePencil} iconSize={27} titleSize="md" />
              <Text fontSize="md" pl={8} color="gray.300">{homework?.title}</Text>
            </Box>
          <Box mb={3}>
            <Title primary title="Categoria" icon={Tag} iconSize={27} titleSize="md" />
            <Text fontSize="md" pl={8} color="gray.300">{homework?.category && categorysHomework[homework?.category].full_title}</Text>
          </Box>
          <Box mb={3}>
            <Title primary title="Matéria" icon={Book} iconSize={27} titleSize="md" />
            <Text fontSize="md" pl={8} color="gray.300">{subject?.name}</Text>
          </Box>
          <Box mb={3}>
            <Title primary title="Data de entrega" icon={CalendarCheck} iconSize={27} titleSize="md" />
            <Text fontSize="md" pl={8} color="gray.300">{moment.unix(Number(homework?.deadline_date)).format('DD/MM/YYYY')}</Text>
          </Box>
          <Box mb={3}>
            <Title primary title="Descrição" icon={TextAlignLeft} iconSize={27} titleSize="md" />
            <ScrollView>
              <Text fontSize="md" pl={8} color="gray.300">{homework?.description}</Text>
            </ScrollView>
          </Box>
        </>
      )
    }
    </VStack>
  );
}

