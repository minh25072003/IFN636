import Background from '../public/Background.png';

const Layout = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="min-h-screen bg-black/60">
        {children}
      </div>
    </div>
  );
};

export default Layout;