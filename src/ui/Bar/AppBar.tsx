import './styles.css';

type AppBarProps = {
  className?: string,
  children?: React.ReactNode,
};

const AppBar = ({
  className,
  children
}: AppBarProps) => {
  return (
    <div className={`app-bar ${className ? className : ''}`}>
      {children}
    </div>
  );
};

export default AppBar;
