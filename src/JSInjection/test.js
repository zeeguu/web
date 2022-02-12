import useState from "react";
import parse from 'html-react-parser'

export function CanWeReturnJSX(title, content) {
    
    const handleClose=()=>{
        document.getElementById("myDialog").close()
  
    }

    return (
        <div class="modal-content">
            <span id="qtClose" role="button" onclick={handleClose}>X</span>
            <div style={{width: '95%'}}></div>
            <h1>{title}</h1>
            {parse(content)}
            {console.log(content)}
        </div>
    )
}