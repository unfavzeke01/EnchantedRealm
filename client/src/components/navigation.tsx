import { Link, useLocation } from "wouter";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Public Dashboard" },
    { path: "/admin", label: "Admin" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h2 className="text-xl font-bold text-primary cursor-pointer">
                Whispering Network
              </h2>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <button
                  className={`transition-colors ${
                    location === item.path
                      ? "text-primary font-semibold"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
