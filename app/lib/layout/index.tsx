import Footer from "./Footer";
import Header from "./Header";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="mx-auto max-w-5xl p-8">
      <Header />
      <main className="my-[22px]">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
