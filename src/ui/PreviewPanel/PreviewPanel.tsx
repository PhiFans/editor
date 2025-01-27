import PreviewCanvas from './Canvas';
import PreviewController from './Controller';
import './styles.css';

const PreviewPanel = () => {
  return (
    <div className='live-preview'>
      <div className='preview-canvas'>
        <PreviewCanvas />
      </div>
      <div className="preview-controller">
        <PreviewController />
      </div>
    </div>
  );
};

export default PreviewPanel;
