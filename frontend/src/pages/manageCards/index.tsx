import Footer from '../../components/basics/footer';
import Header from '../../components/basics/header';
import Title from  '../../components/basics/title';
// @ts-ignore
import CardBody from 'components/basics/manageCards';

const Card: React.FC = () => {
    return (

        <>
            <Title />
            <Header />
            <CardBody />
            <Footer />
        </>
    );
}

export default Card;