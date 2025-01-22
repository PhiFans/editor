import { useProps } from './PropsContext';

const GridAlignScale = () => {
  const { align } = useProps();

  return (
    <div
      className="note-grid-scale note-grid-align-scale-container"
      style={{
        '--scale-count': align
      } as React.CSSProperties}
    >
      {new Array(align - 1).fill(0).map((_, index) => {
        return <div
          className="note-grid-align-scale"
          style={{
            '--index': index + 1
          } as React.CSSProperties}
          key={index}
        />
      })}
    </div>
  )
};

export default GridAlignScale;
