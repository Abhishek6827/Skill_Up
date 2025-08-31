import React,{useState} from "react";
import "./DeleteModal.css";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

const DeleteModal = ({ closeModal }) => {
 const [message, setMessage] = useState(null);
 const {deleteUsers}  = useAuth();
 const navigate = useNavigate();

 const deleteHandler = async () => {
   
    try{
        await deleteUsers();
        navigate("/");
        setMessage(null);
    }
    catch(err){
     setMessage("Please login recently to delete account");
     console.log(err.message); 
    }
     
  };

    return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseButton">
          <button id="closeButton"
            onClick={() => {
              closeModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          <h3>Are you sure you want to Delete Account ?</h3>
        </div>
        <div className="body"><p>{message}</p> </div>
        <div className="footer">
          <button id="cancelButton" className="footerButton"
            onClick={() => {
              closeModal(false);
            }}
          >
            Cancel
          </button>
          <button id="deleteButton" className="footerButton" onClick={deleteHandler}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
