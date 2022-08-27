const Footer = () => {
  return (
    <footer className="flex items-center">
      <p className="text-sm text-slate-600">
        {new Date().getFullYear()} -{" "}
        <a href="https://ahmadrosid.com" target="_blank" rel="noreferrer" className="text-blue-600">
          @ahmadrosid
        </a>
      </p>
    </footer>
  );
};

export default Footer;
