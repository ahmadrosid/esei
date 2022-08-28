import { Link } from "remix";

const Header = () => {
  return (
    <header className="flex justify-between items-center font-bold">
      <h1 className="text-2xl">
        <Link to="/">ESEI</Link>
        <div className="text-sm text-slate-600">
          Manage your project easily.
        </div>
      </h1>
      <div>
        <a href="/logout">
          <button type="button" className="text-xs text-slate-600 border border-slate-600 rounded-md px-4 py-2">
            Sign out
          </button>
        </a>
      </div>
    </header>
  );
};

export default Header;
