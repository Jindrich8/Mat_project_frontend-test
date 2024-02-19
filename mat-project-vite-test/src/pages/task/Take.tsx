import  { FC } from "react"
import { ShowTaskCmp } from "../../task/show/ShowTaskCmp";
import { useParams } from "react-router-dom";

interface Props {

}

const Take:FC<Props> = () => {
    const { taskId } = useParams();
  return (
    <>
  <ShowTaskCmp 
  style={{flexGrow:1,padding:'3rem 1rem',boxSizing:'border-box'}} 
  taskId={taskId ?? ''} 
  />
    </>
  )
};

export { Take, type Props as TakeProps };
