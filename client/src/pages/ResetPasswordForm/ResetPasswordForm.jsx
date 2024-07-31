// ResetPasswordForm.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import newRequest from '../../utils/newRequest';

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();
  //const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await newRequest.post(`/auth/reset-password/${token}`, { newPassword });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error resetting password. Please try again.');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label>New Password:</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPasswordForm;
