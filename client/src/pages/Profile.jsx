import React, {useRef, useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref,uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';

export default function Profile() {

  const [file,setFile]=useState(undefined);
  const [filePer, setFilePer]=useState(0);
  const [fileUploadError,setFileUploadError]=useState(false);
  const[formData, setFormData]=useState({});

  const {currentUser}=useSelector((state)=>state.user)
  const fileRef=useRef(null)
 



  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file])

  /**
 * Handles the upload of a file to Firebase storage.
 * @param {object} file - The file to be uploaded.
 */
  const handleFileUpload=(file)=>{
    // Get Firebase storage reference
    const storage=getStorage(app);

    const fileName=new Date().getTime() + file.name;

     // Create a reference to the file in Firebase storage
    const storageRef=ref(storage,fileName)
    
     // Initialize the upload task to upload the file
    const uploadTask=uploadBytesResumable(storageRef,file);

     // Set up event listeners for upload task state changes
    uploadTask.on('state_changed',
     // Progress event: update file upload progress
      (snapshot)=>{
        const progress=(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },
      // Error event: set file upload error flag if an error occurs
      (error)=>{
        setFileUploadError(true);
      },
      // Completion event: get download URL and update form data with the uploaded file URL
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadURL)=>{
            setFormData({...formData, avatar:downloadURL})
        })
      }
      );
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*'/>
        <img 
            onClick={()=>fileRef.current.click()}
            className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
            src={formData.avatar || currentUser.photo} alt="profilePhoto" />
        <p className='text-sm self-center'>
          {fileUploadError ?
            (<span className='text-red-700'>Error Image upload</span>) :
            filePer>0 && filePer<100 ? 
            (<span className='text-slate-700'>{`Uploading ${filePer}`}</span>) :
            filePer ===100 ?
            (<span className='text-green-700'>Succesfully uploaded image</span>)
            :""
          }
        </p>
        <input 
            className='border p-3 rounded-lg'
            type="text" placeholder='username' id='username'/>
        <input 
            className='border p-3 rounded-lg'
            type="email" placeholder='email' id='email'/>
        <input 
            className='border p-3 rounded-lg'
            type="password" placeholder='password' id='password'/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer font-medium'>Delete account</span>
        <span className='text-red-700 cursor-pointer font-medium'>Sign out</span>
      </div>
    </div>
  )
}
