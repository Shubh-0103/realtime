import React, { useState } from 'react'
import { v4 as uuidV4 } from 'uuid'
// rafc : react add function export  
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const Home = () => {
    const navigate = useNavigate();
    const [roomID, setRoomId] = useState('');
    const [username, setusername] = useState('');
    const createNewRoom = (e) => {
        e.preventDefault(); //this will prevent page from refreshing
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };
    const joinRoom = () => {
        if (!roomID || !username) {
            toast.error('ROOM ID and Username is required');
            return;
        }
        //redirect (navigate also tranfer data to the next page)
        navigate(`/editor/${roomID}`, {
            state: {
                username,

            }
        })
    };
    const handleInputEnter = (e) => {
        console.log('event', e.code);
        if (e.code === 'Enter') {
            joinRoom();
        }
    };
    return (

        <div className='homePageWrapper'>
            <div className='formWrapper'>
                <img className="homePagelogo" src="/code-sync.png" alt="code-sync-log" />
                <h4 className='mainLabel'>Paste invitation Room Id</h4>
                < div className='inputGroup'>
                    <input
                        type='text'
                        className='inputbox'
                        placeholder='ROOM ID'
                        onChange={(e) => setRoomId(e.target.value)} //if someone wamts to generate id manually
                        value={roomID}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type='text'
                        className='inputbox'
                        placeholder='username'
                        onChange={(e) => setusername(e.target.value)} //if someone wamts to generate id manually
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <button className='btn joinbtn' onClick={joinRoom}>join </button>
                    <span className='createInfo'>

                        If you dont have an invite then create &nbsp;
                        <a onClick={createNewRoom} href="" className='createNewBtn'>new Room</a>
                    </span>
                </div>
            </div>
            <footer>
                <h4>Built with by <a href="">Shubh</a></h4>
            </footer>
        </div>
    )
}
export default Home;