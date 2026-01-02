import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { ProductsPage } from "./components/ProductsPage";
import { AdminPage } from "./components/AdminPage";
import { LoginPage } from "./components/LoginPage";
import {
  CustomerAccountPage,
  CustomerData,
  Order,
} from "./components/CustomerAccountPage";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { supabase, mapNyhetFromDB, NyheterDB } from './assets/supabase-client';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  variants?: string[];
};

export type CartItem = {
  product: Product;
  quantity: number;
  variant?: string;
};

export type NewsItem = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  image?: string;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    "home" | "products" | "admin" | "login" | "account"
  >("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState<
    string | null
  >(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Check if user is logged in on mount
  useEffect(() => {
    const loggedIn =
      localStorage.getItem("isLoggedIn") === "true";
    const admin = localStorage.getItem("isAdmin") === "true";
    const customerId = localStorage.getItem("customerId");
    setIsLoggedIn(loggedIn);
    setIsAdmin(admin);
    setCurrentCustomerId(customerId);
  }, []);

  // Customer database
  const [customers, setCustomers] = useState<CustomerData[]>([
    {
      id: "1",
      name: "Kari Nordmann",
      email: "kunde@test.no",
      phone: "+47 123 45 678",
      address: "Testveien 123, 1234 Testby",
      password: "kunde123",
    },
  ]);

  // Order history
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1001",
      date: "2025-12-10",
      items: [
        { name: "Wienerbrødsnurrer", quantity: 4, price: 35 },
        { name: "Konfekt", quantity: 2, price: 129 },
      ],
      total: 398,
      status: "completed",
    },
    {
      id: "1002",
      date: "2025-12-05",
      items: [
        { name: "Hamburgerbrød", quantity: 6, price: 45 },
        { name: "Focaccia 230g", quantity: 3, price: 90 },
      ],
      total: 360,
      status: "completed",
    },
  ]);

  const handleLogin = (
    username: string,
    password: string,
    isAdminLogin: boolean,
  ): boolean => {
    if (isAdminLogin) {
      // Admin login
      if (username === "admin" && password === "admin123") {
        setIsLoggedIn(true);
        setIsAdmin(true);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isAdmin", "true");
        setCurrentPage("admin");
        return true;
      }
    } else {
      // Customer login
      const customer = customers.find(
        (c) => c.email === username && c.password === password,
      );
      if (customer) {
        setIsLoggedIn(true);
        setIsAdmin(false);
        setCurrentCustomerId(customer.id);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isAdmin", "false");
        localStorage.setItem("customerId", customer.id);
        setCurrentPage("account");
        return true;
      }
    }
    return false;
  };

  const handleRegister = (
    email: string,
    password: string,
    name: string,
  ): boolean => {
    // Check if email already exists
    if (customers.some((c) => c.email === email)) {
      return false;
    }

    // Create new customer
    const newCustomer: CustomerData = {
      id: Date.now().toString(),
      name,
      email,
      phone: "",
      address: "",
      password,
    };

    setCustomers([...customers, newCustomer]);
    return true;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentCustomerId(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("customerId");
    setCurrentPage("home");
  };

  const handleUpdateProfile = (data: Partial<CustomerData>) => {
    if (!currentCustomerId) return;

    setCustomers(
      customers.map((c) =>
        c.id === currentCustomerId ? { ...c, ...data } : c,
      ),
    );
  };

  const handleChangePassword = (
    oldPassword: string,
    newPassword: string,
  ): boolean => {
    if (!currentCustomerId) return false;

    const customer = customers.find(
      (c) => c.id === currentCustomerId,
    );
    if (!customer || customer.password !== oldPassword) {
      return false;
    }

    setCustomers(
      customers.map((c) =>
        c.id === currentCustomerId
          ? { ...c, password: newPassword }
          : c,
      ),
    );
    return true;
  };

  const currentCustomer = customers.find(
    (c) => c.id === currentCustomerId,
  );
  const customerOrders = currentCustomerId
    ? orders.filter((o) => o.id.startsWith("100"))
    : [];

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Wienerbrødsnurrer",
      description:
        "Luftige wienerbrødsnurrer med smakfull fyll.",
      price: 35,
      image:
        "https://idefull.no/wp-content/uploads/2021/05/Karamellsnurr-fs.jpg",
      category: "wienerbrød",
      variants: ["Kanel", "Karamell"],
    },
    {
      id: "2",
      name: "Konfekt",
      description:
        "Hjemmelaget konfekt i fire deilige varianter. Perfekt som gave eller godteri.",
      price: 129,
      image:
        "https://plus.unsplash.com/premium_photo-1667031518595-9cb4b0d504ef?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "konfekt",
      variants: [
        "Salt karamell",
        "Lakris",
        "Pistasj",
        "Jordbær",
      ],
    },
    {
      id: "3",
      name: "Hamburgerbrød",
      description:
        "Myke og luftige hamburgerbrød. Perfekte til grillkvelden.",
      price: 45,
      image:
        "https://plus.unsplash.com/premium_photo-1671403964073-c8cfede9e3cc?q=80&w=693&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "brød",
      variants: ["Med sesamfrø", "Uten sesamfrø"],
    },
    {
      id: "4",
      name: "Focaccia 230g",
      description: "1 stk for 35 kr, 3 stk for 90 kr",
      price: 35,
      image:
        "https://images.unsplash.com/photo-1646851035330-f35fa5b44beb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb2NhY2NpYSUyMGJyZWFkJTIwaXRhbGlhbnxlbnwxfHx8fDE3NjU4NzU3NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "brød",
    },
  ]);

    const [news, setNews] = useState<NewsItem[]>([]);

  // Fetch news from Supabase on mount
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("nyheter")
        .select("*");

      if (error) {
        console.error("Database error ved henting av nyheter:", error);
        return;
      }

      if (data) {
        // Map database format to app format
        const mappedNews = data.map((item: NyheterDB) => mapNyhetFromDB(item));
        setNews(mappedNews);
      }
    } catch (error) {
      console.error("Feil ved henting av nyheter:", error);
    }
  };

  const addToCart = (product: Product, variant?: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.product.id === product.id &&
          item.variant === variant,
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id &&
          item.variant === variant
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { product, quantity: 1, variant }];
    });
  };

  const updateCartQuantity = (
    productId: string,
    quantity: number,
    variant?: string,
  ) => {
    if (quantity <= 0) {
      setCart((prevCart) =>
        prevCart.filter(
          (item) =>
            item.product.id !== productId ||
            item.variant !== variant,
        ),
      );
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId &&
          item.variant === variant
            ? { ...item, quantity }
            : item,
        ),
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        cartItemCount={cart.reduce(
          (sum, item) => sum + item.quantity,
          0,
        )}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {currentPage === "home" && <HomePage news={news} />}
        {currentPage === "products" && (
          <ProductsPage
            products={products}
            cart={cart}
            onAddToCart={addToCart}
            onUpdateCartQuantity={updateCartQuantity}
            onClearCart={clearCart}
          />
        )}
        {currentPage === "login" && (
          <LoginPage
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        )}
        {currentPage === "account" && currentCustomer && (
          <CustomerAccountPage
            customerData={currentCustomer}
            orders={customerOrders}
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={handleChangePassword}
          />
        )}
        {currentPage === "admin" &&
          (isLoggedIn && isAdmin ? (
            <AdminPage
              products={products}
              news={news}
              onUpdateProducts={setProducts}
              onUpdateNews={setNews}
            />
          ) : (
            <LoginPage
              onLogin={handleLogin}
              onRegister={handleRegister}
              adminOnly
            />
          ))}
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}