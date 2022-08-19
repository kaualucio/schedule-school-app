import { useNavigation } from '@react-navigation/native';
import { ScrollView, Spinner, Text, VStack } from 'native-base';
import { NotePencil } from 'phosphor-react-native';
import { useEffect, useRef, useState } from 'react';
import { Header } from '../components/Header';
import { Homework } from '../components/Homework';
import { ModalHomework } from '../components/ModalHomework';
import { useRefetch } from '../context/RefetchContext';
import HomeModel, { IHomework } from '../services/sqlite/HomeworkModel';

export function Schedule() {
  const navigation = useNavigation()
  const { refetch, handleRefetchData } = useRefetch()
  const modalizeRef = useRef<any>(null);
  const [homeworks, setHomeworks] = useState<IHomework[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentHomeworkInfo, setCurrentHomeworkInfo] = useState<IHomework | null>(null)

  function handleAddHomework() {
    navigation.navigate('newHomework')
  }

  function handleShowHomeworkInfo(subject:IHomework | null) {
   setCurrentHomeworkInfo(subject)
    modalizeRef.current?.open();
  }


  useEffect(() => {
      if(navigation.isFocused() || refetch) {
        HomeModel.all().then((data) => {
          setHomeworks(data as IHomework[])
          setIsLoading(false)
          refetch && handleRefetchData()
        }).catch(error => {
          console.log(error)
        })
      }
 }, [navigation.isFocused(), refetch]);

  return (
    <VStack flex="1" bg="black.700">
      <ModalHomework currentHomeworkInfo={currentHomeworkInfo} handleShowHomeworkInfo={handleShowHomeworkInfo} ref={modalizeRef} />
      <Header handleFunction={handleAddHomework} button title="Minha agenda" icon={NotePencil}  />
      <VStack px={2}>
        {
          isLoading 
          ? <Spinner color="primary" size="lg" accessibilityLabel="Buscando suas disciplinas" />
          : homeworks.length > 0 ? (
            <ScrollView 
              w="full"
              h="full"
              showsVerticalScrollIndicator={false}
              _contentContainerStyle={{
                pb: 32,
              }}
            >
              {
                homeworks.map((homework: IHomework) => (
                  <Homework key={homework.id} handleShowHomeworkInfo={handleShowHomeworkInfo} data={homework} />
                ))
              }
            </ScrollView> 
          ) 
          : (
            <Text textAlign="center" color="gray.300">Você ainda não salvou nada em sua agenda</Text>
          )
        }
      </VStack>
    </VStack>
  );
}