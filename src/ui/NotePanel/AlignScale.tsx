
type AlignScaleProps = {
  grid: number;
};

const GridAlignScale = ({
  grid,
}: AlignScaleProps) => {
  return (
    <div
      className="note-grid-scale note-grid-align-scale-container"
      style={{
        '--scale-count': grid
      } as React.CSSProperties}
    >
      {new Array(grid - 1).fill(0).map((_, index) => {
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
