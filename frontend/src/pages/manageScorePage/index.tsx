import Footer from '../../components/basics/footer';
import Header from '../../components/basics/header';
import Title from  '../../components/basics/title';
// @ts-ignore
import ManageScorePage from 'components/basics/manageFolders';

const ScorePage: React.FC = () => {
    return (

        <>
            <Title />
            <Header />
            <ManageScorePage />
            <Footer />
        </>
    );
}

export default ScorePage;