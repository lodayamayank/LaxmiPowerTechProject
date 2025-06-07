import axios from '../utils/axios';

export const syncOfflineAttendance = async () => {
  const offlineData = JSON.parse(localStorage.getItem('offlineAttendance')) || [];
  if (!offlineData.length) return;

  const token = localStorage.getItem('token');
  const successful = [];

  for (const record of offlineData) {
    try {
      const formData = new FormData();
      formData.append('lat', record.lat);
      formData.append('lng', record.lng);
      formData.append('punchType', record.punchType);
      formData.append('timestamp', record.timestamp);
      formData.append('selfie', dataURLtoFile(record.selfieBase64, `selfie-${record.timestamp}.jpg`));

      await axios.post('http://localhost:5000/api/attendance/punch', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      successful.push(record.timestamp);
    } catch (err) {
      console.error(`❌ Sync failed for ${record.timestamp}`, err);
    }
  }

  // Remove synced records from localStorage
  const remaining = offlineData.filter(r => !successful.includes(r.timestamp));
  localStorage.setItem('offlineAttendance', JSON.stringify(remaining));
};

// Helper: convert base64 to File
const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
};
