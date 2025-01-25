import PreviewCanvas from './Canvas';
import './styles.css';

const PreviewPanel = () => {
  return (
    <div className='live-preview'>
      <div className='preview-canvas'>
        <PreviewCanvas />
      </div>
      <div className="preview-controller"></div>
    </div>
  );
};

export default PreviewPanel;
