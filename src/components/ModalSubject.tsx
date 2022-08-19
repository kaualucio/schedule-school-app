import { useNavigation } from '@react-navigation/native';
import { Button, HStack, Spinner, Text, useTheme } from 'native-base';
import { Pencil, Trash } from 'phosphor-react-native';
import { forwardRef, useState } from 'react';
import { Alert, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useRefetch } from '../context/RefetchContext';
import Subject, { ISubject } from '../services/sqlite/Subject';
import { SubjectInfo } from './SubjectInfo';

const { height } = Dimensions.get('screen')

type ModalProps = {
  currentSubjectInfo: ISubject,
  handleShowSubjectInfo: (subject: ISubject | null) => void
}

export const ModalSubject = forwardRef(({ currentSubjectInfo, handleShowSubjectInfo }: ModalProps, ref: any) => {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const { handleRefetchData } = useRefetch()
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete(table: string, id: any) {
    setIsLoading(true)
    try {
      const response = await Subject.remove(table, id)

      if(response) {
          ref.current?.close();
      } 
      setIsLoading(false)
      handleRefetchData()
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      Alert.alert('Ooops :|', 'Ocorreu um erro ao deletar a disciplina, tente novamente')
    }

  }

  function handleGoEditScreen() {
    ref.current?.close();
    navigation.navigate('editSubject', {
      subject: currentSubjectInfo
    })
  }

  return (
          <GestureHandlerRootView >
            <Portal>
              <Modalize
                  ref={ref} 
                  snapPoint={height * 0.8}
                  modalHeight={height * 0.8}
                  onClose={() => handleShowSubjectInfo(null)}
                  FooterComponent={
                    <HStack mb={5} alignItems="center" justifyContent="center">
                      <Button
                        _pressed={{ bg: "gray.500" }}
                        onPress={() => handleDelete('subjects', currentSubjectInfo?.id)} 
                        mr={1}
                        disabled={isLoading} 
                        opacity={isLoading ? 0.7 : 1}
                        bgColor="error.500" 
                        w={40} 
                        h={12}>
                        <HStack alignItems="center">
                          {
                            isLoading 
                            ? <Spinner color="white" size="sm" accessibilityLabel={`Excluindo a disciplina ${currentSubjectInfo?.name}`} /> 
                            : (
                              <>
                                <Trash size={22} color="#fff" />
                                <Text fontSize="md" fontWeight="bold" color="white">Excluir</Text>
                              </>
                            )
                          }
                          
                        </HStack>
                      </Button>
                      <Button 
                        _pressed={{ bg: "gray.500" }} 
                        onPress={handleGoEditScreen}
                        ml={1} 
                        bgColor="primary" 
                        opacity={isLoading ? 0.7 : 1}
                        w={40} 
                        h={12}
                        >
                        <HStack alignItems="center">
                          <Pencil size={22} color={colors.white} />
                          <Text fontSize="md" fontWeight="bold" color="white">Editar</Text>    
                        </HStack>
                      </Button>
                    </HStack>
                  }
                  >
                  <SubjectInfo subject={currentSubjectInfo}/> 
                </Modalize>
            </Portal>
          </GestureHandlerRootView> 
  );
}) 

 