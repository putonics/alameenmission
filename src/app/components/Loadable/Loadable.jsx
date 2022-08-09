import { Typography } from '@mui/material';
import { useUser } from 'app/redux/classes/User';
import ContentBox from 'app/views/workspace/styledcomponents/ContentBox';
import workspaceRoutes from 'app/views/workspace/WorkspaceRoutes';
import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from '../MatxLoading/MatxLoading'

/**
 * @param {string} path1 
 * @param {string} path2 
 */
const equals = (path1, path2) => {
   const p1 = path1.split('/')
   const p2 = path2.split('/')
   if (p1.length === p2.length) {
      let flag = true
      p1.forEach((p, i) => {
         if (!p.startsWith(':') && !p2[i].startsWith(':')) {
            flag = flag && p === p2[i]
         }
      })
      return flag
   }
   return false
}

const GuardPrivilege = props => {
   const location = useLocation()
   const user = useUser()
   const [auth, setAuth] = React.useState(false)
   React.useEffect(() => {
      if (user.loggedin) {
         const route = workspaceRoutes.find(r => equals(r.path, location.pathname))
         const privilege = route ? route.privilege : ''
         setAuth(user.privilege.includes(privilege))
      } else {
         setAuth(true)
      }
   }, [location, user])
   return auth ? props.children
      :
      <ContentBox>
         <Typography sx={{ fontWeight: 700, fontSize: 30, color: '#9999aa' }}>
            You are not authorised to see this page!
         </Typography>
      </ContentBox>
}

const Loadable = (Component) => (props) => (
   <Suspense fallback={<Loading />}>
      <GuardPrivilege>
         <Component {...props} />
      </GuardPrivilege>
   </Suspense>
);

export default Loadable;