import { useContext } from 'react';
import { MasterBranchContext } from '../Context';
import { Button } from '@tremor/react';


export const BranchToggle = () => {
  const { setBranch, branch } = useContext(MasterBranchContext);

  const toggleMaster = () => {
    setBranch((preState) => {
      return {
        onMaster: !preState.onMaster,
        branch: preState.branch === 'master' ? '' : 'master'
      };
    });
  };

  return (
    <div className="flex justify-between">
      <Button size="md" onClick={toggleMaster}>
        toggle master branch
      </Button>
    </div>
  );
};