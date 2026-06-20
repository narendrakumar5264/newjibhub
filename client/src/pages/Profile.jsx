import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { Link } from "react-router-dom";
import { FaCamera, FaUser, FaEnvelope, FaLock, FaTrash, FaSignOutAlt, FaCheckCircle } from "react-icons/fa";

export default function Profile() {
  const fileRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [updatePercentage, setUpdatePercentage] = useState(0);

  const dispatch = useDispatch();
  const { currentUser, error } = useSelector((state) => state.user);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Realstate");
    data.append("cloud_name", "dvph1rffn");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/dvph1rffn/image/upload", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentage);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const uploadImage = JSON.parse(xhr.responseText);
        setUploadedImage(uploadImage.url);
        setUploadStatus("Image uploaded successfully!");
        setFormData((prev) => ({ ...prev, avatar: uploadImage.url }));
      } else {
        setUploadStatus("Image upload failed. Please try again.");
      }
    };

    xhr.onerror = () => {
      setUploadStatus("Image upload failed. Please check your network.");
    };

    xhr.send(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setUpdatePercentage(0);

    let progress = 0;
    const interval = setInterval(() => {
      if (progress < 100) {
        progress += 10;
        setUpdatePercentage(progress);
      } else {
        clearInterval(interval);
      }
    }, 500);

    setTimeout(async () => {
      const dataToSend = {
        ...formData,
        avatar: uploadedImage || currentUser.avatar,
      };
      setFormData(dataToSend);

      try {
        dispatch(updateUserStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(updateUserFailure(data.message));
          setLoading(false);
          clearInterval(interval);
          return;
        }

        dispatch(updateUserSuccess(data));
        setLoading(false);
        setUpdateSuccess(true);
        setSuccessMessage("User updated successfully!");
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      } catch (error) {
        dispatch(updateUserFailure(error.message));
        setLoading(false);
        clearInterval(interval);
      }
    }, 4000);
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-[#0b1120]">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        {/* Header Card */}
        <div className="relative card-premium overflow-hidden mb-6">
          {/* Gradient Banner */}
          <div className="h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 animate-gradient-shift" />

          {/* Avatar */}
          <div className="relative flex flex-col items-center -mt-16 pb-6 px-8">
            <div className="relative group">
              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={handleFileUpload}
              />
              <img
                onClick={() => fileRef.current.click()}
                src={uploadedImage || currentUser.avatar}
                alt="profile"
                className="w-28 h-28 rounded-full object-cover cursor-pointer ring-4 ring-white dark:ring-slate-800 shadow-xl transition-transform duration-300 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={() => fileRef.current.click()}
              >
                <FaCamera className="text-white text-xl" />
              </div>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-3 w-48">
                <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-xs text-slate-500 text-center mt-1">{uploadProgress}%</p>
              </div>
            )}

            {uploadStatus && (
              <p className={`text-sm mt-2 font-medium ${uploadStatus.includes("successfully") ? "text-emerald-500" : "text-rose-500"}`}>
                {uploadStatus}
              </p>
            )}

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-4">{currentUser.username}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{currentUser.email}</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="card-premium p-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Update Profile</h3>
          <form className="flex flex-col gap-5" onSubmit={handleUpdate}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Username"
                  defaultValue={currentUser.username}
                  id="username"
                  className="input-premium pl-11"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  defaultValue={currentUser.email}
                  className="input-premium pl-11"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="password"
                  placeholder="New password (leave blank to keep)"
                  id="password"
                  className="input-premium pl-11"
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="btn-gradient w-full py-3.5 rounded-xl text-sm uppercase tracking-wider disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </span>
              ) : "Update Profile"}
            </button>

            {/* Progress */}
            {loading && (
              <div className="space-y-2">
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${updatePercentage}%` }}
                  />
                </div>
                <p className="text-xs text-center text-slate-500">{updatePercentage}%</p>
              </div>
            )}

            {/* Success */}
            {updateSuccess && (
              <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl animate-scale-in">
                <FaCheckCircle className="text-emerald-500" />
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{successMessage}</span>
              </div>
            )}
          </form>
        </div>

        {/* Danger Zone */}
        <div className="card-premium p-6 mt-6 border-rose-200/50 dark:border-rose-900/30">
          <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-4">Danger Zone</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDeleteUser}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-sm font-medium"
            >
              <FaTrash className="text-xs" /> Delete Account
            </button>
            <button
              onClick={handleSignOut}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              <FaSignOutAlt className="text-xs" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
