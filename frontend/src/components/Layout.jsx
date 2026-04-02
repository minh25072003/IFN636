const Layout = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url('/background.png')` }}
    >
      <div className="min-h-screen bg-black/60">
        {children}
      </div>
    </div>
  );
};

export default Layout;