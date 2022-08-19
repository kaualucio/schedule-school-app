import { HStack, Input, KeyboardAvoidingView, ScrollView, useTheme, VStack } from 'native-base';
import { Book, CalendarBlank, Sparkle, Tag, TextAlignLeft, User } from 'phosphor-react-native';
import { Alert, Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import { Checkbox } from '../components/Checkbox';
import { Header } from '../components/Header';
import Subject from '../services/sqlite/Subject';
import { useState } from 'react';
import { Title } from '../components/Title';
import { useRefetch } from '../context/RefetchContext';
import { weekDays } from '../utils/weekDays';

export function AddSubject() {
  const {colors} = useTheme()
  const { handleRefetchData } = useRefetch()
  const [daysSubjectInAWeek, setDaysSubjectInAWeek] = useState<string[]>([])
  const [subject, setSubject] = useState('')
  const [professor, setProfessor] = useState('')
  const [tagName, setTagName] = useState('')
  const [average, setAverage] = useState(0)
  const [description, setDescription] = useState('')

  function handleScheduleSubject(label: string) {
    const foundInState = daysSubjectInAWeek.find(dayWeek => dayWeek === label)
    if(foundInState) {
      setDaysSubjectInAWeek(oldState => [...oldState.filter(oldValue => oldValue !== label)])
    }else {
      setDaysSubjectInAWeek(oldState => [...oldState, label])
    }
  } 

  async function handleAddSubject() {
      
    if(!subject || !professor || !tagName || !average || daysSubjectInAWeek.length === 0) {
      return Alert.alert('Campos inválidos', 'Os campos com o asterísco (*) são obrigatórios, por favor preencha-os para continuar.')
    }
    try {
      const response = await Subject.create({ name: subject, professor, average, classesInAWeek: JSON.stringify(daysSubjectInAWeek), description, tagName })
      Alert.alert('Sucesso', response)
      setDaysSubjectInAWeek([])
      setSubject('')
      setProfessor('')
      setTagName('')
      setDescription('')
      setAverage(0)
      handleRefetchData()
    } catch (error: any) {
      console.log(error)
      Alert.alert('Erro', error)

    }
    
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView flex={1}  bg="black.700" behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView
          _contentContainerStyle={{
            pb: 32
          }}
          >
            <Header icon={Book} button add handleFunction={handleAddSubject} title="Nova matéria" />
              <VStack px={4}>
                <VStack my={5} alignItems="center">
                  <Input 
                    mb={3}
                    borderColor={colors.gray[200]}
                    borderWidth={2}
                    placeholderTextColor={colors.gray[200]}
                    _focus={{
                      borderColor: String(colors.secondary),
                      backgroundColor: "transparent",
                      InputLeftElement: <Book style={{marginLeft: 8}} size={35} color={String(colors.secondary)} />
                    }}
                    px={1}
                    h={14}
                    value={subject}
                    onChangeText={(e) => setSubject(e)}
                    color={colors.gray[200]}
                    placeholder="Matéria*"
                    fontSize="md"
                    isRequired
                    InputLeftElement={<Book style={{marginLeft: 8}} size={35} color={colors.gray[200]} />}
                  />
                  <Input 
                    value={professor}
                    onChangeText={(e) => setProfessor(e)}
                    mb={3}
                    placeholderTextColor={colors.gray[200]}
                    borderColor={colors.gray[200]}
                    borderWidth={2}
                    _focus={{
                      borderColor: String(colors.secondary),
                      backgroundColor: "transparent",
                      InputLeftElement: <User style={{marginLeft: 8}} size={35} color={String(colors.secondary)} />
                    }}
                    px={1}
                    h={14}
                    color={colors.gray[200]}
                    placeholder="Professor(a)*"
                    fontSize="md"
                    isRequired
                    InputLeftElement={<User style={{marginLeft: 8}} size={35} color={colors.gray[200]} />}
                  />
                  <HStack w="full" alignItems="center" justifyContent="space-between">
                    <Input
                      value={tagName}
                      onChangeText={(e) => setTagName(e)}
                      w="full"
                      maxW="157px"
                      placeholderTextColor={colors.gray[200]}
                      borderColor={colors.gray[200]}
                      borderWidth={2}
                      _focus={{
                        borderColor: String(colors.secondary),
                        backgroundColor: "transparent",
                        InputLeftElement: <Tag style={{marginLeft: 8}} size={32} color={String(colors.secondary)} />
                      }}
                      px={2}
                      h={14}
                      color={colors.gray[200]}
                      placeholder="Abreviação*"
                      fontSize="md"
                      maxLength={4}
                      isRequired
                      InputLeftElement={<Tag style={{marginLeft: 8}} size={32} color={colors.gray[200]} />}
                    />
                    <Input
                      value={average === 0 ? '' : String(average)}
                      onChangeText={(e) => setAverage(Number(e))}
                      w="full"
                      maxW="157px"
                      placeholderTextColor={colors.gray[200]}
                      borderColor={colors.gray[200]}
                      borderWidth={2}
                      _focus={{
                        borderColor: String(colors.secondary),
                        backgroundColor: "transparent",
                        InputLeftElement: <Sparkle size={32} style={{marginLeft: 8}} color={String(colors.secondary)} />
                      }}
                      px={2}
                      h={14}
                      color={colors.gray[200]}
                      placeholder="Média"
                      fontSize="md"
                      isRequired
                      keyboardType="numeric"
                      InputLeftElement={<Sparkle style={{marginLeft: 8}} size={32} color={colors.gray[200]} />}
                    />
                  </HStack>
                </VStack>
                <Title title="Horário*" icon={CalendarBlank} />
                  <HStack justifyContent="space-between" alignItems="center" mt={3} mb={4}>
                  {
                      weekDays.map((day, index) => (
                        <Checkbox 
                          key={index} 
                          daysSubjectInAWeek={daysSubjectInAWeek} 
                          handleScheduleSubject={handleScheduleSubject} 
                          label={day} />
                      ))
                    }
                   
                  </HStack>
                  <Title title="Descrição" icon={TextAlignLeft} />
                  <Input
                    value={description}
                    onChangeText={(e) => setDescription(e)}
                    _focus={{
                      borderColor: String(colors.secondary),
                      backgroundColor: "transparent",
                    }}
                    w="full"
                    textAlignVertical="top"
                    borderColor={colors.gray[200]}
                    borderWidth={2}
                    px={2}
                    h={24}
                    color={colors.gray[200]}
                    fontSize="md"
                    multiline
                  />
            </VStack>            
          </ScrollView>
      </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

  );
}

