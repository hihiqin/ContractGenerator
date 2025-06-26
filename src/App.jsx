import React, { useState } from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import contractIcon from './contract-icon.png';

function App() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    salary: '',
    responsibilities: '',
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateDoc = () => {
    if (!file) return alert('Please upload your contract');

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = () => {
      const zip = new PizZip(reader.result);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
      doc.setData(formData);

      try {
        doc.render();
        const blob = doc.getZip().generate({ type: 'blob' });
        const filename = `${formData.name || 'employee'}_contract.docx`;
        saveAs(blob, filename);
      } catch (error) {
        console.error('Fail to process :', error);
        alert('Bad process, check the format');
      }
    };
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',        // 水平居中 :contentReference[oaicite:1]{index=1}
    justifyContent: 'center',    // 垂直居中 :contentReference[oaicite:2]{index=2}
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'Arial'
  };
  const inputStyle = { maxWidth: '300px', width: '100%', margin: '6px 0', padding: '8px' };
  const textareaStyle = { ...inputStyle, minHeight: '100px' };

  return (
    <div style={containerStyle}>
       <img src={contractIcon} alt="Contract Icon" style={{ width: 200, height: 80, marginBottom: 20 }} />
      <h1>Contract Generator</h1>
      <input type="file" onChange={handleFileChange} accept=".docx" style={inputStyle} />
      <input name="name" placeholder="Name" onChange={handleChange} style={inputStyle} />
      <input type="date" name="startDate" onChange={handleChange} style={inputStyle} />
      <input
        type="number"
        name="salary"
        onChange={handleChange}
        min="0"
        max="10000000"
        step="500"
        placeholder="Salary"
        style={inputStyle}
      />
      <textarea
        name="responsibilities"
        placeholder="Duties"
        onChange={handleChange}
        style={textareaStyle}
      />
      <button onClick={generateDoc} style={{ marginTop: '12px', padding: '10px 20px' }}>
        Generate
      </button>
    </div>
  );
}

export default App;
