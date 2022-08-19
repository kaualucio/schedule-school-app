import React, { useEffect, useState } from 'react';
import { Box, Heading, HStack, Input, KeyboardAvoidingView, Pressable, ScrollView, Select, Text, useTheme, VStack } from 'native-base';
import { CalendarBlank, Check, NotePencil, TextT} from 'phosphor-react-native';
import { Alert, Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'

import Subject, { ISubject } from '../services/sqlite/Subject';
import HomeworkModel from '../services/sqlite/HomeworkModel';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Header } from '../components/Header';
import { useRefetch } from '../context/RefetchContext';


export function AddHomework() {
  const {colors} = useTheme()
  const { handleRefetchData } = useRefetch()
  const [subjects, setSubjects] = useState<ISubject[]>([])
  const [date, setDate] = useState<Date | null>(null);
  const [mode, setMode] = useState<any>('date');
  const [type, setType] = useState('');
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [show, setShow] = useState(false);

  const weekDays = [ 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', ]

  const onChange = (_event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode: string) => {
    setShow(true);
    setMode(currentMode);
  };
  
  
  useEffect(() => {
    Subject.all().then((data) => {
      setSubjects(data as ISubject[])
    }).catch(error => {
      console.log(error)
    })
  }, []);


  async function handleAddHomework() {
      
      if(!subject || !date || !title || !description) {
        return Alert.alert('Campos inválidos', 'Os campos com o asterísco (*) são obrigatórios, por favor preencha-os para continuar.')
      }
      try {
        const response = await HomeworkModel.create({ title, category: type, subject_tagName: subject, description, deadline_date: date })
        Alert.alert('Sucesso', response)
        setSubject('')
        setTitle('')
        setDescription('')
        setDate(null)
        handleRefetchData()
      } catch (error: any) {
        console.log(error)
        Alert.alert('Erro', error)
  
      }

  }
  return (
      <KeyboardAvoidingView flex={1}  bg="black.700" behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView 
              w="full"
              h="full"
              showsVerticalScrollIndicator={false}
              _contentContainerStyle={{
                pb: 32,
              }}>
            <Header icon={NotePencil} button add title="Nova anotação" handleFunction={handleAddHomework}  />
            <VStack px={4}>
              <VStack my={5} alignItems="center">
                <Input 
                  value={title}
                  placeholderTextColor={colors.gray[200]}
                  onChangeText={setTitle}
                  mb={4}
                  borderColor={colors.gray[200]}
                  borderWidth={2}
                  _focus={{
                    borderColor: String(colors.secondary),
                    backgroundColor: "transparent",
                    InputLeftElement: <TextT style={{marginLeft: 8}} size={35} color={String(colors.secondary)} />
                  }}
                  px={1}
                  h={14}
                  color={colors.gray[200]}
                  placeholder="Atividade"
                  fontSize="md"
                  isRequired
                  InputLeftElement={<TextT style={{marginLeft: 8}} size={35} color={colors.gray[200]} />}
                />
                <Box w="full" mb={4}>
                  <Select
                    borderColor={colors.gray[200]}
                    placeholderTextColor={colors.gray[200]}
                    borderWidth={2} 
                    px={1}
                    h={14}
                    w="full"
                    color={colors.gray[200]}
                    fontSize="md"
                    _actionSheetContent={{
                      _dragIndicator: {    
                        bgColor: "white"
                      },
                      backgroundColor: 'green.500',
                    }}
                    _item={{ backgroundColor: 'green.500' }}
                    selectedValue={type}
                    onValueChange={(e) => setType(e)}
                    placeholder="Selecione a categoria"
                    _selectedItem={{
                      startIcon:<Check size={25} color={String(colors.secondary)} />
                    }}
                    >
                    <Select.Item value="atv-casa" label="Atividade de Casa" />
                    <Select.Item value="tra-sem" label="Trabalho/Seminário" />
                    <Select.Item value="aval" label="Avaliação" />
                    <Select.Item value="outro" label="Outro" />
                  </Select>
                </Box>
                <Box w="full" mb={4}>
                  <Select
                    placeholderTextColor={colors.gray[200]}
                    borderColor={colors.gray[200]}
                    borderWidth={2} 
                    px={1}
                    h={14}
                    w="full"
                    color={colors.gray[200]}
                    fontSize="md"
                    _actionSheetContent={{
                      _dragIndicator: {    
                        bgColor: "#000"
                      },
                      backgroundColor: 'green.500',
                    }}
                    _item={{ backgroundColor: 'green.500' }}
                    selectedValue={subject}
                    onValueChange={(e) => setSubject(e)}
                    placeholder="Selecione a matéria"
                    _selectedItem={{
                      startIcon:<Check size={25} color={String(colors.secondary)} />
                    }}
                    >
                      {
                        subjects.map(subject => (
                          <Select.Item key={subject.id} value={subject.tagName} label={subject.name} />
                        ))
                      }
                  </Select>
                </Box>
                <Pressable
                  mb={4}
                  onPress={() => showMode('date')}
                  rounded="sm"
                  w="full"
                  px={2}
                  py={3}
                  position="relative"
                  borderColor={colors.gray[200]}
                  borderWidth={2}
                  
                    >
                  <Heading color="gray.200" px={1} position="absolute" top="-11px" left={4} bg="black.700" fontSize="sm" mb={4}>Data entrega</Heading>
                  <HStack 
                    alignItems="center"
                    color={colors.gray[200]}
                    fontSize="lg">
                    <CalendarBlank size={32} color={colors.gray[200]} />
                    <Text fontWeight="bold" color="gray.200" fontSize="xl" ml={2}>{date ? `${weekDays[date.getDay()]}, ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`: 'Domingo, 00/00'}</Text>
                  </HStack>
                </Pressable>

                {show && (
                    <DateTimePicker
                      value={new Date()}
                      mode={mode}
                      is24Hour={true}
                      onChange={onChange}
                    />
                  )}   

                  <Input
                  placeholderTextColor={colors.gray[200]} 
                    mb={4}
                    borderColor={colors.gray[200]}
                    borderWidth={2}
                    _focus={{
                      borderColor: String(colors.secondary),
                      backgroundColor: "transparent",
                      InputLeftElement: <NotePencil style={{marginLeft: 8}} size={35} color={String(colors.secondary)} />
                    }}
                    px={1}
                    h={14}
                    color={colors.gray[200]}
                    fontSize="md"
                    placeholder="Descrição"
                    multiline
                    value={description}
                    onChangeText={setDescription}
                    InputLeftElement={<NotePencil style={{marginLeft: 8}} size={35} color={colors.gray[200]} />}
                  />
                  {/* <HStack position="relative" alignItems="center">
                    <Box w="full" h={1} bg="gray.300" />
                    <HStack position="absolute" px={1} left={4} alignItems="center" bg="gray.100">
                      <Bell color={colors.gray[200]} size={20} />
                      <Heading color="gray.300" fontSize="sm" ml={1}>Notificação</Heading>
                    </HStack>
                  </HStack>
                  <Box w="full" mt={4}>
                  <Select
                    borderColor={colors.gray[200]}
                    borderWidth={2} 
                    px={1}
                    h={14}
                    w="full"
                    color={colors.gray[200]}
                    fontSize="md"
                    _actionSheetContent={{
                      _dragIndicator: {    
                        bgColor: "#000"
                      },
                      backgroundColor: 'green.500',
                    }}
                    _item={{ backgroundColor: 'green.500', color:"white" }}
                    selectedValue={subject}
                    onValueChange={(e) => setSubject(e)}
                    placeholder="Escolha o horário para ser notificado"
                    _selectedItem={{
                      startIcon:<Check size={25} color={String(colors.secondary)} />
                    }}
                    >
                    <Select.Item value="10" label="10 minutos antes" />
                    <Select.Item value="15" label="15 minutos antes" />
                    <Select.Item value="30" label="30 minutos antes" />
                    <Select.Item value="60" label="1 hora antes" />
                    <Select.Item value="1" label="1 dia antes" />
                  </Select>
                </Box> */}
              </VStack>      
            </VStack>            
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

  );
}