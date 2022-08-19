import { createContext, ReactNode, useContext, useState } from "react";

type RefetchContextProviderProps = {
  children: ReactNode
}

type RefetchContextProps = {
  refetch: boolean,
  handleRefetchData: () => void
}

const RefetchContext = createContext({} as RefetchContextProps)

function RefetchContextProvider({ children }: RefetchContextProviderProps) {
  const [refetch, setRefetch] = useState(false)

  function handleRefetchData() {
    setRefetch(!refetch)
  }

  return (
    <RefetchContext.Provider value={{
      refetch,
      handleRefetchData
    }}>
      {
        children
      }
    </RefetchContext.Provider>
  )
}

function useRefetch() {
  const context = useContext(RefetchContext)

  return context
}

export { RefetchContextProvider, useRefetch }