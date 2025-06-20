import Board from './components/Board/Board';
import Toolbar from './components/Toolbar';
import BoardProvider from './store/BoardProvider';
import ToolboxProvider from './store/ToolboxProvider';
import Toolbox from './components/Toolbox';

// import BoardProvider from './store/boardProvider';

function App() {
  
  return (
    <BoardProvider>
      <ToolboxProvider>
        <Toolbar/>
        <Board/>
        <Toolbox/>
      </ToolboxProvider>
    </BoardProvider>  
    
  );
}

export default App;
