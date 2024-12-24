// * React and Redux:
import { useSelector } from 'react-redux';
 
// * Views:
import ConfigurationView from './views/configurationView/ConfigurationView';
import MainView from './views/mainView/MainView';

const App = () => {

    const view = useSelector(state => state.view.view);

    return (
        <>
            {
                view === 'configuration' ? 
                <ConfigurationView /> :
                <MainView />
            }
        </>
    )
}

export default App;
