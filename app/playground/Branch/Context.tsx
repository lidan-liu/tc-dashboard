import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

type MasterBranchContextType = {
    onMaster: boolean;
    branch: string;
    setBranch: Dispatch<
      SetStateAction<{
        onMaster: boolean;
        branch: string;
      }>
    >;
  };
  
  export const MasterBranchContext = createContext<MasterBranchContextType>({
    onMaster: false,
    branch: '',
    setBranch: () => {}
  });
  
  export const BranchProvider = ({ children }: { children: ReactNode }) => {
    const [branch, setBranch] = useState<{
      onMaster: boolean;
      branch: string;
    }>({
      onMaster: true,
      branch: 'master'
    });
  
    return (
      <MasterBranchContext.Provider
        value={{
          onMaster: branch.onMaster,
          branch: branch.branch,
          setBranch
        }}
      >
        {children}
      </MasterBranchContext.Provider>
    );
  };