import { Route, BrowserRouter, Switch } from 'react-router-dom';
import ManageUsers from 'pages/manageUsers';
// @ts-ignore
import ManageBranchs from 'pages/manageBranchs';
// @ts-ignore
import ManageFolders from 'pages/manageFolders';
// @ts-ignore   
import ManageCards from 'pages/manageCards';
// @ts-ignore
import NewUser from 'pages/newUser';
// @ts-ignore
import NewFolder from 'pages/newFolder';
// @ts-ignore
import NewBranch from 'pages/newBranch';
// @ts-ignore
import NewCard from 'pages/newCard';
// @ts-ignore
import UpdateUser from 'pages/updateUser';
// @ts-ignore
import UpdateCard from 'pages/updateCard';
// @ts-ignore
import UpdateBranch from 'pages/updateBranch';
// @ts-ignore 
import UpdateFolder from 'pages/updateFolder';
// @ts-ignore
import Notificacoes from 'pages/notificacoes';
// @ts-ignore
import Assinaturas from 'pages/assinaturas';
// @ts-ignore
import ManageScore from 'pages/manageScorePage';
import Login from 'pages/login';
import PrivateRoute from 'components/basics/privateRoute';
import PrivateAdminRoute from 'components/basics/privateAdminRoute';
import PrivateGestorRoute from 'components/basics/privateGestorRoute';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={Login} />
        <PrivateRoute component={ManageCards} path="/" exact />
        <PrivateRoute component={Notificacoes} path="/notificacoes" exact />
        <PrivateRoute component={Assinaturas} path="/assinaturas" exact />
        <PrivateRoute component={ManageScore} path="/managescore" exact />
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
      </Switch>
    </BrowserRouter>
  );
}
export default Routes;