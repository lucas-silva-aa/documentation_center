import { Route, BrowserRouter } from  'react-router-dom';
// @ts-ignore
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
import PrivateAdminRoute from 'components/basics/privateAdminRoute';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={ManageCards} path="/" exact/>
      <Route component={Notificacoes} path="/notificacoes" exact/>
      <Route component={Assinaturas} path="/assinaturas" exact/>
      <PrivateAdminRoute component={ManageUsers} path="/manageusers" exact />
      <PrivateAdminRoute component={ManageBranchs} path="/managebranchs" exact/>
      <PrivateAdminRoute component={ManageFolders} path="/managefolders" exact/>
      <PrivateAdminRoute component={NewUser} path="/newuser" exact />
      <PrivateAdminRoute component={NewFolder} path="/newfolder" exact/>
      <PrivateAdminRoute component={NewBranch} path="/newbranch" exact/>
      <PrivateAdminRoute component={NewCard} path="/newcard" exact/>
      <PrivateAdminRoute component={UpdateUser} path="/updateuser" exact/>
      <PrivateAdminRoute component={UpdateCard} path="/updatecard" exact/>
      <PrivateAdminRoute component={UpdateBranch} path="/updatebranch" exact/>
      <PrivateAdminRoute component={UpdateFolder} path="/updatefolder" exact/>
    </BrowserRouter>
  );
}
export default Routes;