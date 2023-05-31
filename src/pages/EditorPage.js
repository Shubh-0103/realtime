import React,{useState,useRef,useEffect} from 'react'
import Client from '../components/Client'
import  Editor  from '../components/Editor'
import { initSocket } from '../socket';
import { useLocation } from 'react-router-dom';

export const EditorPage = () => {
  const socketRef = useRef(null);
  const location=useLocation();
  // useref is hook , due to this our component wont rerender
  useEffect(()=>{
    const init = async () => {
socketRef.current = await initSocket();
console.log(socketRef.current);
socketRef.current.on('connect',()=>{
  console.log('connected');
})
// socketRef.current.emit(ACTIONS.JOIN,{
//   roomId,
//   username:location.state?.username,
// });

    };
    init();
  },[]);

  const [clients,setClients] = useState([
    {socketId: 1,username: 'Rakesh K'},
    {socketId: 2,username: 'Jogn doe'},
    {socketId: 3,username: 'Jn doe'},
]);
  return (
<div className='mainWrap'>
<div className='aside'>
  <div className='asideInner'>
    <div className='Logo'>
      <img className='LogoImage' src="/code-sync.png" alt="logo"/>
    </div>
    <h3>Connected</h3>
    <div className='clientsList'>  
{
  clients.map((client) => (
    <Client key= {client.socketId} username={client.username}/>
  ))
}
    </div>
  </div>
  <button className='btn copyBtn'>Copy ROOM ID</button>
  <button className='btn leaveBtn'>Leave</button>
</div>
<div className='editorWrap'>
  <Editor/>
</div>
</div>
  )
}
export default EditorPage;