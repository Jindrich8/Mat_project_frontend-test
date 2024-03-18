import './Home.css'
import { FC } from "react"
import { SortableExampleCmp } from '../components/Sortable/Example/SortableExampleCmp';

interface Props {
}

const Home:FC<Props> = () => {

  // return (<Stack className={classes.container} style={{display:'flex',boxSizing:'border-box',maxHeight:'100%'}} h={'100%'}>
  //   <Title className={classes.firstRow}>Home</Title>
  // <ShowTaskCmp className={classes.secondRow} style={{flexGrow:1,padding:'3rem 1rem',boxSizing:'border-box'}} 
  // taskId={'2'} />
  // </Stack>);
  return (<SortableExampleCmp />);
};

export { Home, type Props as HomeProps };
