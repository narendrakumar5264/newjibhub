import { useState, useContext } from "react";
import { FaUpload, FaCheckCircle, FaUser, FaEnvelope, FaPhone, FaBriefcase, FaCode, FaCloudUploadAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import emailjs from "emailjs-com";
import { ThemeContext } from "../context/ThemeContext";

const Recruitment = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", experience: "", skills: "", resume: null });
  const [resumeName, setResumeName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Email, setEmail] = useState("");
  const [Name, setname] = useState("");
  const { theme } = useContext(ThemeContext);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) { setFormData({ ...formData, resume: files[0] }); setResumeName(files[0].name); }
    else { setFormData({ ...formData, [name]: value }); }
    setEmail(formData.email);
    setname(formData.name);
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [scheduled, setScheduled] = useState(false);

  const sendEmail = () => {
    if (!Email) { console.error("Recipient email is missing!"); return; }
    const formattedDate = selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const templateParams = { to_email: Email, name: Name, date: formattedDate, time: selectedTime };
    emailjs.send("service_7x0mze5", "template_qi8ox7n", templateParams, "K_rJDVkuNgJtSvkqF")
      .then((response) => { console.log("Email sent!", response.status); })
      .catch((err) => { console.error("Failed to send email.", err); });
  };

  const handleSchedule = () => { setScheduled(true); sendEmail(); };

  const validateForm = () => {
    const { name, email, phone, experience, skills, resume } = formData;
    if (!name || !email || !phone || !experience || !skills || !resume) { alert("Please fill in all fields."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("Please enter a valid email."); return false; }
    if (!/^[0-9]{10}$/.test(phone)) { alert("Phone must be 10 digits."); return false; }
    if (!/^[0-9]+$/.test(experience)) { alert("Experience must be a number."); return false; }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setShowPopup(true);
      setIsSubmitting(false);
      setFormData({ name: "", email: "", phone: "", experience: "", skills: "", resume: null });
      setResumeName("");
    }, 2000);
  };

  const InputField = ({ icon, label, name, type = "text", value, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
        <input type={type} name={name} value={value} onChange={handleChange} required placeholder={placeholder}
          className="input-premium pl-11" />
      </div>
    </div>
  );

  return (
    <div className={`${theme === "dark" ? "dark" : ""} min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-[#0b1120]`}>
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Job Application</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Apply and start your career journey today.</p>
        </div>

        <div className="card-premium p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField icon={<FaUser className="text-sm" />} label="Full Name" name="name" value={formData.name} placeholder="John Doe" />
            <InputField icon={<FaEnvelope className="text-sm" />} label="Email" name="email" type="email" value={formData.email} placeholder="you@example.com" />
            <InputField icon={<FaPhone className="text-sm" />} label="Phone" name="phone" value={formData.phone} placeholder="9876543210" />
            <InputField icon={<FaBriefcase className="text-sm" />} label="Years of Experience" name="experience" value={formData.experience} placeholder="3" />
            <InputField icon={<FaCode className="text-sm" />} label="Skills" name="skills" value={formData.skills} placeholder="React, Node.js, MongoDB..." />

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Resume</label>
              <label className="cursor-pointer block">
                <div className="flex items-center justify-center gap-3 py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors">
                  <FaCloudUploadAlt className="text-xl text-slate-400" />
                  <span className="text-sm text-slate-500">{resumeName || "Click to upload resume"}</span>
                </div>
                <input type="file" name="resume" onChange={handleChange} required className="hidden" />
              </label>
              {resumeName && <p className="text-xs text-emerald-500 mt-1.5 font-medium">✓ {resumeName}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-gradient w-full py-3.5 rounded-xl text-sm uppercase tracking-wider disabled:opacity-60 mt-2">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : "Apply Now"}
            </button>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="card-premium p-8 max-w-md mx-4 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-emerald-500 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Application Submitted!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Increase your chances by scheduling an AI test.</p>

            {!scheduled ? (
              <div className="mt-6 space-y-4 text-left">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Select Date</label>
                  <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} className="input-premium w-full" minDate={new Date()} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Select Time</label>
                  <TimePicker onChange={setSelectedTime} value={selectedTime} className="w-full" />
                </div>
                <button className="btn-gradient w-full py-3 rounded-xl text-sm" onClick={handleSchedule}>
                  Confirm Schedule
                </button>
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                  ✅ Test scheduled on {selectedDate.toDateString()} at {selectedTime}
                </p>
                <p className="text-xs text-slate-500 mt-1">You'll receive an email 30 min before.</p>
              </div>
            )}

            <button className="mt-4 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium transition-colors" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;
