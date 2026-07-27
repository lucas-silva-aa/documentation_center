import Footer from '../../components/basics/footer';
import Header from '../../components/basics/header';
import Title from  '../../components/basics/title';
// @ts-ignore
import FolderBody from 'components/basics/manageFolders';

const Folder: React.FC = () => {
    return (

        <>
            <Title />
            <Header />
            <FolderBody />
            <Footer />
        </>
    );
}

export default Folder;