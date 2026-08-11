import { Route, BrowserRouter } from 'react-router-dom';
import ManageUsers from 'pages/manageUsers';
import ManageBranchs from 'pages/manageBranchs';
import ManageFolders from 'pages/manageFolders';
import ManageCards from 'pages/manageCards';
import NewUser from 'pages/newUser';
import NewFolder from 'pages/newFolder';
import NewBranch from 'pages/newBranch';
import NewCard from 'pages/newCard';
import UpdateUser from 'pages/updateUser';
import UpdateCard from 'pages/updateCard';
import UpdateBranch from 'pages/updateBranch';
import UpdateFolder from 'pages/updateFolder';
import Notificacoes from 'pages/notificacoes';
import Assinaturas from 'pages/assinaturas';
import Login from 'pages/login';
import PrivateRoute from 'components/basics/privateRoute';
import PrivateAdminRoute from 'components/basics/privateAdminRoute';
import PrivateGestorRoute from 'components/basics/privateGestorRoute';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route path="/login" exact component={Login} />
      <PrivateRoute component={ManageCards} path="/" exact />
      <PrivateRoute component={Notificacoes} path="/notificacoes" exact />
      <PrivateRoute component={Assinaturas} path="/assinaturas" exact />
      <PrivateAdminRoute component={ManageUsers} path="/manageusers" exact />
      <PrivateAdminRoute component={ManageBranchs} path="/managebranchs" exact />
      <PrivateAdminRoute component={NewUser} path="/newuser" exact />
      <PrivateAdminRoute component={NewBranch} path="/newbranch" exact />
      <PrivateAdminRoute component={UpdateUser} path="/updateuser" exact />
      <PrivateAdminRoute component={UpdateBranch} path="/updatebranch" exact />
      <PrivateGestorRoute component={ManageFolders} path="/managefolders" exact />
      <PrivateGestorRoute component={NewFolder} path="/newfolder" exact />
      <PrivateGestorRoute component={UpdateFolder} path="/updatefolder" exact />
      <PrivateRoute component={NewCard} path="/newcard" exact />
      <PrivateRoute component={UpdateCard} path="/updatecard" exact />
    </BrowserRouter>
  );
}
export default Routes;