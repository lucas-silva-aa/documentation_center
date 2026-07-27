import Footer from '../../components/basics/footer';
import Header from '../../components/basics/header';
import Title from  '../../components/basics/title';
// @ts-ignore
import UserBody from 'components/basics/manageUsers';

const User: React.FC = () => {
    return (

        <>
            <Title />
            <Header />
            <UserBody />
            <Footer />
        </>
    );
}

export default User;