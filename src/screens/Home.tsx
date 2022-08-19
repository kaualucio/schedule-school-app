import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { VStack, ScrollView, Text, Spinner } from 'native-base';
import { Books } from 'phosphor-react-native';
import { Header } from '../components/Header';
import { SchoolSubject } from '../components/SchoolSubject';
import Subject, { ISubject } from '../services/sqlite/Subject';
import { ModalSubject } from '../components/ModalSubject';
import db from '../services/sqlite/SQLiteDatabase';
import { useRefetch } from '../context/RefetchContext';

export function Home() {
  const { refetch, handleRefetchData } = useRefetch()
  const navigation = useNavigation()
  const modalizeRef = useRef<any>(null);
  const [subjects, setSubjects] = useState<ISubject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSubjectInfo, setCurrentSubjectInfo] = useState<ISubject | null>(null)

  function handleAddSubject() {
    navigation.navigate('newSubject')
  }

  function handleShowSubjectInfo(subject:ISubject | null) {
    currentSubjectInfo === subject ? setCurrentSubjectInfo(null) : setCurrentSubjectInfo(subject)
    modalizeRef.current?.open();
  }

  useEffect(() => {
      if(navigation.isFocused() || refetch) {
        Subject.all().then((data) => {
          setSubjects(data as ISubject[])
          setIsLoading(false)
          refetch && handleRefetchData()
        }).catch(error => {
          console.log(error)
        })
      }
 }, [navigation, refetch]);

  // useEffect(() => {
  //   console.log('useEffect')
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       "create table if not exists homeworks (id varchar(255) primary key not null, title varchar(255) not null, category varchar(50) not null, subject_tagName varchar(4) not null, deadline_date datetime, completed boolean, description varchar(255), created_at datetime, updated_at datetime, CONSTRAINT fk_subject FOREIGN KEY (subject_tagName) REFERENCES subjects(tagName));",
  //       [],
  //       (_: any , res: any) => {
  //         console.log('resposta', res)
  //       },
  //       (_: any , error: any) => {
  //         console.log('resposta', error)
  //       }
  //     );
  //   });
  // }, [])

  return (
    <VStack flex={1} bg="black.700"> 
      <ModalSubject currentSubjectInfo={currentSubjectInfo} handleShowSubjectInfo={handleShowSubjectInfo} ref={modalizeRef} />
      <Header handleFunction={handleAddSubject} button icon={Books} title="Minhas matérias" />

      <VStack flex={1} px={2}>
        {
          isLoading 
          ? <Spinner color="primary" size="lg" accessibilityLabel="Buscando suas disciplinas" />
          : subjects.length > 0 ? (
            <ScrollView 
              w="full"
              h="full"
              showsVerticalScrollIndicator={false}
              _contentContainerStyle={{
                pb: 32,
              }}
            >
              {
                subjects.map((subject: ISubject) => (
                  <SchoolSubject handleShowSubjectInfo={handleShowSubjectInfo} key={subject.id} data={subject} />
                ))
              }
            </ScrollView> 
          ) 
          : (
            <Text textAlign="center" color="gray.300">Você não possui nenhuma disciplina cadastrada</Text>
          )
        }
        
      </VStack>
    </VStack>
  );
}