import Footer from '../../components/basics/footer';
import Header from '../../components/basics/header';
import Title from  '../../components/basics/title';
// @ts-ignore
import BranchBody from 'components/basics/manageBranchs';

const Branch: React.FC = () => {
    return (

        <>
            <Title />
            <Header />
            <BranchBody />
            <Footer />
        </>
    );
}

export default Branch;