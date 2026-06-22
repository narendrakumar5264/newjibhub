import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ListingForm from '../components/listings/ListingForm';

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();

  const [page, setPage] = useState(1);
  const [files, setFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    recruiterName: "", companyName: "", jobTitle: "", imageUrls: [],
    salary: "", jobType: "", description: "", experienceRequired: "",
    skillsRequired: "", city: "", address: "",
  });

  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(`/api/listing/get/${params.listingId}`);
      const data = await res.json();
      if (data.success === false) { console.log(data.message); return; }
      setFormData(data);
      setUploadedImages(data.imageUrls || []);
    };
    fetchListing();
  }, [params.listingId]);

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
      const newImageUrls = await Promise.all(promises);
      setUploadedImages((prev) => [...prev, ...newImageUrls]);
      setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...newImageUrls] }));
      setIsUploading(false);
      setUploadStatus("All images uploaded successfully!");
      setFiles([]);
    } catch (error) {
      console.error("Error uploading:", error);
      setIsUploading(false);
      setUploadStatus("Some images failed to upload.");
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
        else reject(new Error(`Failed: ${file.name}`));
      };
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(data);
    });
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({ ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setError('You must upload at least one image');
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) { setError(data.message); }
      else { navigate(`/listing/${data._id}`); }
    } catch (error) { setError(error.message); setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-[#0b1120]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Update Job Posting</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Edit the details of your job.</p>
        </div>
        {error && <p className="text-sm text-rose-500 text-center mb-4 font-medium">{error}</p>}
        <ListingForm
          page={page} setPage={setPage} formData={formData}
          handleChange={handleChange} handleFileChange={handleFileChange}
          handleUploadClick={handleUploadClick} handleRemoveImage={handleRemoveImage}
          handleSubmit={handleSubmit} isUploading={isUploading}
          uploadStatus={uploadStatus} uploadedImages={uploadedImages}
          buttonText={loading ? 'Updating...' : 'Update Job Posting'}
        />
      </div>
    </div>
  );
}