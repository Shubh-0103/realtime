import React, { useEffect,useRef } from 'react'
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import { Socket } from 'socket.io';
import ACTIONS from '../Actions';

const Editor = ({socketRef,roomId,onCodeChange}) => {
  const editorRef = useRef(null);
  useEffect(()=>{
    async function init(){
editorRef.current=Codemirror.fromTextArea(
  document.getElementById('realtimeEditor'),{
mode: {name: 'javascript', json:true},
theme: 'dracula',
autoCloseTags: true,
autoCloseBrackets: true,
lineNumbers: true,
});
editorRef.current.Ref.on('change',(instance,changes)=>{
  console.log('changes',changes);
  const {origin} = changes;
const code = instance.getvalue();
onCodeChange(code);
if(origin!='setValue'){
  socketRef.current.emit(ACTIONS.CODE_CHANGE,
    {
      roomId,
      code,
          
    })
}
console.log(code);
})
//used for adding data dynamically

socketRef.current.on(ACTIONS.CODE_CHANGE,({code}) =>{
  if(code!==null){
    editorRef.current.setValue(`code`);
  }
})
    }
    init();

  },[]);
  useEffect(()=>{
    if(socketRef.current){
      socketRef.current.on(ACTIONS.CODE_CHANGE,({code}) => {
        if(code!==null){
          editorRef.current.setValue(code);
        }
      });
    }
return ()=> {
  socketRef.current.off(ACTIONS.CODE_CHANGE);
}


  },[socketRef.current]);
  return <textarea id="realtimeEditor"></textarea>;
};
export default Editor;