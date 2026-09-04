import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from '../../api/axios';
import DataContext from '../../context/DataContext';
import styles from './AccountSettings.module.css';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function AccountSettings({ onLoaded, onAccountDeleted }) {
  const { user, setUser } = useContext(DataContext);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  const [deleteArmed, setDeleteArmed] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const newPasswordValid = PWD_REGEX.test(newPassword);
  const passwordsMatch = newPassword === confirmNewPassword;

  useEffect(() => {
    if (onLoaded) onLoaded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (!newPasswordValid) {
      setPwdError('New password must be 8-24 characters with an uppercase letter, lowercase letter, number and special character (!@#$%).');
      return;
    }
    if (!passwordsMatch) {
      setPwdError('New password and confirmation do not match.');
      return;
    }

    setPwdSaving(true);
    try {
      await axios.patch(
        '/api/v1/user',
        { password: currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
          withCredentials: true,
        }
      );
      setPwdSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      setPwdError(error.response?.data?.message || 'Failed to change password.');
    } finally {
      setPwdSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteArmed) {
      setDeleteArmed(true);
      return;
    }

    setDeleteError('');
    setDeleting(true);
    try {
      await axios.delete('/api/v1/user', {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        withCredentials: true,
        data: { password: deletePassword },
      });
      setUser({});
      if (onAccountDeleted) onAccountDeleted();
    } catch (error) {
      setDeleteError(error.response?.data?.message || 'Failed to delete account.');
      setDeleting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Account Settings</h2>
        <div className={styles.subtitle}>Manage your credentials and account</div>
      </div>

      <form className={styles.section} onSubmit={handleChangePassword}>
        <h3 className={styles.sectionTitle}>Change Password</h3>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            className={styles.input}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <span className={styles.hint}>8-24 characters, upper &amp; lowercase, a number and a special character.</span>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            id="confirmNewPassword"
            type="password"
            className={styles.input}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>

        {pwdError && <p className={styles.errorText}>{pwdError}</p>}
        {pwdSuccess && <p className={styles.successText}>{pwdSuccess}</p>}

        <motion.button
          type="submit"
          className={styles.saveBtn}
          disabled={pwdSaving || !currentPassword || !newPassword || !confirmNewPassword}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {pwdSaving ? 'Saving...' : 'Update Password'}
        </motion.button>
      </form>

      <div className={styles.section}>
        <h3 className={`${styles.sectionTitle} ${styles.dangerTitle}`}>Danger Zone</h3>

        {deleteArmed && (
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="deletePassword">Confirm Password</label>
            <input
              id="deletePassword"
              type="password"
              className={`${styles.input} ${styles.dangerInput}`}
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter your password to confirm"
              autoFocus
            />
          </div>
        )}

        {deleteError && <p className={styles.errorText}>{deleteError}</p>}

        <div className={styles.dangerActions}>
          {deleteArmed && (
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => {
                setDeleteArmed(false);
                setDeletePassword('');
                setDeleteError('');
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            className={`${styles.dangerBtn} ${deleteArmed ? styles.dangerBtnConfirm : ''}`}
            onClick={handleDeleteAccount}
            disabled={deleting || (deleteArmed && !deletePassword)}
          >
            {deleting
              ? 'Deleting...'
              : deleteArmed
                ? 'Yes, permanently delete my account'
                : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
