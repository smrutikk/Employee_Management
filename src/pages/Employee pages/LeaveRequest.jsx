import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiInfo, FiPaperclip, FiSend } from 'react-icons/fi';
import Navbar from '../../components/Navbar';

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    leaveType: 'vacation',
    startDate: '',
    endDate: '',
    duration: 'fullDay',
    reason: '',
    attachment: null,
    managerEmail: '' 
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const leaveTypes = [
    { value: 'vacation', label: 'Vacation' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'personal', label: 'Personal Leave' },
    { value: 'bereavement', label: 'Bereavement' },
    { value: 'other', label: 'Other' }
  ];

  const durationTypes = [
    { value: 'fullDay', label: 'Full Day' },
    { value: 'halfDayMorning', label: 'Half Day (Morning)' },
    { value: 'halfDayAfternoon', label: 'Half Day (Afternoon)' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    if (!formData.managerEmail) {
      newErrors.managerEmail = 'Manager email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.managerEmail)) {
      newErrors.managerEmail = 'Invalid email format';
    }
    if (!formData.reason) newErrors.reason = 'Reason is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormData({
        leaveType: 'vacation',
        startDate: '',
        endDate: '',
        duration: 'fullDay',
        reason: '',
        attachment: null,
        managerEmail: '' 
      });
    } catch (error) {
      console.error('Error submitting leave request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex">
      <Navbar />

      <div className="flex-1 overflow-auto p-6">
        <motion.div 
          className="bg-gray-800 rounded-xl p-6 shadow-xl mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <FiCalendar className="text-2xl text-purple-400" />
            <h1 className="text-2xl font-bold">Leave Request</h1>
          </div>

          {submitSuccess ? (
            <motion.div
              className="p-4 mb-6 bg-green-900/30 rounded-lg border border-green-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-2 text-green-400">
                <FiInfo className="text-xl" />
                <p className="font-medium">Your leave request has been submitted successfully!</p>
              </div>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="mt-4 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Another Request
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Leave Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Leave Type
                  </label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {leaveTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Duration
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {durationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full bg-gray-700 border ${
                      errors.startDate ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-400">{errors.startDate}</p>
                  )}
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full bg-gray-700 border ${
                      errors.endDate ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-400">{errors.endDate}</p>
                  )}
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-2">
  <label className="block text-sm font-medium text-gray-300">
    Assigned Manager Email <span className="text-red-500">*</span>
  </label>
  <input
    type="email"
    name="managerEmail"
    value={formData.managerEmail}
    onChange={handleChange}
    placeholder="Enter manager's email address"
    className={`w-full bg-gray-700 border ${
      errors.managerEmail ? 'border-red-500' : 'border-gray-600'
    } rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
  />
  {errors.managerEmail && (
    <p className="mt-1 text-sm text-red-400">{errors.managerEmail}</p>
  )}
</div>

              {/* Reason */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full bg-gray-700 border ${
                    errors.reason ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="Please provide details about your leave request..."
                />
                {errors.reason && (
                  <p className="mt-1 text-sm text-red-400">{errors.reason}</p>
                )}
              </div>

              {/* Attachment */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Attachment (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors w-full">
                      <FiPaperclip className="text-purple-400" />
                      <span className="text-sm">
                        {formData.attachment ? formData.attachment.name : 'Choose file'}
                      </span>
                    </div>
                    <input
                      type="file"
                      name="attachment"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                  {formData.attachment && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, attachment: null }))}
                      className="text-sm text-red-400 hover:text-red-300 whitespace-nowrap"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiSend className="text-lg" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Leave Balance Info */}
          <div className="mt-8 p-6 bg-blue-900/20 rounded-lg border border-blue-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiClock className="text-blue-400" /> Your Leave Balance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Vacation Days</p>
                <p className="text-xl font-bold">12/15</p>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Sick Days</p>
                <p className="text-xl font-bold">5/10</p>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Personal Days</p>
                <p className="text-xl font-bold">2/5</p>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Pending Requests</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaveRequest;