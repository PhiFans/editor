type ItemContainerProps = {
  title: string,
  children: React.ReactNode,
  className?: string,
  useLabel?: boolean,
};

const EditPanelItemContainer = ({
  title,
  children,
  className,
  useLabel,
}: ItemContainerProps) => {
  const childrenDom = (
    <>
      <div className="edit-panel-item-label">{title}</div>
      <div className={`edit-panel-item-input ${className}`}>{children}</div>
    </>
  );

  return (
    <>
      {useLabel ?
        <label className="edit-panel-item">{childrenDom}</label> :
        <div className="edit-panel-item">{childrenDom}</div>}
    </>
  );
};

export default EditPanelItemContainer;
