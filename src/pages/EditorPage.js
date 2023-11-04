import React, { useState, useRef, useEffect } from 'react'
import { toast } from 'react-hot-toast';
import Client from '../components/Client'
import Editor from '../components/Editor'
import { initSocket } from '../socket';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import ACTIONS from '../Actions';
import { act } from '@testing-library/react';


export const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  // useref is hook , due to this our component wont rerender

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current?.on('connect_error', (err) => handleErrors(err));
      socketRef.current?.on('connect_failed', (err) => handleErrors(err));
      function handleErrors(e) {
        toast.error('socket connection failed, try again later.');
        reactNavigator('/');
      }
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });
      //Listening for joined events
      socketRef.current?.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,

          });
        });


      //Listening for disconnected
      console.log(socketRef.current)
      socketRef.current?.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room. `);
        setClients((prev) => {
          return prev.filter(

            (client) => client.socketId !== socketId

          );

        });

      }
      )
    };
    
    location?.state?.username!=null? init():reactNavigator("/");
    return () => {
      return () => {
        if (socketRef.current.readyState === 1) { // <-- This is important
            socketRef.current.close();
        }
    }
      socketRef?.current?.emit(ACTIONS.DISCONNECTED,{roomId});

      socketRef?.current?.disconnect();
      socketRef?.current?.off(ACTIONS.JOINED);
      socketRef?.current?.off(ACTIONS.DISCONNECTED);

    }

  }, []);


  async function copyRoomId() {
    try {
      // global Api
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
      toast.error('Could not copy the room Id');
      console.error(err);
    }
  }
  function leaveRoom() {
    socketRef?.current?.emit(ACTIONS.DISCONNECTED,{roomId});
    reactNavigator('/');
  }


  if (!location.state) {
    return <Navigate to="/" />
  }

  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='Logo'>
            <img className='LogoImage' src="/code-sync.png" alt="logo" />
          </div>
          <h3>Connected</h3>
          <div className='clientsList'>
            {
              clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))
            }
          </div>
        </div>
        <button className='btn copyBtn' onClick={copyRoomId}>Copy ROOM ID</button>
        <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
      </div>
      <div className='editorWrap'>
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => {
          codeRef.current = code;
        }} />
      </div>
    </div>
  )
}
export default EditorPage;