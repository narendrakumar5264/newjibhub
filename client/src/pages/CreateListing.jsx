import { useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ListingForm from '../components/listings/ListingForm';

export default function CreateListing() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    recruiterName: "", companyName: "", jobTitle: "", imageUrls: [],
    salary: "", jobType: "", description: "", experienceRequired: "",
    skillsRequired: "", city: "", address: "",
  });
  const [files, setFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [id]: type === "checkbox" ? checked : value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length <= 6) {
      setFiles((prev) => [...prev, ...selectedFiles]);
      setUploadStatus("");
    } else {
      setUploadStatus("You can only upload a total of 6 images.");
    }
  };

  const handleUploadClick = async () => {
    if (files.length === 0) { setUploadStatus("No files selected."); return; }
    setIsUploading(true);
    try {
      const promises = files.map((file) => storeImage(file));
      const imageUrls = await Promise.all(promises);
      setUploadedImages(imageUrls);
      setFormData((prev) => ({ ...prev, imageUrls }));
      setIsUploading(false);
      setUploadStatus("All images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      setUploadStatus("Some images failed to upload.");
      setIsUploading(false);
    }
  };

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Realstate");
      data.append("cloud_name", "dvph1rffn");
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.cloudinary.com/v1_1/dvph1rffn/image/upload", true);
      xhr.onload = () => {
        if (xhr.status === 200) resolve(JSON.parse(xhr.responseText).url);
        else reject(new Error(`Failed to upload: ${file.name}`));
      };
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(data);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (uploadedImages.length < 1) return setError('You must upload at least one image');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) { setError(data.message); }
      navigate(`/listing/${data._id}`);
    } catch (error) { setError(error.message); setLoading(false); }
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-[#0b1120]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Post Your Job</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Hire the best talent online!</p>
        </div>
        {error && <p className="text-sm text-rose-500 text-center mb-4 font-medium">{error}</p>}
        <ListingForm
          page={page} setPage={setPage} formData={formData}
          handleChange={handleChange} handleFileChange={handleFileChange}
          handleUploadClick={handleUploadClick} handleRemoveImage={handleRemoveImage}
          handleSubmit={handleSubmit} isUploading={isUploading}
          uploadStatus={uploadStatus} uploadedImages={uploadedImages}
          buttonText={loading ? 'Creating...' : 'Create Job Posting'}
        />
      </div>
    </div>
  );
}
